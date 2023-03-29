import { Database } from 'sql.js'

export interface Setting {
  fileName: string
  dbData: Database | null,
  importFile: (e: DragEvent) => void
}
