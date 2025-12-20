
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface SelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
}

const SelectionModal: React.FC<SelectionModalProps> = ({ isOpen, onClose, itemName }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleContinue = () => {
    onClose();
    navigate('/');
    // Scroll to top to see new options
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform animate-pop-in">
        <div className="bg-green-600 p-6 text-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h3 className="text-xl font-bold">¡Servicio Agregado!</h3>
          <p className="text-green-100 text-sm mt-1">{itemName} se sumó a tu plan.</p>
        </div>
        
        <div className="p-8 space-y-4">
          <p className="text-gray-600 text-center text-sm">¿Deseas armar un paquete con más servicios o prefieres finalizar tu reserva ahora?</p>
          
          <button 
            onClick={handleContinue}
            className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Seguir sumando servicios
          </button>
          
          <Link 
            to="/planner"
            className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            Ver mi Plan y Pagar (40%)
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SelectionModal;
