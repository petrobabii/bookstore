import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Menu from "./components/menu/Menu";
import About from './pages/About';
import './App.css';
import AllComponents from './components/AllComponents';
import Orders from './pages/Orders';

function App() {
  return (
    <Router>
      <div className="app">
        <Menu />
        <Container className="mt-4">
          <Routes>
            <Route path="/" element={<AllComponents />} />
            <Route path="/about" element={<About />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;