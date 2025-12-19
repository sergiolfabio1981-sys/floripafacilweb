
import React, { useState } from 'react';
import PayPalButton from './PayPalButton';

interface PassengerData {
  firstName: string;
  lastName: string;
  dni: string;
  age: string;
  address: string;
  city: string;
  province: string;
  country: string;
  email: string;
  phone: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  priceInfo: string; // e.g. "USD 1200 total"
  onConfirmWhatsApp: (data: PassengerData) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, title, priceInfo, onConfirmWhatsApp }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<PassengerData>({
    firstName: '', lastName: '', dni: '', age: '',
    address: '', city: '', province: '', country: '',
    email: '', phone: ''
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-cyan-700 p-4 rounded-t-2xl flex justify-between items-center text-white shrink-0">
          <div>
            <h3 className="font-bold text-lg">Reservar: {title}</h3>
            <p className="text-cyan-100 text-sm">{priceInfo}</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-2xl">&times;</button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {step === 1 ? (
            <form id="passenger-form" onSubmit={handleNext} className="space-y-4">
              <h4 className="text-gray-800 font-bold text-lg border-b pb-2 mb-4">Datos del Pasajero Principal</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombres</label>
                  <input required name="firstName" value={formData.firstName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Apellido</label>
                  <input required name="lastName" value={formData.lastName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">DNI / Pasaporte</label>
                  <input required name="dni" value={formData.dni} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Edad</label>
                  <input required type="number" name="age" value={formData.age} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Dirección</label>
                <input required name="address" value={formData.address} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 outline-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Localidad</label>
                  <input required name="city" value={formData.city} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Provincia</label>
                  <input required name="province" value={formData.province} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">País</label>
                  <input required name="country" value={formData.country} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Correo Electrónico</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Teléfono / WhatsApp</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 outline-none" />
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <h4 className="text-gray-800 font-bold text-lg text-center">Seleccione Método de Pago</h4>
              
              {/* Option 1: WhatsApp */}
              <div className="bg-green-50 border border-green-200 p-4 rounded-xl hover:shadow-md transition-all cursor-pointer" onClick={() => onConfirmWhatsApp(formData)}>
                <div className="flex items-center gap-4">
                  <div className="bg-green-500 text-white p-3 rounded-full">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </div>
                  <div>
                    <h5 className="font-bold text-green-800">Coordinar por WhatsApp</h5>
                    <p className="text-xs text-green-700">Enviaremos tus datos para confirmar disponibilidad y abonar por Transferencia o Efectivo.</p>
                  </div>
                </div>
              </div>

              {/* Option 2: PayPal */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                <h5 className="font-bold text-blue-800 mb-2 text-center">Pagar Online con Tarjeta</h5>
                <PayPalButton />
              </div>

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t flex justify-between shrink-0 rounded-b-2xl">
          {step === 2 && (
            <button onClick={() => setStep(1)} className="text-gray-500 font-bold hover:text-gray-700">
              &larr; Volver
            </button>
          )}
          {step === 1 && (
            <button type="button" onClick={onClose} className="text-gray-500 font-bold hover:text-gray-700 mr-auto">
              Cancelar
            </button>
          )}
          
          {step === 1 && (
            <button 
                form="passenger-form"
                type="submit" 
                className="bg-cyan-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-cyan-700 shadow-lg ml-auto"
            >
              Continuar &rarr;
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default BookingModal;
