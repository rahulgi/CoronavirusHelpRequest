export interface Location {
  lat: number;
  lng: number;
}

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
