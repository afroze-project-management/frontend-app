import axios, { AxiosRequestConfig } from "axios";
import { HttpResponseModel } from "../HttpResponseModel";

const externalApi = async <T,>(options: { config: AxiosRequestConfig<any>; }): Promise<HttpResponseModel<T>> => {
  try {

    const response = await axios<HttpResponseModel<T>>(options.config);

    return {
      data: response.data.data,
      errorMessage: '',
      isError: false
    }
  } catch (error) {
    return {
      data: null,
      errorMessage: (error as any).message,
      isError: true
    }
  }
}

export default externalApi;