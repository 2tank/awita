import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Asegúrate de que el CSS se importa correctamente
import { useLocation } from 'react-router-dom';
import './Map.css'

const MapComponent = () => {
  
    // Accedemos a la ubicación desde el estado
  const locationDataTransfre = useLocation();
  const userLocation = locationDataTransfre.state?.location;

  // Extraemos la latitud y longitud
  const latitude = userLocation?.lat || 51.505; // Latitud por defecto si no hay datos
  const longitude = userLocation?.lng || -0.09; // Longitud por defecto si no hay datos
  const radius = (locationDataTransfre.state?.sliderValue || 25) * 1000; // Valor por defecto 25 km

  const [position, setPosition] = useState([latitude, longitude]); // Ubicación inicial

  // Si se recibe userLocation, actualizar la posición
  useEffect(() => {
    if (userLocation && userLocation.lat && userLocation.lng) {
      setPosition([userLocation.lat, userLocation.lng]);
    }
  }, [userLocation]);

  // Definir el valor del zoom según el radio
  let zoom = 12;
  switch (radius) {    
    case 1000:
        zoom = 15;
        break;
    case 5000:
        zoom = 14;
        break;
    case 10000:
        zoom = 13;
        break;
    case 25000:
        zoom = 10;
        break;
    case 50000:
        zoom = 9;
        break;
    case 75000:
        zoom = 8;
        break;
    case 100000:
        zoom = 7;
        break;
    default:
        zoom = 12; // Valor por defecto
        break;
  }

  return (
    <MapContainer className={"mapContainer"} center={position} zoom={zoom} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <Marker position={position}>
        <Popup>Tu ubicación actual</Popup>
      </Marker>

      <Circle center={position} radius={radius} color='blue'></Circle>
    </MapContainer>
  );
};

export default MapComponent;
