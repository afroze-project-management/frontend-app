import getBaseConfig from "../configs/axiosConfig";
import externalApi from "../configs/externalApi";
import { HttpResponseModel } from "../HttpResponseModel";
import { ProjectResponseModel } from "./ProjectResponseModel";

const getProjects = async (token: string): Promise<ProjectResponseModel[]> => {
  const config = getBaseConfig('/project', 'GET', token);
  const response: HttpResponseModel<ProjectResponseModel[]> = await externalApi<ProjectResponseModel[]>({ config });
  return response.data ?? [];
}

export { getProjects }