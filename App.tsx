
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import Details from './pages/Details';
import Trips from './pages/Trips';
import Admin from './pages/Admin';
import Excursions from './pages/Excursions';
import ExcursionDetails from './pages/ExcursionDetails';
import CarRentals from './pages/CarRentals';
import CarRentalDetails from './pages/CarRentalDetails';
import Guides from './pages/Guides';
import GuideDetails from './pages/GuideDetails';
import Contact from './pages/Contact';
import Planner from './pages/Planner';
import { LanguageProvider } from './contexts/LanguageContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { PlannerProvider } from './contexts/PlannerContext';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <CurrencyProvider>
        <PlannerProvider>
          <Router>
            <div className="flex flex-col min-h-screen font-sans">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/trips" element={<Trips />} />
                  <Route path="/trip/:id" element={<Details />} />
                  <Route path="/guides" element={<Guides />} />
                  <Route path="/guides/:id" element={<GuideDetails />} />
                  <Route path="/excursions" element={<Excursions />} />
                  <Route path="/excursions/:id" element={<ExcursionDetails />} />
                  <Route path="/cars" element={<CarRentals />} />
                  <Route path="/car/:id" element={<CarRentalDetails />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/planner" element={<Planner />} />
                </Routes>
              </main>
              <Footer />
              <WhatsAppButton />
            </div>
          </Router>
        </PlannerProvider>
      </CurrencyProvider>
    </LanguageProvider>
  );
};

export default App;
