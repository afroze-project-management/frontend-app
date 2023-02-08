export interface HttpResponseModel<T = any> {
  data: T | null;
  isError: boolean;
  errorMessage: string;
}
