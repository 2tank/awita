import * as React from 'react';
import { useEffect, useState } from "react";
import './NavBar.css'
import { Link } from 'react-router-dom';


const NavBar = () => {

    return (

    <nav className="navbar">
        <ul className="navbar-list">
            <li><Link to="/reservoirs" className="animatedSpanNavBar">Embalses</Link></li>
            <li><Link to="/prediction-model" className="animatedSpanNavBar">Modelo Predicción</Link></li>
        </ul>
    </nav>

    );
}
export default NavBar;

