import './App.css'

import Home from './Home/Home'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() { 
  return(

    <Router>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
      </Routes>
    </Router>
  );
}

export default App
