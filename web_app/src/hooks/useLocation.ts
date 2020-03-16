import { useState, useCallback } from "react";
import { useAsyncEffect } from "./useAsyncEffect";
import { Location, getCurrentLocation } from "../components/helpers/location";

export function useLocation(): Location {
  const [location, setLocation] = useState<Location>({
    lng: -122.42905,
    lat: 37.77986
  });

  const fetchLocation = useCallback(getCurrentLocation, []);
  const handleLocation = useCallback(setLocation, []);
  const handleLocationError = useCallback((e: Error) => {
    console.error(e);
  }, []);

  useAsyncEffect({
    asyncOperation: fetchLocation,
    handleResponse: handleLocation,
    handleError: handleLocationError
  });

  return location;
}
