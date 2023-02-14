export interface ErrorState {
  showError: boolean;
  errorMessage: string;
}

export const errorStateDefaults: ErrorState = {
  showError: false,
  errorMessage: ''
}