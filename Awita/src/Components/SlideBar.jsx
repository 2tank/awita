import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

// Definimos las marcas sin etiquetas, solo valores
const marks = [
  {
    value: 0,
  },
  {
    value: 25,
  },
  {
    value: 50,
  },
  {
    value: 100,
  },
];

// Función para mostrar el valor del slider en otro sitio
function valuetext(value) {
  return `${value} km`;
}

// Componente que renderiza el slider
export default function DiscreteSliderValues() {
  const [sliderValue, setSliderValue] = React.useState(25);

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };

  return (
    <Box sx={{ width: 300, margin: '0 auto', textAlign: 'center' }}>
      <h3>Radio de búsqueda (km):</h3>
      <Slider
        aria-label="Radio de búsqueda"
        value={sliderValue}
        onChange={handleSliderChange}
        getAriaValueText={valuetext}
        step={null}
        valueLabelDisplay="off" // Esto oculta el valor flotante
        marks={marks} // Mantiene las marcas pero sin etiquetas
      />
    </Box>
  );
}
