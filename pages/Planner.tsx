
import React, { useState, useEffect } from 'react';
import { usePlanner } from '../contexts/PlannerContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { Link, useNavigate } from 'react-router-dom';
import { generateMultiServicePDF } from '../services/multiServicePdf';
import { supabase } from '../services/supabase';
import { Seller } from '../types';

const Planner: React.FC = () => {
  const { selectedItems, removeItem, totalValue, totalProfit, reservationValue, clearPlanner } = usePlanner();
  const { formatPrice, currency } = useCurrency();
  const navigate = useNavigate();
  
  const [currentUser, setCurrentUser] = useState<Seller | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const userJson = localStorage.getItem('abras_user') || localStorage.getItem('floripa_user');
    if (userJson) {
      setCurrentUser(JSON.parse(userJson));
    }
  }, []);

  const handleDownload = () => {
    generateMultiServicePDF(selectedItems, totalValue, reservationValue, currency, currentUser);
  };

  const handleRegisterSale = async () => {
    if (!clientName || !clientPhone) {
      alert("Por favor cargue los datos del cliente para registrar la venta.");
      return;
    }

    if (!currentUser) {
      alert("Debes estar logueado como agente de Floripa Fácil para registrar ventas oficiales.");
      return;
    }

    setIsSaving(true);
    try {
      const sellerCommissionRate = 0.40; 
      const commissionAmount = totalProfit * sellerCommissionRate;
      const itemsSummary = selectedItems.map(i => i.item.title);

      const { error } = await supabase.from('sales').insert({
        seller_id: currentUser.id,
        seller_name: currentUser.name,
        client_name: clientName,
        client_phone: clientPhone,
        total_amount: totalValue,
        total_profit: totalProfit,
        commission_amount: commissionAmount,
        items: itemsSummary,
        date: new Date().toISOString()
      });

      if (error) throw error;

      alert("¡Venta registrada con éxito en el sistema de Floripa Fácil! Tu comisión del 40% ha sido calculada.");
      clearPlanner();
      navigate('/admin');
    } catch (err) {
      console.error(err);
      alert("Error al registrar la venta.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleWhatsApp = () => {
    let message = `*SOLICITUD DE RESERVA - FLORIPA FÁCIL*\n\n`;
    if (currentUser) message += `*Agente:* ${currentUser.name}\n\n`;
    if (clientName) message += `*Cliente:* ${clientName}\n\n`;
    
    message += `*SERVICIOS:* \n`;
    selectedItems.forEach((item, i) => {
        message += `${i+1}. ${item.item.title} (${formatPrice(item.calculatedPrice)})\n`;
    });
    message += `\n💰 *TOTAL:* ${formatPrice(totalValue)}\n`;
    message += `💳 *RESERVA (40%):* ${formatPrice(reservationValue)}\n`;
    message += `📌 *SALDO EN DESTINO:* ${formatPrice(totalValue - reservationValue)}\n\n`;
    message += `_Cotizado mediante la plataforma Floripa Fácil_`;
    
    window.open(`https://wa.me/5491140632644?text=${encodeURIComponent(message)}`, "_blank");
  };

  if (selectedItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="text-center bg-white p-12 rounded-[3rem] shadow-xl max-w-md border border-gray-100">
            <div className="text-8xl mb-6">🎒</div>
            <h2 className="text-3xl font-black text-gray-800 mb-4 tracking-tighter uppercase">Tu itinerario está vacío</h2>
            <p className="text-gray-400 mb-8 font-medium italic">Suma experiencias y traslados para armar tu viaje ideal con Floripa Fácil.</p>
            <Link to="/" className="bg-green-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-green-700 transition-all uppercase tracking-widest shadow-lg">Explorar Destinos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <h1 className="text-4xl font-black text-gray-800 tracking-tighter uppercase">Mi Plan de Viaje</h1>
            <div className="flex gap-2">
               {currentUser && <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-[10px] font-black uppercase flex items-center gap-2">👤 Agente: {currentUser.name}</span>}
               <button onClick={clearPlanner} className="text-[10px] font-black text-red-500 hover:bg-red-50 px-4 py-2 rounded-full uppercase transition-all">Vaciar Itinerario</button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 mb-6">
                    <h3 className="font-black text-gray-800 mb-6 flex items-center gap-3 uppercase text-sm tracking-widest">
                       <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">1</div>
                       Datos del Viajero
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Nombre y Apellido</label>
                        <input 
                            type="text" 
                            placeholder="Ej: Juan Pérez" 
                            className="w-full border-2 border-gray-50 bg-gray-50 rounded-2xl p-4 outline-none focus:border-green-500 focus:bg-white transition-all font-bold"
                            value={clientName}
                            onChange={e => setClientName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">WhatsApp de Contacto</label>
                        <input 
                            type="text" 
                            placeholder="Ej: +54 9 11..." 
                            className="w-full border-2 border-gray-50 bg-gray-50 rounded-2xl p-4 outline-none focus:border-green-500 focus:bg-white transition-all font-bold"
                            value={clientPhone}
                            onChange={e => setClientPhone(e.target.value)}
                        />
                      </div>
                    </div>
                </div>

                <h3 className="font-black text-gray-400 mb-4 flex items-center gap-3 uppercase text-[10px] tracking-[0.3em] ml-4">
                    Servicios Seleccionados
                </h3>

                {selectedItems.map((pItem) => (
                    <div key={pItem.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50 flex flex-col sm:flex-row gap-6 relative group hover:shadow-md transition-all">
                        <div className="w-full sm:w-32 h-32 flex-shrink-0">
                            <img src={pItem.item.images[0]} className="w-full h-full object-cover rounded-[1.5rem]" />
                        </div>
                        <div className="flex-1 flex flex-col">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-[9px] font-black text-green-600 uppercase tracking-[0.2em] bg-green-50 px-2 py-0.5 rounded mb-2 inline-block">
                                        {pItem.item.type}
                                    </span>
                                    <h3 className="font-black text-xl text-gray-800 leading-tight tracking-tighter">{pItem.item.title}</h3>
                                    <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">📍 {pItem.item.location}</p>
                                </div>
                                <button onClick={() => removeItem(pItem.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                            <div className="mt-auto flex justify-between items-end pt-4">
                                <div className="flex gap-4">
                                    <div className="bg-slate-50 px-3 py-1 rounded-lg">
                                        <span className="text-[9px] font-black text-gray-400 uppercase block">Cant.</span>
                                        <span className="text-xs font-black">{pItem.quantity} pax</span>
                                    </div>
                                    {pItem.days && (
                                        <div className="bg-slate-50 px-3 py-1 rounded-lg">
                                            <span className="text-[9px] font-black text-gray-400 uppercase block">Duración</span>
                                            <span className="text-xs font-black">{pItem.days} días</span>
                                        </div>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Subtotal</p>
                                    <span className="font-black text-xl text-green-700">{formatPrice(pItem.calculatedPrice)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="lg:col-span-1">
                <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-gray-100 sticky top-24 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-lime-500"></div>
                    <h2 className="font-black text-2xl mb-8 uppercase tracking-tighter text-gray-800">Resumen de Inversión</h2>
                    
                    <div className="space-y-4 mb-8">
                        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-1">Monto Total</span>
                            <span className="text-3xl font-black text-slate-800 tracking-tighter">{formatPrice(totalValue)}</span>
                        </div>
                        
                        <div className="bg-green-600 p-6 rounded-[2rem] text-white shadow-xl shadow-green-500/20">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Seña Reserva (40%)</span>
                                <span className="bg-white/20 text-[8px] font-black px-2 py-0.5 rounded-full">CONGELA PRECIO</span>
                            </div>
                            <span className="text-3xl font-black tracking-tighter">{formatPrice(reservationValue)}</span>
                        </div>

                        <div className="p-6 rounded-[2rem] border-2 border-dashed border-gray-100 flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Saldo en Destino (60%)</span>
                            <span className="text-lg font-black text-gray-600 tracking-tighter">{formatPrice(totalValue - reservationValue)}</span>
                        </div>

                        {currentUser && (
                          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex justify-between items-center">
                             <span className="text-[9px] font-black uppercase tracking-widest text-blue-500">Comisión Agente (40%)</span>
                             <span className="text-sm font-black text-blue-700">{formatPrice(totalProfit * 0.40)}</span>
                          </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <button onClick={handleDownload} className="w-full bg-slate-800 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-900 transition-all uppercase text-[10px] tracking-widest">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Descargar Propuesta PDF
                        </button>

                        <button onClick={handleWhatsApp} className="w-full border-2 border-green-500 text-green-600 font-black py-4 rounded-2xl hover:bg-green-50 transition-all flex items-center justify-center gap-3 uppercase text-[10px] tracking-widest">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            Enviar a un asesor
                        </button>

                        {currentUser && (
                          <button 
                            onClick={handleRegisterSale} 
                            disabled={isSaving}
                            className="w-full bg-green-500 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-green-600 transition-all flex flex-col items-center justify-center gap-1 uppercase text-sm disabled:opacity-50 mt-4"
                          >
                            {isSaving ? 'Registrando Venta...' : 'Confirmar Venta en Sistema'}
                          </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Planner;
