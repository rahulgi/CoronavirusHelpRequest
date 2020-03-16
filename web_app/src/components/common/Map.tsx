import React, { useEffect, useRef, useState } from "react";
import makeAsyncScriptLoader from "react-async-script";
import styled from "@emotion/styled/macro";
import { useLocation, Location } from "../../hooks/useLocation";

const MapContainer = styled.div`
  width: 100%;
  max-width: 600px;
  height: 300px;
`;

const MAP_CONTAINER_ID = "map-container";
let map: google.maps.Map | undefined = undefined;
let mapMarker: google.maps.Marker | undefined = undefined;
let mapCircle: google.maps.Circle | undefined = undefined;
const ONE_KILOMETER = 1000; // 1000 meters

const AsyncMap: React.FC<{ google: undefined | typeof window.google }> = ({
  google
}) => {
  const mapsRef = useRef<HTMLDivElement>();
  const userLocation = useLocation();
  const [mapLocation, setMapLocation] = useState<Location>(userLocation);

  useEffect(() => {
    if (google && google.maps && mapsRef.current) {
      map = new google.maps.Map(mapsRef.current, {
        center: mapLocation,
        zoom: 11,
        styles: [
          {
            featureType: "poi",
            stylers: [{ visibility: "off" }] // Turn off points of interest.
          },
          {
            featureType: "transit.station",
            stylers: [{ visibility: "off" }] // Turn off bus stations, train stations, etc.
          }
        ],
        disableDoubleClickZoom: true,
        streetViewControl: false
      });

      mapMarker = new google.maps.Marker({
        position: mapLocation,
        map
      });

      mapCircle = new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map: map,
        center: mapLocation,
        radius: ONE_KILOMETER
      });

      const listener = map.addListener("click", function(e) {
        setMapLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      });

      return () => {
        listener.remove();
      };
    }
  }, [google, mapsRef]);

  useEffect(() => {
    setMapLocation(userLocation);
  }, [userLocation]);

  useEffect(() => {
    mapMarker && mapMarker.setPosition(mapLocation);
    mapCircle && mapCircle.setCenter(mapLocation);
    map && map.panTo(mapLocation);
  }, [mapLocation]);

  return (
    <MapContainer id={MAP_CONTAINER_ID} ref={r => r && (mapsRef.current = r)} />
  );
};

const MAPS_API_URL =
  "https://maps.googleapis.com/maps/api/js?key=AIzaSyCDQkDeYC3TXbJtG4lM6okHS-zN3xHps5E&libraries=visualization";

export const Map = makeAsyncScriptLoader(MAPS_API_URL, {
  globalName: "google"
})(AsyncMap);
