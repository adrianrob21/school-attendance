export type NextType = any;
export type ActionType = any;
export type PayloadType = any;
export type ErrorType = any;

export interface SetLoadingTypes {
  isLoading: boolean;
  next: NextType;
  options: {
    key: string;
    value?: any;
  };
}

export interface CreatePersistMiddlewareType {
  blackList: string[];
}
