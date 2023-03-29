import { computed, reactive } from 'vue'
import { exportFile } from './tools';
import { BookListSQL } from './sql'
import { Setting } from './type';


interface BookListData {
  loading: boolean
  content: BookListDetails[]
  Get: () => void
  Export: (action: string) => void
}

interface BookListDetailExport {
  Author: string
  BookTitle: string
  FileSize: number
  ISBN: string
  LastRead: string
  Publisher: string
  Rating: number
  ReadPercent: number
  ReleaseDate: string
  Series: string
  SeriesNumber: string
  Source: string
  SubTitle: string
}

interface BookListDetails extends BookListDetailExport {
  ContentID: string
}

export const GetBookListData = (setting: Setting) => {
  const exportContent = computed<BookListDetailExport[]>(() => {
    return bookListData.content.reduce((old, curr) => {
      const { ContentID: _, ...details } = curr
      old.push(details)
      return old
    }, [] as BookListDetailExport[])
  });
  const bookListData = reactive<BookListData>({
    loading: false,
    content: [],
    Get: () => {
      const [res] = setting.dbData.exec(BookListSQL)
      bookListData.loading = true
      bookListData.content = res.values.map(element =>
        element.reduce(
          (old, curr, index) => ({
            ...old,
            [res.columns[index]]: curr,
          }),
          {} as BookListDetails
        )
      )
    },
    Export: (action: string) => {
      let content = ''
      const temp: Array<BookListDetailExport> = JSON.parse(JSON.stringify(exportContent))
      switch (action) {
        case 'json':
          content = JSON.stringify(temp)
          break
        case 'md':
          content += `| ${Object.keys(temp[0]).join(' | ')} |\n`
          content += `| ${Object.keys(temp[0]).reduce(old => (old += '--- | '), '')}\n`
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