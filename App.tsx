
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Details from './pages/Details';
import Trips from './pages/Trips';
import Admin from './pages/Admin';
import Accommodations from './pages/Accommodations';
import RentalDetails from './pages/RentalDetails';
import Groups from './pages/Groups';
import GroupDetails from './pages/GroupDetails';
import Excursions from './pages/Excursions';
import ExcursionDetails from './pages/ExcursionDetails';
import HotelDetails from './pages/HotelDetails';
import CarRentals from './pages/CarRentals';
import CarRentalDetails from './pages/CarRentalDetails';
import Installments from './pages/Installments';
import InstallmentDetails from './pages/InstallmentDetails';
import WorldCup from './pages/WorldCup';
import WorldCupDetails from './pages/WorldCupDetails';
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
                  <Route path="/accommodations" element={<Accommodations />} />
                  <Route path="/guides" element={<Guides />} />
                  <Route path="/guides/:id" element={<GuideDetails />} />
                  <Route path="/groups" element={<Groups />} />
                  <Route path="/groups/:id" element={<GroupDetails />} />
                  <Route path="/rentals/:id" element={<RentalDetails />} />
                  <Route path="/hotels/:id" element={<HotelDetails />} />
                  <Route path="/excursions" element={<Excursions />} />
                  <Route path="/excursions/:id" element={<ExcursionDetails />} />
                  <Route path="/cars" element={<CarRentals />} />
                  <Route path="/car/:id" element={<CarRentalDetails />} />
                  <Route path="/installments" element={<Installments />} />
                  <Route path="/installments/:id" element={<InstallmentDetails />} />
                  <Route path="/worldcup" element={<WorldCup />} />
                  <Route path="/worldcup/:id" element={<WorldCupDetails />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/planner" element={<Planner />} />
                </Routes>
              </main>
              <Footer />
              <WhatsAppButton />
              <Chatbot />
            </div>
          </Router>
        </PlannerProvider>
      </CurrencyProvider>
    </LanguageProvider>
  );
};

export default App;
