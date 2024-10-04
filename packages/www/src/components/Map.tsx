"use client";

import { AEDData } from "@aed-now/core/aed/aed.sql";
// import { Map as Mapbox, Marker } from "mapbox-gl";
import { useEffect, useState } from "react";
import ReactMapGL, { Marker } from "react-map-gl";

import "mapbox-gl/dist/mapbox-gl.css";

type MapProps = {
  mapboxAccessToken: string;
  points: AEDData[];
};

export function Map({ mapboxAccessToken, points }: MapProps) {
  // const mapRef = useRef<mapboxgl.Map | null>(null);
  // const mapContainerRef = useRef(null);
  const [userCoords, setUserCoords] = useState<{
    lng: number;
    lat: number;
  }>({ lng: 24.93482928022299, lat: 60.16636933656481 });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        // setUserCoords([pos.coords.latitude, pos.coords.longitude]);
        setUserCoords({
          lng: pos.coords.longitude,
          lat: pos.coords.latitude,
        });
      });
    }
  }, []);

  return (
    <div className='w-screen h-screen'>
      <ReactMapGL
        // @ts-expect-error
        mapLib={import("mapbox-gl")}
        initialViewState={{
          longitude: userCoords.lng,
          latitude: userCoords.lat,
          zoom: 14,
        }}
        mapStyle='mapbox://styles/audacious5/cm1nq5rfd00ms01r2bv738g1b'
        mapboxAccessToken='pk.eyJ1IjoiYXVkYWNpb3VzNSIsImEiOiJjbTFucTJoZWEwdXh3MmlxdjFnN2c1M2F1In0.qlbUNDAVqbVDCd1eXyPHkA'>
        {points.map(point => {
          return (
            <Marker
              key={point.id}
              latitude={point.location.lat}
              longitude={point.location.lng}
              color='#ff0000'></Marker>
          );
        })}
      </ReactMapGL>
    </div>
  );
}
