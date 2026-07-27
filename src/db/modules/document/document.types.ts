import type { DocumentEntity } from './document.entity.ts'


export interface FindDocumentsPaginatedParams {
  orderBy?: {
    [K in keyof DocumentEntity]?: 'asc' | 'desc'
  }
  page?: number
  count?: number
}
