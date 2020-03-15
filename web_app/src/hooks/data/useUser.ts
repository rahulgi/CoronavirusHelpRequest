import { useState, useCallback } from "react";

import { User, getUser } from "../../firebase/storage/user";
import { FetchResult, FetchResultStatus } from ".";
import { useAsyncEffect } from "../useAsyncEffect";

export type UserResult = FetchResult<User>;

export function useUser(userId: string): UserResult {
  const [userResult, setUserResult] = useState<UserResult>({
    status: FetchResultStatus.LOADING,
    result: undefined,
    error: undefined
  });

  const fetchUser = useCallback(async (): Promise<UserResult> => {
    const user = await getUser(userId);
    return user
      ? {
          status: FetchResultStatus.FOUND,
          result: user,
          error: undefined
        }
      : {
          status: FetchResultStatus.NOT_FOUND,
          result: undefined,
          error: undefined
        };
  }, [userId]);
  const handleUser = useCallback(setUserResult, []);
  const handleUserError = useCallback((e: Error) => {
    console.error(e);
    setUserResult({
      status: FetchResultStatus.ERROR,
      result: undefined,
      error: "An error occurred fetching data for the user"
    });
  }, []);

  useAsyncEffect({
    asyncOperation: fetchUser,
    handleResponse: handleUser,
    handleError: handleUserError
  });

  return userResult;
}

const ANON_USERNAME = "Anonymous";

export function getDisplayNameOrDefault(userResult: UserResult) {
  switch (userResult.status) {
    case FetchResultStatus.FOUND:
      return userResult.result.displayName || ANON_USERNAME;
    case FetchResultStatus.NOT_FOUND:
      return ANON_USERNAME;
    default:
      return "";
  }
}
