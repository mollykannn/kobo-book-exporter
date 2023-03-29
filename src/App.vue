<script setup lang="ts">
import { ref, computed, reactive, getCurrentInstance } from 'vue'
import { GetBookListData } from './assets/js/booklist';
import { GetHighLightData } from './assets/js/highlight';
import { Setting } from './assets/js/type';

const SQL = getCurrentInstance().appContext.config.globalProperties.SQL;
const fileInput = ref<HTMLInputElement | null>(null)
const mode = ref<boolean>(window.matchMedia('(prefers-color-scheme: dark)').matches)
const isDark = computed<boolean>({
  get: () => mode.value,
  set: val => {
    mode.value = val
    document.documentElement.setAttribute('data-theme', val ? 'dark' : 'light')
  },
})
const setting = reactive<Setting>({
  fileName: 'Drop your .sqlite file here',
  dbData: new SQL.Database(),
  importFile: e => {
    const target = e.target as HTMLInputElement
    const dataTransfer = e.dataTransfer as DataTransfer
    const files = target.files || dataTransfer.files || null
    if (files === null) return
    setting.fileName = files[0].name
    const fileReader = new FileReader()
    fileReader.onload = async () => {
      if (typeof fileReader.result === 'string') return
      setting.dbData = new SQL.Database(new Uint8Array(fileReader.result))
      bookListData.Get()
    }
    fileReader.readAsArrayBuffer(files[0])
  },
})
const bookListData = GetBookListData(setting)
const highlightData = GetHighLightData(setting)
</script>
<template>
  <div class="container">
    <div class="switch-column">
      <label
        class="switch"
      >
        <input
          id="darkMode"
          type="checkbox"
          :checked="isDark"
          @click="isDark = !isDark"
        >
        <span class="slider" />
      </label>
    </div>
    <h1 class="title mb-4">
      Kobo Book Exporter
    </h1>
    <div class="file mb-4">
      <div
        class="file-upload mb-4"
        @click.prevent="fileInput?.click()"
        @dragover.prevent
        @drop.prevent="setting.importFile"
      >
        {{ setting.fileName }}
      </div>
      <input
        ref="fileInput"
        label="uploadFile"
        type="file"
        class="hide"
        @change="setting.importFile"
      >
      <span class="small">* Connect your kobo reader to a computer. You can find .kobo directory (hidden by default). There should be a KoboReader.sqlite file. Drop a
        file here.</span>
    </div>
    <div
      v-if="bookListData.loading"
      class="content mb-6"
    >
      <div class="content-left">
        <div class="download-booklist">
          <button @click="bookListData.Export('json')">
            JSON file
          </button>
          <button @click="bookListData.Export('md')">
            Markdown file
          </button>
          <button @click="bookListData.Export('csv')">
            CSV file
          </button>
        </div>
        <div class="booklist">
          <div class="booklist-scroll">
            <div
              v-for="data in bookListData.content"
              :key="data.ContentID"
              class="book-title"
              @click="highlightData.Get(data.ContentID, data.BookTitle)"
            >
              {{ data.BookTitle }}
            </div>
          </div>
        </div>
      </div>
      <div class="content-right">
        <div class="highlight-preview">
          <div
            v-if="highlightData.loading"
            class="highlight-details mb-2"
          >
            <div class="highlight-title">
              {{ highlightData.title }}
            </div>
            <button
              v-if="highlightData.content"
              class="highlight-export"
              @click="highlightData.Export()"
            >
              Export
            </button>
          </div>
          <textarea
            v-model="highlightData.content"
            class="highlight-textarea"
          />
        </div>
      </div>
    </div>
    <footer class="footer">
      Created by
      <a href="https://github.com/mollykannn">Molly Kan</a>
      / Retrieved from <a href="http://www.vixual.net/blog/archives/117">Kobo Exporter: 匯出 Kobo 電子書的書籍清單與註記資料 (劃線與筆記) | Vixual</a>
      <br>
      Icons made by
      <a
        href="http://www.freepik.com/"
        title="Freepik"
      >Freepik</a> from
      <a
        href="https://www.flaticon.com/"
        title="Flaticon"
      > www.flaticon.com</a>
    </footer>
  </div>
</template>
