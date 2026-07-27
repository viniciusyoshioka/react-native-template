import type { Paginated } from '../../types/index.ts'
import type { DocumentEntity } from './document.entity.ts'
import type { FindDocumentsPaginatedParams } from './document.types.ts'


export interface DocumentRepository {
  findPaginated(params: FindDocumentsPaginatedParams): Promise<Paginated<DocumentEntity>>
}
