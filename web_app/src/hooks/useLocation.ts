import { useState, useCallback } from "react";
import { useAsyncEffect } from "./useAsyncEffect";
import { Location, getCurrentLocation } from "../components/helpers/location";

export enum LocationStatus {
  LOADING = "LOADING",
  FOUND = "FOUND",
  UNABLE_TO_RETRIEVE = "UNABLE_TO_RETRIEVE"
}

type LocationResult =
  | {
      status: LocationStatus.LOADING | LocationStatus.UNABLE_TO_RETRIEVE;
      location: undefined;
    }
  | {
      status: LocationStatus.FOUND;
      location: Location;
    };

export function useLocation(): LocationResult {
  const [locationResult, setLocationResult] = useState<LocationResult>({
    status: LocationStatus.LOADING,
    location: undefined
  });

  const fetchLocation = useCallback(async (): Promise<LocationResult> => {
    try {
      return {
        status: LocationStatus.FOUND,
        location: await getCurrentLocation()
      };
    } catch (e) {
      console.error(e);
      return {
        status: LocationStatus.UNABLE_TO_RETRIEVE,
        location: undefined
      };
    }
  }, []);
  const handleLocation = useCallback(setLocationResult, []);
  const handleLocationError = useCallback((e: Error) => {
    console.error(e);
    setLocationResult({
      status: LocationStatus.UNABLE_TO_RETRIEVE,
      location: undefined
    });
  }, []);

  useAsyncEffect({
    asyncOperation: fetchLocation,
    handleResponse: handleLocation,
    handleError: handleLocationError
  });

  return locationResult;
}
