"use client";

import {
  AEDAvailabilityRules,
  AEDSelect,
  weekdays,
} from "@aed-now/core/aed/types";
import { useGeolocation } from "@uidotdev/usehooks";
import { getDay, isAfter, isBefore, isToday } from "date-fns";
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

function getFormattedTime(time: Date | number) {
  time = new Date(time);
  const hours = String(time.getHours()).padStart(2, "0");
  const minutes = String(time.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function parseHHMM(str: string) {
  const [h, m] = str.split(":");
  const hours = parseInt(h as string);
  const minutes = parseInt(m as string);
  if (isNaN(hours) || isNaN(minutes)) {
    return null;
  }
  return {
    hours,
    minutes,
  };
}

function isBeforeHours(a: string, b: string) {
  const aParsed = parseHHMM(a);
  const bParsed = parseHHMM(b);
  if (!aParsed || !bParsed) {
    return false;
  }

  if (aParsed.hours == bParsed.hours) {
    return aParsed.minutes < bParsed.minutes;
  }

  return aParsed.hours < bParsed.hours;
}

const IS_SERVER = typeof window === undefined;

export function Map({ mapboxAccessToken, points }: MapProps) {
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
        {points.map(point => {
          let isAvailable = false;
          const now = Date.now();
          for (let i = 0; i < point.availabilityRules.length; i++) {
            const cur = point.availabilityRules[
              i
            ] as AEDAvailabilityRules[number];
            const { type, from, to, available } = cur;

            if (type === "date") {
              const { date } = cur;
              if (from != "" && to == "" && isAfter(now, from)) {
                isAvailable = available;
                continue;
              }
              if (from == "" && to != "" && isBefore(now, to)) {
                isAvailable = available;
                continue;
              }
              if (isToday(date)) {
                isAvailable = available;
                continue;
              }
            } else if (type === "range") {
              if (
                from != "" &&
                to != "" &&
                isAfter(now, from) &&
                isBefore(now, to)
              ) {
                isAvailable = available;
              }
            } else {
              const { days } = cur;
              const dayIdx = getDay(now);
              const day = weekdays[dayIdx];
              const stringTimeNow = getFormattedTime(now);
              if (
                day !== undefined &&
                days.includes(day) &&
                !isBeforeHours(stringTimeNow, from) &&
                isBeforeHours(stringTimeNow, to)
              ) {
                isAvailable = available;
              }
            }
          }
          return (
            <Marker
              key={point.id}
              latitude={point.lat}
              longitude={point.lng}
              color={isAvailable ? "#ff0000" : "#cccccc"}></Marker>
          );
        })}
      </ReactMapGL>
    </div>
  );
}
