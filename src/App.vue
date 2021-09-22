<template>
  <div class="container">
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
          <button v-on:click="downloadBookList('json')">JSON file</button>
          <button v-on:click="downloadBookList('md')">Markdown file</button>
          <button v-on:click="downloadBookList('csv')">CSV file</button>
        </div>
        <div class="booklist">
          <div class="booklist-scroll">
            <div
              v-for="title in bookTitleList"
              v-bind:key="title.index"
              class="bookTitle"
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
              v-on:click="exportFile(`${exportHighlightData.title}.md`, exportHighlightData.content)"
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

export default {
  setup () {
    const fileName = ref('Drop your .sqlite file here')
    const dbData = ref()
    const exportBookListData = reactive({
      loading: false,
      content: ''
    })
    const exportHighlightData = reactive({
      loading: false,
      title: '',
      content: ''
    })
    const bookTitleList = ref()

    function importFile (e) {
      var files = e.target.files || e.dataTransfer.files
      var fileReader = new FileReader()
      fileName.value = files[0].name
      fileReader.onload = function () {
        initSqlJs().then(function (SQL) {
          var db = new SQL.Database(new Uint8Array(fileReader.result))
          dbData.value = db
          const array = []
          // Export BookList Data
          db.each(
            `SELECT
              IFNULL(Title,'') as 'Book Title', 
              IFNULL(Subtitle,'') as 'Sub Title', 
              IFNULL(Attribution,'') as 'Author', 
              IFNULL(Publisher,'') as 'Publisher', 
              IFNULL(ISBN,0) as 'ISBN', 
              IFNULL(date(DateCreated),'') as 'Release Date',
              IFNULL(Series,'') as 'Series', 
              IFNULL(SeriesNumber,0) as 'SeriesNumber', 
              IFNULL(AverageRating,0) as 'Rating', 
              IFNULL(___PercentRead,0) as 'ReadPercent',
              IFNULL(CASE WHEN ReadStatus>0 THEN datetime(DateLastRead) END,'') as 'Last Read',
              IFNULL(___FileSize,0) as 'File Size',
              IFNULL(CASE WHEN Accessibility=1 THEN 'Store' ELSE CASE WHEN Accessibility=-1 THEN 'Import' ELSE CASE WHEN Accessibility=6 THEN 'Preview' ELSE 'Other' END END END,'') as 'Source'
            FROM content
              WHERE ContentType=6 AND ___UserId IS NOT NULL AND ___UserId != '' AND ___UserId != 'removed'
              ORDER BY Source desc, Title`,
            {},
            function (row) {
              array.push(row)
            }
          )
          exportBookListData.loading = true
          exportBookListData.content = array

          // Book Title List
          const res = db.exec(
            `SELECT 
              ContentID, 
              Title
            FROM content 
            WHERE ContentType = 6 AND ___UserId IS NOT NULL AND ___UserId != '' AND ___UserId != 'removed'
            ORDER BY DateLastRead DESC`
          )
          bookTitleList.value = res[0].values
        })
      }
      fileReader.readAsArrayBuffer(files[0])
    }

    function downloadBookList (action) {
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

    function previewHighlight (contentID, title) {
      const res = dbData.value.exec(
        `SELECT 
        '#' || row_number() over (partition by B.Title order by T.ContentID, T.ChapterProgress), 
        TRIM(REPLACE(REPLACE(T.Text,CHAR(10),''),CHAR(9),''))
        FROM content AS B, bookmark AS T
        WHERE B.ContentID = T.VolumeID AND T.Text != '' AND T.Hidden = 'false' AND B.ContentID = '${contentID}'
        ORDER BY T.ContentID, T.ChapterProgress;`
      )
      exportHighlightData.loading = true
      exportHighlightData.title = title
      exportHighlightData.content = res[0]?.values.join('\n\n').split(',').join('  \n')
    }

    function exportFile (filename, content) {
      const element = document.createElement('a')
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
      element.setAttribute('download', filename)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }

    return {
      fileName,
      dbData,
      exportBookListData,
      exportHighlightData,
      bookTitleList,
      importFile,
      exportFile,
      downloadBookList,
      previewHighlight
    }
  }
}
</script>
