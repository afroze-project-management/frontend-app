export interface HttpResponseModel<T> {
  data: T;
  isError: boolean;
  errorMessage: string;
}
