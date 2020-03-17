import geohash from "ngeohash";

export interface Location {
  lat: number;
  lng: number;
}

export const DEFAULT_LOCATION: Location = {
  lng: -122.42905,
  lat: 37.77986
};
export const DEFAULT_LOCATION_NAME = "San Francisco, California, USA";

export async function getCurrentLocation(): Promise<Location> {
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
      reject("Geolocation not supported.");
    }
  });
}

function degreesToRadians(deg: number) {
  return deg * (Math.PI / 180);
}

/**
 * Source: https://stackoverflow.com/a/27943/888970
 */
export function getDistanceFromLatLngInKm(
  { lat: lat1, lng: lng1 }: Location,
  { lat: lat2, lng: lng2 }: Location
) {
  var R = 6371; // Radius of the earth in km
  var dLat = degreesToRadians(lat2 - lat1); // deg2rad below
  var dLon = degreesToRadians(lng2 - lng1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(lat1)) *
      Math.cos(degreesToRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

/**
 * Calculate the upper and lower boundary geohashes for a given latitude,
 * longitude, and distance in miles.
 *
 * @param latitude
 * @param longitude
 * @param distance in kilometers
 */
export const getGeohashRange = (
  latitude: number,
  longitude: number,
  distance: number
) => {
  const lat = 0.009009009009; // approximate degrees latitude per kilometer
  const lon = 0.01176470588; // approximate degrees longitude per kilometer at 40degrees

  const lowerLat = latitude - lat * distance;
  const lowerLon = longitude - lon * distance;

  const upperLat = latitude + lat * distance;
  const upperLon = longitude + lon * distance;

  const lower = geohash.encode(lowerLat, lowerLon);
  const upper = geohash.encode(upperLat, upperLon);

  return {
    lower,
    upper
  };
};
