import { useState, useCallback } from "react";
import { useAsyncEffect } from "./useAsyncEffect";

export interface Location {
  lat: number;
  lng: number;
}

async function getLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        function() {
          reject("Location permissions denied.");
        }
      );
    } else {
      // Browser doesn't support Geolocation
      reject("Geolocation not support.");
    }
  });
}

export function useLocation(): Location {
  const [location, setLocation] = useState<Location>({
    lng: -122.42905,
    lat: 37.77986
  });

  const fetchLocation = useCallback(getLocation, []);
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
