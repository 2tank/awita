import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const MapComponent = ({umbralRadio}) => {
    const [position, setPosition] = useState([51.505, -0.09]); // Ubicación inicial
    const [radius, setRadius] = useState(umbralRadio); // Radio en metros

    // Obtener la ubicación actual del usuario
    useEffect(() => {
      navigator.geolocation.getCurrentPosition((pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      });
    }, []);

    // Puntos de ejemplo con coordenadas y datos
    const points = [
      { id: 1, name: 'Punto 1', coords: [51.505, -0.08] },
      { id: 2, name: 'Punto 2', coords: [51.51, -0.1] },
      { id: 3, name: 'Punto 3', coords: [51.51, -0.12] }
    ];

    return (
      <MapContainer center={position} zoom={13} style={{ height: '500px', width: '100%' }}>
        {/* Capa de OpenStreetMap /}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/%7Bz%7D/%7Bx%7D/%7By%7D.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/ Marcador en la ubicación actual /}
        <Marker position={position}>
          <Popup>Tu ubicación actual</Popup>
        </Marker>

        {/ Círculo con un radio de X metros /}
        <Circle center={position} radius={radius} color="blue" />

        {/ Marcadores interactivos */}
        {points.map(point => (
          <Marker key={point.id} position={point.coords}>
            <Popup>
              {point.name}
              <br />
              Coordenadas: {point.coords[0]}, {point.coords[1]}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    );
  };

  export default MapComponent;