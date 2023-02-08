import { AxiosRequestConfig } from "axios";

const baseUrl = 'http://localhost:8012';

const getBaseConfig = (url: string, method: string, token: string): AxiosRequestConfig<any> => {
  return {
    url: `${baseUrl}${url}`,
    method: method,
    headers: {
      "content-type": "application/json",
      'Authorization': `bearer ${token}`
    },
  };
}

export default getBaseConfig;