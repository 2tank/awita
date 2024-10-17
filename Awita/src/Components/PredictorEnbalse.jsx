import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './NavBar.css'; // Asumo que aquí tienes tus estilos adicionales
import NavBar from './NavBar';

// Registrar los componentes de la gráfica de ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PredictorEmbalse = () => {
    const [inputId, setInputId] = useState(''); // Para almacenar el ID del input
    const [predictionData, setPredictionData] = useState(null); // Para almacenar los datos de predicción
    const [error, setError] = useState(null); // Para manejar errores
    const [loading, setLoading] = useState(false); // Para mostrar una carga

    // Función para hacer la query a la API
    const fetchPredictionData = async (id) => {
        try {
            setLoading(true);
            setError(null); // Limpiamos posibles errores previos
            const response = await fetch(`https://g6f757b5f511ccb-retomalakathon.adb.eu-madrid-1.oraclecloudapps.com/ords/test/predictions/?q={"id":${id}}`);

            if (!response.ok) {
                throw new Error(`Error: ${response.status} - No se encontró predicción para el ID ${id}`);
            }

            const data = await response.json();
            setPredictionData(data.items); // Asumimos que 'items' contiene los datos de predicción
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    // Función para manejar el envío del ID
    const handleSendId = () => {
        if (inputId) {
            fetchPredictionData(inputId); // Llamamos a la función fetch con el ID del embalse
        }
    };

    // Preparamos los datos para la gráfica si están disponibles
    const chartData = {
        labels: predictionData ? predictionData.map((item) => `Mes ${item.mes}`) : [], // Etiquetas de los meses
        datasets: [
            {
                label: 'Predicción de Agua (hm³)',
                data: predictionData ? predictionData.map((item) => item.agua_pred) : [], // Valores de agua_pred
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.raw} hm³`;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return value + ' hm³'; // Mostrar el valor con la unidad hm³
                    },
                },
            },
        },
    };

    return (
        <>
        <NavBar></NavBar>
        
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            {/* Input y botón con MUI */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <TextField 
                    label="Introducir ID" 
                    variant="outlined" 
                    value={inputId} 
                    onChange={(e) => setInputId(e.target.value)} 
                    sx={{ width: '300px' }} 
                />
                <Button variant="contained" color="primary" onClick={handleSendId}>
                    Enviar
                </Button>
            </Box>

            {/* Muestra error si hay */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Mostrar loading mientras se realiza la consulta */}
            {loading && <p>Cargando...</p>}

            {/* Mostrar la gráfica solo si los datos están disponibles */}
            {predictionData && !loading && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ marginTop: '2rem' }}
                >
                    <h3>Predicción de Agua para el Año {predictionData[0]?.year}</h3>
                    <div style={{ width: '80%', margin: '0 auto' }}>
                        {/* Renderizamos la gráfica de barras con react-chartjs-2 */}
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                </motion.div>
            )}
        </div>
        </>
        
    );
};

export default PredictorEmbalse;
