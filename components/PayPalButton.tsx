
import React, { useEffect, useRef, useState } from 'react';

const PayPalButton: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: number;

    const renderButton = async () => {
      try {
        const paypal = (window as any).paypal;
        
        // Verificar si el SDK está disponible y tiene la función de HostedButtons
        if (!paypal || !paypal.HostedButtons) {
          if (isMounted) {
            timeoutId = window.setTimeout(renderButton, 1000);
          }
          return;
        }

        if (!containerRef.current) return;

        // Limpiar contenedor previo
        containerRef.current.innerHTML = '';
        
        const uniqueId = `paypal-btn-${Math.random().toString(36).substr(2, 9)}`;
        const innerContainer = document.createElement('div');
        innerContainer.id = uniqueId;
        containerRef.current.appendChild(innerContainer);

        // Renderizar con manejo de errores interno del SDK
        await paypal.HostedButtons({
          hostedButtonId: "EBQS2ACWE7UZW",
        }).render(`#${uniqueId}`).catch((err: any) => {
          console.warn("PayPal Render Warning:", err);
          // No lanzamos error fatal aquí porque a veces el SDK se recupera solo
        });
        
        if (isMounted) {
          setIsLoading(false);
          setError(null);
        }
      } catch (err: any) {
        console.error("PayPal critical error:", err);
        if (isMounted) {
          setError("El servicio de pagos no está disponible en este momento.");
          setIsLoading(false);
        }
      }
    };

    timeoutId = window.setTimeout(renderButton, 500);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, []);

  return (
    <div className="mt-6 w-full">
        <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Pagos Seguros vía ABRAS Travel</span>
            <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col items-center justify-center shadow-sm min-h-[160px]">
            {error ? (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl text-orange-700 text-[10px] text-center max-w-xs">
                    <p className="font-bold mb-1">Nota del Sistema</p>
                    <p>{error} Por favor, contáctenos por WhatsApp para coordinar el pago.</p>
                </div>
            ) : (
                <div 
                    ref={containerRef} 
                    className="w-full z-0 relative text-center"
                    style={{ minHeight: '140px', colorScheme: 'only light' }} 
                >
                    {isLoading && (
                        <div className="animate-pulse flex flex-col items-center justify-center py-8">
                            <div className="h-10 w-48 bg-gray-100 rounded-lg mb-2"></div>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Cargando pasarela de pago...</p>
                        </div>
                    )}
                </div>
            )}
            
            {!error && (
              <div className="flex items-center gap-3 mt-4 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                  <div className="flex gap-2">
                      <img src="https://img.icons8.com/color/48/000000/visa.png" className="h-4" alt="Visa" />
                      <img src="https://img.icons8.com/color/48/000000/mastercard.png" className="h-4" alt="Mastercard" />
                      <img src="https://img.icons8.com/color/48/000000/amex.png" className="h-4" alt="Amex" />
                  </div>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest border-l pl-3 border-gray-200">ABRAS Travel Checkout</span>
              </div>
            )}
        </div>
    </div>
  );
};

export default PayPalButton;
