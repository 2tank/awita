import './App.css';
import Home from './Home/Home';
import Map from './Components/Map';
import ListadoEmbalse from "./Components/ListadoEmbalses";
import PredictorEmbalse from './Components/PredictorEnbalse';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() { 
  return(

    <Router>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/reservoirs" element={<Map/>}></Route>
        <Route path="/ver-embalse" element={<ListadoEmbalse/>}></Route>
        <Route path="/predictor" element={<PredictorEmbalse/>}></Route>

      </Routes>
    </Router>
  );
}

export default App
