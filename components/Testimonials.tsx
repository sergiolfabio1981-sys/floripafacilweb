
import React, { useState, useEffect } from 'react';

const reviews = [
  {
    id: 1,
    name: 'Martín Gomez',
    country: 'Argentina',
    flag: '🇦🇷',
    role: 'Cliente Frecuente',
    text: 'Excelente atención. Compramos el paquete a Florianópolis y todo salió perfecto. Los hoteles superaron nuestras expectativas. ¡Floripa Fácil es muy recomendada!',
    rating: 5,
    trip: 'Florianópolis 2026'
  },
  {
    id: 2,
    name: 'Fernanda Oliveira',
    country: 'Brasil',
    flag: '🇧🇷',
    role: 'Viajera',
    text: 'Amei a experiência! A Floripa Fácil cuidou de todos os detalhes da nossa viagem para Bariloche. Atendimento impecável e preços justos.',
    rating: 5,
    trip: 'Patagonia Argentina'
  },
  {
    id: 3,
    name: 'Carlos Mendez',
    country: 'Uruguay',
    flag: '🇺🇾',
    role: 'Familia',
    text: 'Muy buena opción para pagar en cuotas. Reservamos el viaje al Mundial 2026 y la financiación de Floripa Cuotas nos facilitó mucho todo.',
    rating: 5,
    trip: 'Mundial 2026'
  },
  {
    id: 4,
    name: 'Sofia Rojas',
    country: 'Chile',
    flag: '🇨🇱',
    role: 'Pareja',
    text: 'Buscábamos una escapada romántica a Buzios y encontramos la mejor oferta aquí. La posada era hermosa y la atención por WhatsApp de Floripa Fácil fue muy rápida.',
    rating: 4,
    trip: 'Escapada a Buzios'
  },
  {
    id: 5,
    name: 'Javier Vargas',
    country: 'Bolivia',
    flag: '🇧🇴',
    role: 'Grupo de Amigos',
    text: 'Organizamos un viaje grupal a Camboriú. La coordinación de Floripa Fácil fue excelente y el bus muy cómodo. ¡Volveremos a viajar con ellos!',
    rating: 5,
    trip: 'Camboriú en Bus'
  },
  {
    id: 6,
    name: 'Andrea López',
    country: 'Colombia',
    flag: '🇨🇴',
    role: 'Solo Traveler',
    text: 'Increíble experiencia en Río de Janeiro. Me sentí muy segura y acompañada por el equipo de Floripa Fácil. Gracias por todo.',
    rating: 5,
    trip: 'Rio de Janeiro'
  }
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const visibleReviews = [
    reviews[currentIndex],
    reviews[(currentIndex + 1) % reviews.length],
    reviews[(currentIndex + 2) % reviews.length],
  ];

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Lo que dicen nuestros viajeros</h2>
          <div className="w-24 h-1 bg-cyan-500 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-500">Experiencias reales de clientes de toda Latinoamérica</p>
        </div>

        {/* Desktop Grid (3 items) */}
        <div className="hidden md:grid grid-cols-3 gap-8">
          {visibleReviews.map((review, idx) => (
            <div key={`${review.id}-${idx}`} className="bg-slate-50 p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative animate-fade-in">
              <div className="absolute top-4 right-4 text-4xl text-cyan-100 font-serif">"</div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center text-xl shadow-inner">
                  {review.flag}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">{review.name}</h4>
                  <p className="text-xs text-gray-500">{review.country}</p>
                </div>
              </div>
              <div className="flex text-yellow-400 text-xs mb-3">
                {Array(review.rating).fill(0).map((_, i) => <span key={i}>★</span>)}
              </div>
              <p className="text-gray-600 text-sm italic leading-relaxed mb-4 min-h-[80px]">
                {review.text}
              </p>
              <div className="text-xs font-bold text-cyan-600 uppercase tracking-wide border-t border-gray-200 pt-3">
                Viajó a: {review.trip}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View (Single Item) */}
        <div className="md:hidden">
            <div className="bg-slate-50 p-6 rounded-2xl shadow-sm border border-gray-100 relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center text-2xl">
                  {reviews[currentIndex].flag}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{reviews[currentIndex].name}</h4>
                  <p className="text-sm text-gray-500">{reviews[currentIndex].country}</p>
                </div>
              </div>
              <p className="text-gray-600 italic mb-4">"{reviews[currentIndex].text}"</p>
              <div className="flex justify-center gap-2 mt-4">
                  {reviews.map((_, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-cyan-600 w-6' : 'bg-gray-300'}`}
                      />
                  ))}
              </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Testimonials;
