import { useState, useCallback } from "react";

import { FetchResult, FetchResultStatus } from ".";
import {
  HelpOffer,
  HelpOfferFilters,
  getHelpOffers
} from "../../firebase/storage/helpOffer";
import { useAsyncEffect } from "../useAsyncEffect";

export type HelpOffersResult = FetchResult<HelpOffer[]>;

export function useHelpOffers(filters?: HelpOfferFilters): HelpOffersResult {
  const [helpOffersResult, setHelpOffersResult] = useState<HelpOffersResult>({
    status: FetchResultStatus.LOADING,
    result: undefined,
    error: undefined
  });

  const fetchHelpOffers = useCallback(async (): Promise<HelpOffersResult> => {
    setHelpOffersResult({
      status: FetchResultStatus.LOADING,
      result: undefined,
      error: undefined
    });
    return {
      status: FetchResultStatus.FOUND,
      result: await getHelpOffers({ filters }),
      error: undefined
    };
  }, [filters]);
  const handleHelpOffers = useCallback(setHelpOffersResult, []);
  const handleHelpOffersError = useCallback((e: Error) => {
    console.error(e);
    setHelpOffersResult({
      status: FetchResultStatus.ERROR,
      result: undefined,
      error: "An error occurred while fetching Help Offers."
    });
  }, []);

  useAsyncEffect({
    asyncOperation: fetchHelpOffers,
    handleResponse: handleHelpOffers,
    handleError: handleHelpOffersError
  });

  return helpOffersResult;
}
