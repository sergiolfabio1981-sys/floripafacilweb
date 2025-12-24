
import React, { useState } from 'react';
import { sendMessage } from '../services/messageService';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
        await sendMessage({
            sender_name: formData.name,
            subject: `Consulta Web de ${formData.name}`,
            body: `Email: ${formData.email}\nTel: ${formData.phone}\n\nMensaje: ${formData.message}`,
            type: 'contact'
        });
        setStatus('success');
        setTimeout(() => {
            setFormData({ name: '', email: '', phone: '', message: '' });
            setStatus('idle');
        }, 5000);
    } catch (error) {
        alert("Error al enviar el mensaje. Intente de nuevo.");
        setStatus('idle');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-green-800 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase italic">Contáctanos</h1>
          <p className="text-xl text-green-100 font-medium">Nuestro equipo de expertos está listo para diseñar tu viaje ideal.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Contact Info */}
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-black text-gray-800 mb-6 uppercase tracking-tighter italic">Atención Personalizada</h2>
              <p className="text-gray-500 text-lg leading-relaxed font-medium">
                En Floripa Fácil no solo vendemos servicios, creamos recuerdos. Respondemos todas las consultas en menos de 24 horas.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="bg-green-100 p-5 rounded-[1.5rem] text-green-600 transition-all group-hover:bg-green-600 group-hover:text-white shadow-sm">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <div>
                  <h3 className="font-black text-gray-800 uppercase tracking-widest text-sm">WhatsApp Directo</h3>
                  <p className="text-gray-500 font-bold mt-1 text-lg">+54 9 11 4063 2644</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="bg-lime-100 p-5 rounded-[1.5rem] text-lime-600 transition-all group-hover:bg-lime-600 group-hover:text-white shadow-sm">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <h3 className="font-black text-gray-800 uppercase tracking-widest text-sm">Emails Oficiales</h3>
                  <p className="text-gray-500 font-bold mt-1 text-lg">ventas@floripafacil.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-10 md:p-16 rounded-[4rem] shadow-2xl border border-gray-100 relative">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-lime-400 rounded-full flex items-center justify-center text-4xl shadow-xl animate-bounce">👋</div>
            
            {status === 'success' ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-10 animate-pop-in">
                    <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-8">
                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className="text-3xl font-black text-gray-800 mb-4 tracking-tighter uppercase italic">¡Mensaje Recibido!</h3>
                    <p className="text-gray-500 font-medium leading-relaxed">Pronto te contactaremos. Revisa tu WhatsApp o Email.</p>
                    <button onClick={() => setStatus('idle')} className="mt-10 text-green-600 font-black uppercase text-xs tracking-widest hover:underline">Enviar otro mensaje</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-2xl font-black text-gray-800 mb-8 uppercase tracking-tighter italic">Cuéntanos tu plan</h3>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Nombre Completo</label>
                    <input type="text" name="name" required className="w-full bg-slate-50 border-2 border-transparent p-5 rounded-2xl outline-none focus:bg-white focus:border-green-500 transition-all font-bold" placeholder="Tu nombre..." value={formData.name} onChange={handleChange} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email</label>
                      <input type="email" name="email" required className="w-full bg-slate-50 border-2 border-transparent p-5 rounded-2xl outline-none focus:bg-white focus:border-green-500 transition-all font-bold" placeholder="tu@email.com" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">WhatsApp</label>
                      <input type="tel" name="phone" required className="w-full bg-slate-50 border-2 border-transparent p-5 rounded-2xl outline-none focus:bg-white focus:border-green-500 transition-all font-bold" placeholder="+54..." value={formData.phone} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Mensaje</label>
                    <textarea name="message" required rows={4} className="w-full bg-slate-50 border-2 border-transparent p-5 rounded-2xl outline-none focus:bg-white focus:border-green-500 transition-all font-bold" placeholder="¿Cómo podemos ayudarte?" value={formData.message} onChange={handleChange}></textarea>
                  </div>

                  <button type="submit" disabled={status === 'loading'} className="w-full bg-green-600 text-white font-black py-6 rounded-2xl hover:bg-green-700 transition-all shadow-xl shadow-green-200 uppercase tracking-widest text-sm mt-4 active:scale-95 disabled:opacity-50">
                    {status === 'loading' ? 'Enviando...' : 'Enviar Consulta'}
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
