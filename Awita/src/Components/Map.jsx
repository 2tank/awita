import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; 
import { useLocation } from 'react-router-dom';
import './Map.css';
import { actualizarJsonConApi, dataFiltering, encontrarCercanos } from './extractorJson';

const jsonToArray = (jsonData) => {
    if (!jsonData) return []; // Retorna un array vacío si jsonData es null o undefined
    return Array.isArray(jsonData) ? jsonData : Object.values(jsonData);
};

async function procesarDatos(longitude, latitude, radius) {
    try {
        let jsonDisplay00 = await encontrarCercanos(longitude, latitude);
        let jsonDisplay01 = dataFiltering(jsonDisplay00.items, longitude, latitude, radius);
        let jsonDisplay02 = await actualizarJsonConApi(jsonDisplay01);
        console.log(jsonDisplay02);
        return jsonToArray(jsonDisplay02); // Convertir a array y retornar
    } catch (error) {
        console.error("Error al procesar los datos:", error);
        return []; // Retornar un array vacío en caso de error
    }
}

const MapComponent = () => {
    const locationDataTransfre = useLocation();
    const userLocation = locationDataTransfre.state?.location;

    const latitude = userLocation?.lat || 51.505;
    const longitude = userLocation?.lng || -0.09;
    const radius = (locationDataTransfre.state?.sliderValue || 25) * 1000;

    const [position, setPosition] = useState([latitude, longitude]);
    const [embalsesArray, setEmbalsesArray] = useState([]); // Estado para embalses
    const [loading, setLoading] = useState(true); // Estado de carga

    useEffect(() => {
        if (userLocation && userLocation.lat && userLocation.lng) {
            setPosition([userLocation.lat, userLocation.lng]);
        }
    }, [userLocation]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Iniciar carga
            const data = await procesarDatos(longitude, latitude, radius);
            setEmbalsesArray(data); // Actualizar estado con los datos
            setLoading(false); // Finalizar carga
            console.log(data); // Verifica qué datos estás obteniendo
        };

        fetchData();
    }, [longitude, latitude, radius]); // Dependencias para volver a cargar

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

            {/* <Marker position={position}>
                <Popup>Tu ubicación actual</Popup>
            </Marker> */}

            <Circle center={position} radius={radius} color='blue'></Circle>

            {loading ? (
                <Marker position={position}>
                    <Popup>Cargando embalses...</Popup>
                </Marker>
            ) : (
                embalsesArray.map(point => {
                    // Asegúrate de que x e y son válidos
                    const lat = point.y;
                    const lng = point.x;

                    if (typeof lat === 'undefined' || typeof lng === 'undefined') {
                        console.warn(`Coordenadas no válidas para el embalse:`, point);
                        return null; // No renderiza nada si las coordenadas son inválidas
                    }

                    return (
                     
                      <Marker key={point.codigo} position={[lat, lng]}>
                            <Popup>
                                Nombre del embalse: {point.embalse} <br/>
                                Provincia: {point.provincia} <br/>
                                Cauce: {point.cauce} <br/>
                                Tipo: {point.tipo} <br/>
                                Coordenadas: {lng}, {lat}
                            </Popup>
                        </Marker>  
                    );
                })
            )}
        </MapContainer>
    );
};

export default MapComponent;