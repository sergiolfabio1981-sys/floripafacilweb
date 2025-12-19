
import React, { useState } from 'react';
import { ADMIN_EMAIL } from '../constants';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate sending email to Admin
    console.log(`📧 ENVIANDO MENSAJE DE CONTACTO A ${ADMIN_EMAIL}`);
    console.table(formData);
    
    setStatus('success');
    
    // Reset form after a delay
    setTimeout(() => {
        setFormData({ name: '', email: '', phone: '', message: '' });
        setStatus('idle');
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-cyan-800 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contáctanos</h1>
          <p className="text-xl text-cyan-100">Estamos aquí para ayudarte a planificar tu viaje perfecto.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Información de Contacto</h2>
              <p className="text-gray-600 mb-6">
                Ponte en contacto con nuestro equipo de expertos. Respondemos todas las consultas a la brevedad.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-cyan-100 p-3 rounded-full text-cyan-600 mr-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Teléfono / WhatsApp</h3>
                  <p className="text-gray-600">+54 9 11 4063 2644</p>
                  <p className="text-sm text-gray-500">Lunes a Viernes de 9 a 18hs</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-orange-100 p-3 rounded-full text-orange-600 mr-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Correo Electrónico</h3>
                  <p className="text-gray-600">info@abrastravel.com</p>
                  <p className="text-gray-600">ventas@abrastravel.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full text-blue-600 mr-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Oficina Comercial</h3>
                  <p className="text-gray-600">Buenos Aires, Argentina</p>
                  <p className="text-sm text-gray-500">Atención presencial con cita previa.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            {status === 'success' ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-10">
                    <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className="text-2xl font-bold text-green-700 mb-2">¡Mensaje Enviado!</h3>
                    <p className="text-gray-600">Gracias por escribirnos. Nos pondremos en contacto contigo a la brevedad.</p>
                    <button onClick={() => setStatus('idle')} className="mt-6 text-cyan-600 font-bold hover:underline">Enviar otro mensaje</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Envíanos un mensaje</h3>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">Nombre Completo</label>
                    <input 
                      type="text" 
                      name="name"
                      required 
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 outline-none"
                      placeholder="Tu nombre"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-1">Email</label>
                      <input 
                        type="email" 
                        name="email"
                        required 
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 outline-none"
                        placeholder="tu@email.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-1">Teléfono</label>
                      <input 
                        type="tel" 
                        name="phone"
                        required 
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 outline-none"
                        placeholder="+54..."
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">Mensaje</label>
                    <textarea 
                      name="message"
                      required 
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 outline-none"
                      placeholder="Cuéntanos sobre tu viaje ideal..."
                      value={formData.message}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-cyan-600 text-white font-bold py-4 rounded-xl hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-500/30"
                  >
                    Enviar Mensaje
                  </button>
                </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
