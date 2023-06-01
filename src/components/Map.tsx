import { useCallback, useEffect, useMemo, useRef } from "react";
import { Wrapper } from "@googlemaps/react-wrapper";
import { locationDataSchema } from "@/schema";
import { z } from "zod";

type LocationData = z.infer<typeof locationDataSchema>;

const GoogleMap = ({
  selectable,
  lat,
  lng,
  zoom,
  onLocationChange,
}: {
  selectable: boolean;
  lat: number;
  lng: number;
  zoom: number;
  onLocationChange?: (locationData: LocationData) => void;
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map>();
  const markerRef = useRef<google.maps.Marker>();

  const getData = (data: google.maps.GeocoderResponse, key: string) => {
    return data.results
      .map((r) => r.address_components.find((ac) => ac.types.includes(key)))
      .find((a) => a !== undefined)?.long_name;
  };

  const geocoder = useMemo(() => new google.maps.Geocoder(), []);

  const reverseGeocode = useCallback(
    async (lat: number, lng: number) => {
      const data = await geocoder.geocode({
        location: { lat, lng },
        language: "en",
      });

      const country = getData(data, "country");
      const postalCode = getData(data, "postal_code");
      const subLocality = getData(data, "sublocality");
      const political = getData(data, "political");
      const area = getData(data, "area");

      const city = subLocality ?? area ?? political;

      let locationString = "";

      if (!country && !area && !postalCode) {
        locationString = "Unknown";
      } else {
        locationString = `${city ?? ""} ${postalCode ?? ""} ${country ?? ""}`;
      }

      return locationString;
    },
    [geocoder]
  );

  const handleClick = useCallback(
    async (e: any) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      if (markerRef.current) {
        markerRef.current.setMap(null);
      }

      const newMarker = new google.maps.Marker({
        position: { lat, lng },
        map: mapRef.current,
      });

      markerRef.current = newMarker;

      const locationResult = await reverseGeocode(lat, lng);
      onLocationChange?.({
        locationString: locationResult,
        coordinates: { lat, lng },
      });
    },
    [onLocationChange, reverseGeocode]
  );

  useEffect(() => {
    if (divRef.current && !mapRef.current) {
      const map = new window.google.maps.Map(divRef.current, {
        center: { lat, lng },
        zoom,
        maxZoom: 13,
        streetViewControl: false,
        mapTypeControl: false,
        clickableIcons: false,
      });
      mapRef.current = map;

      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: mapRef.current,
      });
      markerRef.current = marker;

      reverseGeocode(lat, lng).then((result) =>
        onLocationChange?.({
          locationString: result,
          coordinates: { lat, lng },
        })
      );
    }

    if (selectable && mapRef.current) {
      mapRef.current.addListener("click", handleClick);
    }

    return () => {
      if (mapRef.current) {
        google.maps.event.clearListeners(mapRef.current, "click");
      }
    };
  }, [
    divRef,
    lat,
    lng,
    handleClick,
    selectable,
    onLocationChange,
    reverseGeocode,
    zoom,
  ]);

  return <div ref={divRef} id="map" className="h-full w-full" />;
};

const Map = ({
  width,
  height,
  lat,
  lng,
  selectable = false,
  zoom = 12,
  onLocationChange,
}: {
  width: number;
  height: number;
  zoom?: number;
  lat: number;
  lng: number;
  selectable?: boolean;
  onLocationChange?: (locationData: LocationData) => void;
}) => {
  return (
    <div
      style={{ width: `${width}px`, maxWidth: "100%", height: `${height}px` }}
    >
      <Wrapper apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""}>
        <GoogleMap
          selectable={selectable}
          lat={lat}
          lng={lng}
          zoom={zoom}
          onLocationChange={onLocationChange}
        />
      </Wrapper>
    </div>
  );
};

export default Map;
