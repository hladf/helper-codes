import { GenericObjectType } from './Generics'

type ErrorDetails = { message: string } | { message: string }[]

export interface IFetchApiDataResponse<T> {
  data?: T
  error?: ErrorDetails
  status: number
  success: boolean
}

export interface IFetchApiDataParams extends GenericObjectType {
  page?: number
  perPage?: number
}
