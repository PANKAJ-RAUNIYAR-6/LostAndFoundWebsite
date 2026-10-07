import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Search, Compass, Navigation } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export const MapboxLocationPicker = ({
  initialLatitude = 28.6139,
  initialLongitude = 77.2090,
  initialLocation = '',
  onChange
}) => {
  const mapContainerRef = useRef(null);
  const [lat, setLat] = useState(initialLatitude);
  const [lng, setLng] = useState(initialLongitude);
  const [locationName, setLocationName] = useState(initialLocation);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

  useEffect(() => {
    if (!mapboxToken || !mapContainerRef.current) {
      return;
    }

    try {
      mapboxgl.accessToken = mapboxToken;

      // const map = new mapboxgl.Map({
      //   container: mapContainerRef.current,
      //   style: 'mapbox://styles/mapbox/streets-v12',
      //   center: [lng, lat],
      //   zoom: 14
      // });
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [lng, lat],
        zoom: 12
      });

      map.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      const marker = new mapboxgl.Marker({
        draggable: true,
        color: '#2563eb'
      })
        .setLngLat([lng, lat])
        .addTo(map);

      marker.on('dragend', () => {
        const newPos = marker.getLngLat();

        const newLat = Number(newPos.lat.toFixed(5));
        const newLng = Number(newPos.lng.toFixed(5));

        setLat(newLat);
        setLng(newLng);

        if (onChange) {
          onChange({
            latitude: newLat,
            longitude: newLng,
            locationName
          });
        }
      });

      map.on('click', (e) => {
        const newLat = Number(e.lngLat.lat.toFixed(5));
        const newLng = Number(e.lngLat.lng.toFixed(5));

        marker.setLngLat([newLng, newLat]);

        setLat(newLat);
        setLng(newLng);

        if (onChange) {
          onChange({
            latitude: newLat,
            longitude: newLng,
            locationName
          });
        }
      });

      // map.on('load', () => {
      //   setMapLoaded(true);
      // });
      map.on('load', () => {
        map.resize();
        setMapLoaded(true);
      });

      map.on('error', (event) => {
        console.error('Mapbox error:', event);
        setMapError(
          event?.error?.message || 'Mapbox failed to load.'
        );
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;

      return () => {
        marker.remove();
        map.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      };
    } catch (err) {
      console.warn('Mapbox initialization error:', err);
      setMapError(err.message);
    }
  }, [mapboxToken]);

  const handleManualCoordChange = (newLat, newLng) => {
    setLat(newLat);
    setLng(newLng);

    if (markerRef.current && mapInstanceRef.current) {
      markerRef.current.setLngLat([newLng, newLat]);

      mapInstanceRef.current.flyTo({
        center: [newLng, newLat]
      });
    }

    if (onChange) {
      onChange({
        latitude: newLat,
        longitude: newLng,
        locationName
      });
    }
  };

  // const handleLocationNameBlur = () => {
  //   if (onChange) {
  //     onChange({
  //       latitude: lat,
  //       longitude: lng,
  //       locationName
  //     });
  //   }
  // };

  const handleLocationNameBlur = async () => {
  if (!locationName.trim() || !mapboxToken) {
    if (onChange) {
      onChange({
        latitude: lat,
        longitude: lng,
        locationName
      });
    }
    return;
  }

  try {
    const response = await fetch(
      `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(
        locationName
      )}&limit=1&access_token=${mapboxToken}`
    );

    if (!response.ok) {
      throw new Error('Unable to find this location');
    }

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const [newLng, newLat] =
        data.features[0].geometry.coordinates;

      const updatedLat = Number(newLat.toFixed(5));
      const updatedLng = Number(newLng.toFixed(5));

      setLat(updatedLat);
      setLng(updatedLng);

      if (markerRef.current) {
        markerRef.current.setLngLat([
          updatedLng,
          updatedLat
        ]);
      }

      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo({
          center: [updatedLng, updatedLat],
          zoom: 12,
          essential: true
        });
      }

      if (onChange) {
        onChange({
          latitude: updatedLat,
          longitude: updatedLng,
          locationName
        });
      }
    } else {
      console.warn(
        'No Mapbox location found for:',
        locationName
      );

      if (onChange) {
        onChange({
          latitude: lat,
          longitude: lng,
          locationName
        });
      }
    }
  } catch (error) {
    console.error(
      'Mapbox address search error:',
      error
    );

    if (onChange) {
      onChange({
        latitude: lat,
        longitude: lng,
        locationName
      });
    }
  }
};




  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const currentLat = Number(
            pos.coords.latitude.toFixed(5)
          );

          const currentLng = Number(
            pos.coords.longitude.toFixed(5)
          );

          handleManualCoordChange(
            currentLat,
            currentLng
          );
        },
        (err) => {
          console.warn(
            'Geolocation permission denied:',
            err
          );
        }
      );
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}
    >
      <div
        className="form-group"
        style={{ marginBottom: 0 }}
      >
        <label className="form-label">
          Human-Readable Location / Landmark
        </label>

        <div
          style={{
            display: 'flex',
            gap: '0.5rem'
          }}
        >
          <input
            type="text"
            className="form-control"
            placeholder="e.g. University Library 2nd Floor, Desk 14"
            value={locationName}
            onChange={(e) =>
              setLocationName(e.target.value)
            }
            onBlur={handleLocationNameBlur}
            required
          />

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={useCurrentLocation}
            title="Detect My Location"
          >
            <Navigation size={16} /> GPS
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.75rem'
        }}
      >
        <div>
          <label
            className="form-label"
            style={{ fontSize: '0.75rem' }}
          >
            Latitude
          </label>

          <input
            type="number"
            step="0.0001"
            className="form-control"
            value={lat}
            onChange={(e) =>
              handleManualCoordChange(
                parseFloat(e.target.value) || 0,
                lng
              )
            }
          />
        </div>

        <div>
          <label
            className="form-label"
            style={{ fontSize: '0.75rem' }}
          >
            Longitude
          </label>

          <input
            type="number"
            step="0.0001"
            className="form-control"
            value={lng}
            onChange={(e) =>
              handleManualCoordChange(
                lat,
                parseFloat(e.target.value) || 0
              )
            }
          />
        </div>
      </div>

      {/* Map Display */}
      <div
        className="map-container"
        style={{
          position: 'relative',
          minHeight: '300px'
        }}
      >
        {mapboxToken ? (
          <>
            <div
              ref={mapContainerRef}
              style={{
                width: '100%',
                height: '100%',
                minHeight: '300px'
              }}
            />

            {mapError && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f1f5f9',
                  padding: '1rem',
                  textAlign: 'center',
                  zIndex: 2
                }}
              >
                <div>
                  <MapPin
                    size={36}
                    color="#ef4444"
                    style={{
                      margin: '0 auto 8px'
                    }}
                  />

                  <div
                    style={{
                      fontWeight: 600,
                      color: '#0f172a'
                    }}
                  >
                    Unable to load Mapbox map
                  </div>

                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: '#64748b',
                      marginTop: 4
                    }}
                  >
                    {mapError}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              minHeight: '300px',
              backgroundColor: '#e2e8f0',
              backgroundImage:
                'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)',
              backgroundSize: '24px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              cursor: 'crosshair',
              padding: '1rem',
              textAlign: 'center'
            }}
            onClick={(e) => {
              const rect =
                e.currentTarget.getBoundingClientRect();

              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;

              const newLat = Number(
                (
                  lat +
                  (0.5 - y / rect.height) * 0.02
                ).toFixed(5)
              );

              const newLng = Number(
                (
                  lng +
                  (x / rect.width - 0.5) * 0.02
                ).toFixed(5)
              );

              handleManualCoordChange(
                newLat,
                newLng
              );
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform:
                  'translate(-50%, -100%)',
                color: '#2563eb',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <MapPin
                size={36}
                color="#ef4444"
                fill="#ef4444"
              />

              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: '#ffffff',
                  padding: '2px 6px',
                  borderRadius: 4,
                  boxShadow:
                    '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                {lat}, {lng}
              </span>
            </div>

            <div
              style={{
                position: 'absolute',
                bottom: 8,
                left: 8,
                backgroundColor:
                  'rgba(255,255,255,0.9)',
                padding: '4px 8px',
                borderRadius: 4,
                fontSize: '0.75rem',
                color: '#475569'
              }}
            >
              Mapbox Location Picker (Click to adjust marker pin)
            </div>
          </div>
        )}
      </div>

      <p
        className="form-hint"
        style={{ marginTop: '-0.25rem' }}
      >
        Tip: Click on the map or drag the pin to pinpoint
        the exact recovery location.
      </p>
    </div>
  );
};

export default MapboxLocationPicker;