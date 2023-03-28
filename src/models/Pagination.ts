export interface IPagination<T> {
  currentPageData: T[]
  currentPage: number
  perPage: number
  totalPages: number
  totalResults: number
  perPageOptions?: number[]
}

export interface IUsePagination<T = any> extends IPagination<T> {
  setData: (data: T[]) => void
  setPage: (page: number) => void
  setPerPage: (count: number) => void
}
