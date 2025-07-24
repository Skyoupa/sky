import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Accueil from './pages/Accueil';
import Tutoriels from './pages/Tutoriels';
import Tournois from './pages/Tournois';
import Communaute from './pages/Communaute';
import APropos from './pages/APropos';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/tutoriels" element={<Tutoriels />} />
            <Route path="/tournois" element={<Tournois />} />
            <Route path="/communaute" element={<Communaute />} />
            <Route path="/a-propos" element={<APropos />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;