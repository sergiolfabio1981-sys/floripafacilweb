
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import Details from './pages/Details';
import Trips from './pages/Trips';
import Admin from './pages/Admin';
import Rentals from './pages/Rentals'; // Will remain for compatibility if needed, or repurposed
import RentalDetails from './pages/RentalDetails';
import Accommodations from './pages/Accommodations';
import Groups from './pages/Groups';
import GroupDetails from './pages/GroupDetails';
import Excursions from './pages/Excursions';
import ExcursionDetails from './pages/ExcursionDetails';
import Hotels from './pages/Hotels'; // Will remain for compatibility
import HotelDetails from './pages/HotelDetails';
import Installments from './pages/Installments';
import InstallmentDetails from './pages/InstallmentDetails';
import WorldCup from './pages/WorldCup';
import WorldCupDetails from './pages/WorldCupDetails';
import Contact from './pages/Contact';
import { LanguageProvider } from './contexts/LanguageContext';
import { CurrencyProvider } from './contexts/CurrencyContext';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <CurrencyProvider>
        <Router>
          <div className="flex flex-col min-h-screen font-sans">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/trips" element={<Trips />} />
                <Route path="/trip/:id" element={<Details />} />
                
                {/* Unified Accommodations Route */}
                <Route path="/accommodations" element={<Accommodations />} />
                
                {/* Group Routes */}
                <Route path="/groups" element={<Groups />} />
                <Route path="/groups/:id" element={<GroupDetails />} />

                {/* Legacy/Specific Routes kept for compatibility */}
                <Route path="/rentals" element={<Accommodations />} /> 
                <Route path="/rentals/:id" element={<RentalDetails />} />
                <Route path="/hotels" element={<Accommodations />} />
                <Route path="/hotels/:id" element={<HotelDetails />} />

                <Route path="/excursions" element={<Excursions />} />
                <Route path="/excursions/:id" element={<ExcursionDetails />} />
                <Route path="/installments" element={<Installments />} />
                <Route path="/installments/:id" element={<InstallmentDetails />} />
                <Route path="/worldcup" element={<WorldCup />} />
                <Route path="/worldcup/:id" element={<WorldCupDetails />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </main>
            <Footer />
            <WhatsAppButton />
          </div>
        </Router>
      </CurrencyProvider>
    </LanguageProvider>
  );
};

export default App;
