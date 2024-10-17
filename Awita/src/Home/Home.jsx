import * as React from 'react';
import { Typewriter, useTypewriter } from 'react-simple-typewriter';
import { useEffect, useState } from "react";
import './Home.css'
import './Water.css'
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Logo from '../../public/UMA.gif'
import { Link } from 'react-router-dom';

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
  
  function valuetext(value) {
    return `${value} km`;
  }


function Home() {

    const [location, setLocation] = useState({ lat: null, lng: null });
    const [error, setError] = useState(null);

    useEffect(() => {
        document.title = "Swamping";
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setLocation({
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                });
              },
              (err) => {
                setError("No se pudo obtener la ubicación");
                console.error(err);
              }
            );
          } else {
            setError("Geolocation no está soportada por este navegador.");
          }
    }, []);

    const [text] = useTypewriter({
        words: ['sostenibilidad.', 'inclusión.', 'resiliencia.', 'igualdad.', 'educación.'],
        loop: 0, 
        typeSpeed: 100,
        deleteSpeed: 70,
        delaySpeed: 4000,
    });

    const [sliderValue, setSliderValue] = useState(25);

    const handleSliderChange = (event, newValue) => {
        setSliderValue(newValue);
    };


    {console.log(location)}

    return (
        
        <section id={"homeSection"}>

        <article id={"encabezadoHome"}>
            <h1>{text || "\u00A0"}</h1>
            <h3>{"(Swaping, busca embalses según tu ubicación, con un modelo predictivo que facilita decisiones basadas en datos hídricos.)"}</h3>
        </article>

        <section>

        <div className="water">

            <h2>{sliderValue}</h2>

        </div>

        <div id={"homeForm"}> 

        <Box sx={{ width: 300, margin: '0 auto', textAlign: 'center' }}>
            <h3>Radio de búsqueda (km):</h3>
            <Slider
                aria-label="Radio de búsqueda"
                value={sliderValue}
                onChange={handleSliderChange}
                getAriaValueText={valuetext}
                step={null}
                valueLabelDisplay="off" 
                marks={marks}
            />
        </Box>

        </div>

        <Link className={"link-button"} to="/reservoirs" state={{ location }}>
            Buscar embalses cerca
        </Link>

        </section>

        <div id={"logoUma"}>
            <img src={Logo} alt="Logo" style={{ width: '7vh' }} />
        </div>
    
        </section>
    );
}

export default Home;
