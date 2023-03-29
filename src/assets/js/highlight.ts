import { reactive } from 'vue'
import { exportFile } from './tools';
import { HighLightSQL } from './sql'
import { Setting } from './type';

interface HighlightData {
  loading: boolean
  title: string
  content: string
  Get: (contentID: string, title: string) => void
  Export: () => void
}

export const GetHighLightData = (setting: Setting) => {
  const highlightData = reactive<HighlightData>({
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
