import { HttpResponse } from './http'
export interface Middleware {
  handle: (httpRequest: any) => Promise<HttpResponse>
}
