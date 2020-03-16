import React, { useEffect, useRef } from "react";
import makeAsyncScriptLoader from "react-async-script";
import styled from "@emotion/styled/macro";
import { useLocation } from "../../hooks/useLocation";

const MapContainer = styled.div`
  width: 100%;
  max-width: 400px;
  height: 300px;
`;

const MAP_CONTAINER_ID = "map-container";
let map: google.maps.Map | undefined = undefined;

const AsyncMap: React.FC<{ google: undefined | typeof window.google }> = ({
  google
}) => {
  const mapsRef = useRef<HTMLDivElement>();
  const currentLocation = useLocation();

  useEffect(() => {
    if (google && google.maps && mapsRef.current) {
      map = new google.maps.Map(mapsRef.current, {
        center: currentLocation,
        zoom: 3,
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

      const listener = map.addListener("click", function(e) {
        // data.lat = e.latLng.lat();
        // data.lng = e.latLng.lng();
        // addToFirebase(data);
      });

      return () => {
        listener.remove();
      };
    }
  }, [google, mapsRef]);

  useEffect(() => {
    map && map.setCenter(currentLocation);
  }, [currentLocation]);

  return (
    <MapContainer id={MAP_CONTAINER_ID} ref={r => r && (mapsRef.current = r)} />
  );
};

const MAPS_API_URL =
  "https://maps.googleapis.com/maps/api/js?key=AIzaSyCDQkDeYC3TXbJtG4lM6okHS-zN3xHps5E&libraries=visualization";

export const Map = makeAsyncScriptLoader(MAPS_API_URL, {
  globalName: "google"
})(AsyncMap);
