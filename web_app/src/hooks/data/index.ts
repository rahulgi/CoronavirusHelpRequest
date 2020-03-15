export enum FetchResultStatus {
  LOADING = "LOADING",
  NOT_FOUND = "NOT_FOUND",
  FOUND = "FOUND",
  ERROR = "ERROR"
}

export type FetchResult<ResultType> =
  | {
      status: FetchResultStatus.LOADING | FetchResultStatus.NOT_FOUND;
      result: undefined;
      error: undefined;
    }
  | {
      status: FetchResultStatus.FOUND;
      result: ResultType;
      error: undefined;
    }
  | {
      status: FetchResultStatus.ERROR;
      result: undefined;
      error: string;
    };
