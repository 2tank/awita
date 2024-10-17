import './App.css'

import Home from './Home/Home'
import Map from './Components/Map'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() { 
  return(

    <Router>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/reservoirs" element={<Map/>}></Route>
        <Route path="/ver-embalse" element={<Map/>}></Route>
      </Routes>
    </Router>
  );
}

export default App
