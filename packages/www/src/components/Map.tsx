"use client";

import { isAEDAvailable } from "@/helpers/isAvailable";
import { AEDSelect } from "@aed-now/core/aed/types";
import { useGeolocation } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import ReactMapGL, { Marker } from "react-map-gl";

import "mapbox-gl/dist/mapbox-gl.css";

type Position = {
  lat: number;
  lng: number;
};

type MapProps = {
  mapboxAccessToken: string;
  points: AEDSelect[];
};

const IS_SERVER = typeof window === undefined;

export function Map({ mapboxAccessToken, points: aeds }: MapProps) {
  const [userCoords, setUserCoords] = useState<Position | undefined>(
    IS_SERVER
      ? undefined
      : JSON.parse(
          localStorage.getItem("user-coordinates") as string
        ) ?? undefined
  );
  const { loading, latitude, longitude } = useGeolocation();
  const [loadedPosition, setLoadedPosition] = useState(false);

  useEffect(() => {
    if (loadedPosition) {
      return;
    }

    const fetchDataFromIPInfo = async () => {
      const res = await fetch("https://ipinfo.io");
      const data = (await res.json()) as {
        loc: `${number},${number}`;
      };
      const [lng, lat] = data.loc.split(",");
      if (
        lng &&
        lat &&
        !isNaN(parseFloat(lng)) &&
        !isNaN(parseFloat(lat))
      ) {
        const pos = { lng: parseFloat(lng), lat: parseFloat(lat) };
        if (!IS_SERVER) {
          localStorage.setItem(
            "user-coordinates",
            JSON.stringify(pos)
          );
        }
        setUserCoords(pos);
      }
    };
    if (latitude && longitude) {
      const pos = {
        lat: latitude,
        lng: longitude,
      };
      setUserCoords(pos);
      setLoadedPosition(true);
      if (!IS_SERVER) {
        localStorage.setItem("user-coordinates", JSON.stringify(pos));
      }
    } else if (!loading) {
      setLoadedPosition(true);
      fetchDataFromIPInfo();
    }
  }, [loading, latitude, longitude, loadedPosition]);

  return (
    <div className='w-screen h-screen'>
      <ReactMapGL
        // @ts-expect-error idk, correct according to docs
        mapLib={import("mapbox-gl")}
        initialViewState={{
          longitude: userCoords?.lng ?? undefined,
          latitude: userCoords?.lat ?? undefined,
          zoom: 14,
        }}
        mapStyle='mapbox://styles/audacious5/cm1nq5rfd00ms01r2bv738g1b'
        mapboxAccessToken={mapboxAccessToken}>
        {aeds.map(aed => {
          const isAvailable = isAEDAvailable(aed);
          return (
            <Marker
              key={aed.id}
              latitude={aed.lat}
              longitude={aed.lng}
              color={isAvailable ? "#ff0000" : "#cccccc"}></Marker>
          );
        })}
      </ReactMapGL>
    </div>
  );
}
