import getBaseConfig from "../configs/axiosConfig";
import externalApi from "../configs/externalApi";
import { HttpResponseModel } from "../HttpResponseModel";
import { CompanyResponseModel } from "./CompanyResponseModel";

const getCompanies = async (token: string): Promise<CompanyResponseModel[]> => {
  const config = getBaseConfig('/company', 'GET', token);
  const response: HttpResponseModel<CompanyResponseModel[]> = await externalApi<CompanyResponseModel[]>({ config });
  return response.data ?? [];
}

const deleteCompany = async (token: string, id: string): Promise<void> => {
  const config = getBaseConfig(`/company/${id}/`, 'DELETE', token);
  console.log(config);
  await externalApi<void>({ config });
}

export { getCompanies, deleteCompany }