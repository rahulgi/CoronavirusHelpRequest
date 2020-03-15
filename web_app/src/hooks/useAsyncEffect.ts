/**
 * Source: Every.org codebase. Used with permission by Rahul Gupta-Iwasaki.
 */
import { useEffect } from "react";

/**
 * This hook wraps useEffect to properly unsubscribe from async operations if
 * the component is unmounted prior to the async operation returning.
 *
 * https://github.com/facebook/react/issues/14369#issuecomment-468267798
 */
export function useAsyncEffect<AsyncOperationReturnType>({
  asyncOperation,
  handleResponse,
  handleError
}: {
  asyncOperation: () => Promise<AsyncOperationReturnType>;
  handleResponse: (response: AsyncOperationReturnType) => void;
  handleError: (e: Error) => void;
}) {
  useEffect(() => {
    let unsubscribedFromQuery = false;
    async function executeAsyncOperation() {
      try {
        const response = await asyncOperation();
        if (!unsubscribedFromQuery) {
          await handleResponse(response);
        }
      } catch (e) {
        handleError(e);
      }
    }
    executeAsyncOperation();
    return () => {
      unsubscribedFromQuery = true;
    };
  }, [asyncOperation, handleError, handleResponse]);
}
