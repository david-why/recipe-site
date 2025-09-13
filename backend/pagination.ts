import { sql } from 'bun'
import { Pagination } from '~/shared/types'

export function getPaginationParams(url: URL, maxSize = 10): Pagination {
  const page = parseInt(url.searchParams.get('page') || '1')
  const size = parseInt(url.searchParams.get('size') || '10')
  return {
    page: Math.max(1, page),
    size: Math.min(Math.max(1, size), maxSize),
  }
}

export function getSqlLimitOffset(pagination?: Pagination) {
  if (!pagination) return sql``
  const offset = (pagination.page - 1) * pagination.size
  return sql`LIMIT ${pagination.size} OFFSET ${offset}`
}
