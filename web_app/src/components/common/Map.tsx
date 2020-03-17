import React, { useEffect, useRef, useState } from "react";
import makeAsyncScriptLoader from "react-async-script";
import styled from "@emotion/styled/macro";
import { useLocation, LocationStatus } from "../../hooks/useLocation";
import { Form } from "./Form";
import { Location } from "../helpers/location";
import { spacing } from "../../styles/spacing";
import { PALETTE } from "../../styles/colors";
import { HelpRequestsResult } from "../../hooks/data/useHelpRequests";
import { FetchResultStatus } from "../../hooks/data";

const MapContainer = styled.div`
  width: 100%;
  height: 300px;
`;

const LocationInputLine = styled.div`
  display: flex;
  & > *:not(:last-child) {
    margin-right: ${spacing.s};
  }
`;

const SearchBoxComponent = styled.input`
  flex-grow: 1;
`;

const MAP_CONTAINER_ID = "map-container";
let map: google.maps.Map | undefined = undefined;
let mapMarker: google.maps.Marker | undefined = undefined;
let mapCircle: google.maps.Circle | undefined = undefined;
let helpRequestCircles: google.maps.Circle[] | undefined;
let searchBox: google.maps.places.SearchBox | undefined = undefined;
let geocoder: google.maps.Geocoder | undefined = undefined;
const ONE_KILOMETER = 1000; // 1000 meters

const AsyncMap: React.FC<{
  google: undefined | typeof window.google;
  startingLocation: Location;
  startingLocationName: string;
  locationColor: string;
  helpRequestsResult?: HelpRequestsResult;
  onLocationChanged: (location: Location) => void;
}> = ({
  google,
  startingLocation,
  startingLocationName,
  locationColor,
  helpRequestsResult,
  onLocationChanged
}) => {
  const mapsRef = useRef<HTMLDivElement>();
  const searchBoxRef = useRef<HTMLInputElement>();
  const userLocation = useLocation();
  const [mapLocation, setMapLocation] = useState<Location>(startingLocation);
  const [inputLocation, setInputLocation] = useState(startingLocationName);

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
      geocoder = new google.maps.Geocoder();

      mapMarker = new google.maps.Marker({
        position: mapLocation,
        map
      });

      mapCircle = new google.maps.Circle({
        strokeColor: locationColor,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: locationColor,
        fillOpacity: 0.35,
        map: map,
        center: mapLocation,
        radius: ONE_KILOMETER,
        clickable: false
      });

      const clickListener = map.addListener("click", function(e) {
        setMapLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      });

      // Bias the SearchBox results towards current map's viewport.
      const boundsListener = map.addListener("bounds_changed", function() {
        if (map && searchBox) {
          const bounds = map.getBounds();
          bounds && searchBox.setBounds(bounds);
        }
      });

      return () => {
        clickListener.remove();
        boundsListener.remove();
      };
    }
  }, [google, mapsRef]);

  useEffect(() => {
    if (
      google &&
      helpRequestsResult &&
      helpRequestsResult.status === FetchResultStatus.FOUND
    ) {
      helpRequestCircles &&
        helpRequestCircles.map(circle => circle.setMap(null));
      helpRequestCircles = helpRequestsResult.result.map(result => {
        return new google.maps.Circle({
          strokeColor: PALETTE.error,
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: PALETTE.error,
          fillOpacity: 0.35,
          map: map,
          center: result.location,
          radius: ONE_KILOMETER,
          clickable: false
        });
      });
    }
  }, [helpRequestsResult, google]);

  useEffect(() => {
    if (google && searchBoxRef.current) {
      searchBox = new google.maps.places.SearchBox(searchBoxRef.current);

      const placesChangedListener = searchBox.addListener(
        "places_changed",
        function() {
          if (google && searchBox) {
            var places = searchBox.getPlaces();

            if (places.length === 0) {
              return;
            }

            const place = places[0];
            const { geometry } = place;
            const locationName = place.formatted_address || place.name;
            setInputLocation(locationName);

            if (!geometry) {
              return;
            }

            setMapLocation({
              lat: geometry.location.lat(),
              lng: geometry.location.lng()
            });

            if (map) {
              const bounds = new google.maps.LatLngBounds();
              if (geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(geometry.viewport);
              } else {
                bounds.extend(geometry.location);
              }
              if (mapCircle) {
                bounds.union(mapCircle.getBounds());
              }
              map.fitBounds(bounds);
            }
          }
        }
      );

      return () => {
        placesChangedListener.remove();
      };
    }
  }, [google, searchBoxRef]);

  useEffect(() => {
    onLocationChanged(mapLocation);
    mapMarker && mapMarker.setPosition(mapLocation);
    mapCircle && mapCircle.setCenter(mapLocation);
    map && map.panTo(mapLocation);
    if (geocoder) {
      geocoder.geocode({ location: mapLocation }, function(results, status) {
        if (status === "OK" && results[0]) {
          setInputLocation(results[0].formatted_address);
        } else {
          setInputLocation(
            `Coordinates (latitude: ${mapLocation.lat}, longitude: ${mapLocation.lng})`
          );
        }
      });
    }
  }, [mapLocation]);

  return (
    <div>
      <Form onSubmit={e => e.preventDefault()}>
        <div>
          <label htmlFor="location">Where are you?</label>
          <LocationInputLine>
            <SearchBoxComponent
              type="text"
              name="location"
              value={inputLocation}
              onChange={e => setInputLocation(e.target.value)}
              placeholder="Enter location..."
              ref={r => r && (searchBoxRef.current = r)}
            />
          </LocationInputLine>
        </div>
        {/* <div>or</div>
        <div>
          <LocationInputLine>
            <button
              type="button"
              onClick={() => {
                userLocation.status === LocationStatus.FOUND &&
                  setMapLocation(userLocation.location);
              }}
              disabled={userLocation.status !== LocationStatus.FOUND}
            >
              <i className="material-icons">my_location</i>Use your location
            </button>
          </LocationInputLine>
        </div>
        <div>or</div> */}
        <div>
          {/* <label>Select location on map</label> */}
          <MapContainer
            id={MAP_CONTAINER_ID}
            ref={r => r && (mapsRef.current = r)}
          />
        </div>
      </Form>
    </div>
  );
};

const MAPS_API_URL =
  "https://maps.googleapis.com/maps/api/js?key=AIzaSyCDQkDeYC3TXbJtG4lM6okHS-zN3xHps5E&libraries=visualization,places";

export const Map = makeAsyncScriptLoader(MAPS_API_URL, {
  globalName: "google"
})(AsyncMap);
