import React, { useEffect, useRef } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export const MapboxItemViewer = ({
  latitude = 28.6139,
  longitude = 77.2090,
  title = '',
  locationName = ''
}) => {
  const mapContainerRef = useRef(null);
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

  useEffect(() => {
    if (!mapboxToken || !mapContainerRef.current) {
      return;
    }

    try {
      mapboxgl.accessToken = mapboxToken;

      // const map = new mapboxgl.Map({
      //   container: mapContainerRef.current,
      //   style: 'mapbox://styles/mapbox/satellite-streets-v12',
      //   center: [longitude, latitude],
      //   zoom: 15
      // });

      const map = new mapboxgl.Map({
  container: mapContainerRef.current,
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [longitude, latitude],
  zoom: 12
});

map.addControl(
  new mapboxgl.NavigationControl(),
  'top-right'
);

map.on('load', () => {
  map.resize();
});






      const popup = new mapboxgl.Popup({
        offset: 25
      }).setHTML(`
        <div style="padding:4px;">
          <strong style="color:#2563eb;">
            ${title}
          </strong>
          <p style="margin:2px 0;font-size:12px;">
            ${locationName}
          </p>
        </div>
      `);

      new mapboxgl.Marker({
        color: '#ef4444'
      })
        .setLngLat([longitude, latitude])
        .setPopup(popup)
        .addTo(map);

      return () => {
        map.remove();
      };
    } catch (err) {
      console.warn(
        'Mapbox view error:',
        err
      );
    }
  }, [
    mapboxToken,
    latitude,
    longitude,
    title,
    locationName
  ]);

  return (
    <div
      className="card"
      style={{
        padding: '1rem',
        marginTop: '1rem'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.75rem'
        }}
      >
        <h4
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1.05rem',
            margin: 0
          }}
        >
          <MapPin
            size={20}
            color="#2563eb"
          />

          Item Location on Map
        </h4>

        <span
          style={{
            fontSize: '0.8rem',
            color: '#64748b'
          }}
        >
          Lat: {latitude}, Lng: {longitude}
        </span>
      </div>

      <div
        className="map-container"
        style={{ height: '300px' }}
      >
        {mapboxToken ? (
          <div
            ref={mapContainerRef}
            style={{
              width: '100%',
              height: '100%'
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#f1f5f9',
              backgroundImage:
                'radial-gradient(#94a3b8 1.5px, transparent 1.5px)',
              backgroundSize: '20px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <div
              style={{
                textAlign: 'center',
                backgroundColor: '#ffffff',
                padding: '1rem 1.5rem',
                borderRadius: 8,
                boxShadow:
                  '0 4px 6px rgba(0,0,0,0.08)'
              }}
            >
              <MapPin
                size={32}
                color="#ef4444"
                style={{
                  margin: '0 auto 6px'
                }}
              />

              <div
                style={{
                  fontWeight: 600,
                  color: '#0f172a'
                }}
              >
                {locationName ||
                  'Marked Position'}
              </div>

              <div
                style={{
                  fontSize: '0.8125rem',
                  color: '#64748b',
                  marginTop: 4
                }}
              >
                Coordinates: {latitude},{' '}
                {longitude}
              </div>
            </div>

            <div
              style={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                fontSize: '0.75rem',
                color: '#94a3b8',
                backgroundColor:
                  'rgba(255,255,255,0.8)',
                padding: '2px 6px',
                borderRadius: 4
              }}
            >
              Mapbox Location View
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: '0.5rem',
          fontSize: '0.875rem',
          color: '#475569',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem'
        }}
      >
        <Navigation
          size={15}
          color="#2563eb"
        />

        {locationName}
      </div>
    </div>
  );
};

export default MapboxItemViewer;