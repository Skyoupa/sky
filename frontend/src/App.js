import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Accueil from './pages/Accueil';
import Tutoriels from './pages/Tutoriels';
import Tournois from './pages/Tournois';
import Communaute from './pages/Communaute';
import APropos from './pages/APropos';
import Profil from './pages/Profil';
import AdminDashboard from './pages/AdminDashboard';
import AdminTournaments from './pages/AdminTournaments';
import './App.css';

function App() {
  return (
    <AuthProvider>
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
              <Route path="/profil" element={<Profil />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/tournaments" element={<AdminTournaments />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;