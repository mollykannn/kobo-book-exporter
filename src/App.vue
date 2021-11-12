<template>
  <div class="container">
    <div class="switch-column">
      <label class="switch">
        <input
          type="checkbox"
          v-on:click="onChangeMode()"
          :checked="isDark"
        >
        <span class="slider"></span>
      </label>
    </div>
    <h1 class="title">Kobo Book Exporter</h1>
    <div class="file">
      <div
        class="file-upload"
        v-on:click.prevent="$refs.fileInput.click()"
        v-on:dragover.prevent
        v-on:drop.prevent="importFile"
      >
        {{ fileName }}
      </div>
      <input
        type="file"
        ref="fileInput"
        class="hide"
        @change="importFile"
      >
      <span class="small">* Connect your kobo reader to a computer. You can find .kobo directory (hidden by default).
        There should be a KoboReader.sqlite file. Drop a file here.</span>
    </div>
    <div
      class="content"
      v-if="exportBookListData.loading"
    >
      <div class="content-left">
        <div class="download-booklist">
          <button v-on:click="exportBookList('json')">JSON file</button>
          <button v-on:click="exportBookList('md')">Markdown file</button>
          <button v-on:click="exportBookList('csv')">CSV file</button>
        </div>
        <div class="booklist">
          <div class="booklist-scroll">
            <div
              v-for="title in bookTitleList"
              v-bind:key="title.index"
              class="book-title"
              v-on:click="previewHighlight(title[0],title[1])"
            >
              {{ title[1] }}
            </div>
          </div>
        </div>
      </div>
      <div class="content-right">
        <div class="highlight-preview">
          <div
            class="highlight-details"
            v-if="exportHighlightData.loading"
          >
            <div class="highlight-title">{{ exportHighlightData.title }}</div>
            <button
              class="highlight-export"
              v-on:click="exportHighlight()"
              v-if="exportHighlightData.content"
            >Export</button>
          </div>
          <textarea
            class="highlight-textarea"
            v-model="exportHighlightData.content"
          ></textarea>
        </div>
      </div>
    </div>
    <footer class="footer">
      Created by
      <a href="https://github.com/mollykannn">Molly Kan</a>
      / Retrieved from <a href="http://www.vixual.net/blog/archives/117">Kobo Exporter: 匯出 Kobo 電子書的書籍清單與註記資料 (劃線與筆記) | Vixual</a>
      <br />
      Icons made by <a
        href="http://www.freepik.com/"
        title="Freepik"
      >Freepik</a> from <a
        href="https://www.flaticon.com/"
        title="Flaticon"
      > www.flaticon.com</a>
    </footer>
  </div>
</template>

<script>
import initSqlJs from 'sql.js'
import { ref, reactive } from 'vue'
import useMode from './assets/js/isDark.js'
import { BookTitleList, BookList, HighLight } from './assets/js/sql.js'

export default {
  setup() {
    const { isDark, onChangeMode } = useMode()
    const { dbData, fileName, exportBookListData, bookTitleList, importFile } = init()
    const { exportHighlightData, previewHighlight } = hightLightData(dbData)
    const { exportBookList, exportHighlight } = exportData(exportBookListData, exportHighlightData)

    return {
      isDark,
      onChangeMode,
      dbData,
      fileName,
      exportBookListData,
      bookTitleList,
      importFile,
      exportHighlightData,
      previewHighlight,
      exportBookList,
      exportHighlight,
    }
  },
}

function init() {
  const dbData = ref()
  const exportBookListData = reactive({
    loading: false,
    content: '',
  })
  const bookTitleList = ref()
  const fileName = ref('Drop your .sqlite file here')

  const importFile = (e) => {
    let files = ""
    const fileReader = new FileReader()
    files = e.target.files || e.dataTransfer.files
    fileName.value = files[0].name
    fileReader.onload = function () {
      initSqlJs().then(function (SQL) {
        const db = new SQL.Database(new Uint8Array(fileReader.result))
        dbData.value = db
        const array = []
        // Export BookList Data
        db.each(BookList, {}, function (row) {
          array.push(row)
        })
        exportBookListData.loading = true
        exportBookListData.content = array

        // Book Title List
        const res = db.exec(BookTitleList)
        bookTitleList.value = res[0].values
      })
    }
    fileReader.readAsArrayBuffer(files[0])
  }
  return {
    dbData,
    fileName,
    exportBookListData,
    bookTitleList,
    importFile,
  }
}

function hightLightData(dbData) {
  const exportHighlightData = reactive({
    loading: false,
    title: '',
    content: '',
  })

  const previewHighlight = (contentID, title) => {
    const res = dbData.value.exec(HighLight(contentID))
    exportHighlightData.loading = true
    exportHighlightData.title = title
    exportHighlightData.content = res[0]?.values.join('\n\n').split(',').join('  \n')
  }

  return {
    exportHighlightData,
    previewHighlight,
  }
}

function exportData(exportBookListData, exportHighlightData) {
  const exportBookList = (action) => {
    const filename = `bookList.${action}`
    let content = ''
    if (action === 'json') {
      content = JSON.stringify(exportBookListData.content)
    } else if (action === 'md') {
      exportBookListData.content.forEach((e, index) => {
        if (index === 0) {
          content += `| ${Object.keys(e).toString().split(',').join(' | ')} |\n`
          content += `${Object.keys(e)
            .map(() => '| --- ')
            .toString()
            .split(',')
            .join('')}|\n`
        }
        content += `| ${Object.values(e).toString().split(',').join(' | ')} |\n`
      })
    } else {
      exportBookListData.content.forEach((e, index) => {
        content += index === 0 ? `"${Object.keys(e).join('","')}"\n` : ''
        content += `"${Object.values(e).join('","')}"\n`
      })
    }
    exportFile(filename, content)
  }

  const exportHighlight = () => {
    exportFile(`${exportHighlightData.title}.md`, exportHighlightData.content)
  }

  const exportFile = (filename, content) => {
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
    element.setAttribute('download', filename)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }
  return {
    exportBookList,
    exportHighlight,
  }
}
</script>
