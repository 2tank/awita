import * as React from 'react';
import { useEffect, useState } from "react";
import './NavBar.css'
import { Link } from 'react-router-dom';


const NavBar = () => {

    return (

    <nav class="navbar">
        <ul class="navbar-list">
            <li><Link to="/reservoirs" className="animatedSpanNavBar">Embalses</Link></li>
            <li><Link to="/prediction-model" className="animatedSpanNavBar">Modelo Predicción</Link></li>
        </ul>
    </nav>

    );
}
export default NavBar;

