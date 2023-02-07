import { TaskResponseModel } from "./TaskResponseModel";

export interface ProjectResponseModel {
  id: number;
  name: string;
  tags: string;
  tasks: TaskResponseModel[];
  companyId: number;
}

