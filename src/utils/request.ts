import axios, { AxiosInstance, Method, AxiosRequestConfig } from "axios"

export class HttpRequest {
  private httpClient: AxiosInstance

  constructor(baseURL: string) {
    this.httpClient = axios.create({ baseURL })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(path: string, params?: any, opts?: AxiosRequestConfig) {
    return this.request("get", path, params, opts)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post(path: string, body?: any, opts?: AxiosRequestConfig) {
    return this.request("post", path, body, opts)
  }

  request(
    method: Method,
    path: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params?: any,
    opts: AxiosRequestConfig = {}
  ) {
    const options = {
      method,
      url: path,
      ...opts,
    }

    if (params) {
      if (method === "get") {
        options.params = params
      } else {
        options.data = params
      }
    }

    return this.httpClient
      .request(options)
      .then((response) => {
        return { result: response.data, status: response.status }
      })
      .catch((err) => {
        let error = err
        try {
          error = err.response && err.response.data
        } catch (err) {
          throw error
        }
        throw error
      })
  }
}

export default HttpRequest
