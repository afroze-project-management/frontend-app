export interface TaskResponseModel {
  id: number;
  name: string;
  description: string;
  estimatedEffort: number;
  actualEffort: number;
  isComplete: boolean;
  userId: number;
}