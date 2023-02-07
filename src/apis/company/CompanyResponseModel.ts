import { ProjectSummaryResponseModel } from "../project/ProjectSummaryResponseModel";

export interface CompanyResponseModel {
  id: number;
  name: string;
  tags: string;
  projects: ProjectSummaryResponseModel[]
}
