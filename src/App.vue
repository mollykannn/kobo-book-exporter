<template>
  <div class="container">
    <div class="switch-column">
      <label class="switch">
        <input type="checkbox" v-on:click="setting.isDark = !setting.isDark" :checked="setting.isDark" />
        <span class="slider"></span>
      </label>
    </div>
    <h1 class="title mb-4">Kobo Book Exporter</h1>
    <div class="file mb-4">
      <div class="file-upload mb-4" v-on:click.prevent="$refs.fileInput.click()" v-on:dragover.prevent v-on:drop.prevent="setting.importFile">
        {{ setting.fileName }}
      </div>
      <input type="file" ref="fileInput" class="hide" @change="setting.importFile" />
      <span class="small"
        >* Connect your kobo reader to a computer. You can find .kobo directory (hidden by default). There should be a KoboReader.sqlite file. Drop a
        file here.</span
      >
    </div>
    <div class="content mb-6" v-if="bookListData.loading">
      <div class="content-left">
        <div class="download-booklist">
          <button v-on:click="bookListData.Export('json')">JSON file</button>
          <button v-on:click="bookListData.Export('md')">Markdown file</button>
          <button v-on:click="bookListData.Export('csv')">CSV file</button>
        </div>
        <div class="booklist">
          <div class="booklist-scroll">
            <div
              v-for="data in bookListData.content"
              v-bind:key="data.ContentID"
              class="book-title"
              v-on:click="highlightData.Get(data.ContentID, data.BookTitle)"
            >
              {{ data.BookTitle }}
            </div>
          </div>
        </div>
      </div>
      <div class="content-right">
        <div class="highlight-preview">
          <div class="highlight-details mb-2" v-if="highlightData.loading">
            <div class="highlight-title">{{ highlightData.title }}</div>
            <button class="highlight-export" v-on:click="highlightData.Export()" v-if="highlightData.content">Export</button>
          </div>
          <textarea class="highlight-textarea" v-model="highlightData.content"></textarea>
        </div>
      </div>
    </div>
    <footer class="footer">
      Created by
      <a href="https://github.com/mollykannn">Molly Kan</a>
      / Retrieved from <a href="http://www.vixual.net/blog/archives/117">Kobo Exporter: 匯出 Kobo 電子書的書籍清單與註記資料 (劃線與筆記) | Vixual</a>
      <br />
      Icons made by <a href="http://www.freepik.com/" title="Freepik">Freepik</a> from
      <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
    </footer>
  </div>
</template>

<script>
import initSqlJs from 'sql.js'
import { computed, reactive } from 'vue'
import useMode from './assets/js/isDark.js'
import { BookListSQL, HighLightSQL } from './assets/js/sql.js'

export default {
  setup() {
    const setting = reactive({
      isDark: useMode(),
      fileName: 'Drop your .sqlite file here',
      dbData: '',
      importFile: (e) => {
        const [files] = e.target.files || e.dataTransfer.files
        setting.fileName = files.name
        const fileReader = new FileReader()
        fileReader.onload = async () => {
          let SQL = await initSqlJs()
          const db = new SQL.Database(new Uint8Array(fileReader.result))
          setting.dbData = db
          bookListData.Get() // GetBookListData
        }
        fileReader.readAsArrayBuffer(files)
      },
    })
    const bookListData = GetBookListData(setting)
    const highlightData = GetHighLightData(setting)

    return {
      setting,
      bookListData,
      highlightData,
    }
  },
}

function GetBookListData(setting) {
  const bookListData = reactive({
    loading: false,
    content: '',
    exportContent: computed(() =>
      bookListData.content.map((e) => {
        delete e.ContentID
        return e
      })
    ),
    Get: () => {
      const [res] = setting.dbData.exec(BookListSQL)
      bookListData.loading = true
      bookListData.content = res.values.map((element) => {
        return element.reduce((old, curr, index) => ((old[res.columns[index]] = curr), old), {})
      })
    },
    Export: (action) => {
      let content = ''
      let temp = JSON.parse(JSON.stringify(bookListData.exportContent))
      switch (action) {
        case 'json':
          content = JSON.stringify(temp)
          break
        case 'md':
          content += `| ${Object.keys(temp[0]).join(' | ')} |\n`
          content += `| ${Object.keys(temp[0]).reduce((old) => (old += '--- | '), '')}\n`
          delete temp[0]
          content += temp.reduce((old, curr) => (old += `| ${Object.values(curr).join(' | ')} |\n`), '')
          break
        case 'csv':
          content += `"${Object.keys(temp[0]).join('","')}"\n`
          delete temp[0]
          content += temp.reduce((old, curr) => (old += `"${Object.values(curr).join('","')}"\n`), '')
          break
      }
      exportFile(`bookList.${action}`, content)
    },
  })
  return bookListData
}

function GetHighLightData(setting) {
  const highlightData = reactive({
    loading: false,
    title: '',
    content: '',
    Get: (contentID, title) => {
      const [res] = setting.dbData.exec(HighLightSQL(contentID))
      highlightData.loading = true
      highlightData.title = title
      highlightData.content = res?.values.join('\n\n').split(',').join('  \n')
    },
    Export: () => {
      exportFile(`${highlightData.title}.md`, highlightData.content)
    },
  })
  return highlightData
}

const exportFile = (filename, content) => {
  var element = document.createElement('a')
  Object.assign(element, {
    href: `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`,
    download: filename,
    display: 'none',
  })
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}
</script>
