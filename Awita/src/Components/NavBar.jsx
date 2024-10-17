import * as React from 'react';
import { useEffect, useState } from "react";
import './NavBar.css'
import { Link } from 'react-router-dom';


const NavBar = () => {

    return (

    <nav className="navbar">
        <ul className="navbar-list">
            <li><Link to="/" className="animatedSpanNavBar">Inicio</Link></li>
            <li><Link to="/ver-embalse" className="animatedSpanNavBar">Embalses</Link></li>
            <li><Link to="/predictor" className="animatedSpanNavBar">Modelo Predicción</Link></li>
        </ul>
    </nav>

    );
}
export default NavBar;

