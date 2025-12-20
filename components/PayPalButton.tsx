
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
        
        // Verificación exhaustiva de la existencia del SDK
        if (!paypal) {
          if (isMounted) {
            // Reintentar brevemente si el script aún no carga
            timeoutId = window.setTimeout(renderButton, 1500);
          }
          return;
        }

        if (!paypal.HostedButtons) {
          console.warn("PayPal SDK loaded but HostedButtons component is missing.");
          setIsLoading(false);
          return;
        }

        if (!containerRef.current) return;

        // Limpieza total del contenedor para evitar colisiones del SDK v5
        while (containerRef.current.firstChild) {
            containerRef.current.removeChild(containerRef.current.firstChild);
        }
        
        const uniqueId = `paypal-container-${Math.random().toString(36).substr(2, 9)}`;
        const innerDiv = document.createElement('div');
        innerDiv.id = uniqueId;
        containerRef.current.appendChild(innerDiv);

        // Envoltorio para capturar errores de acceso al host/DOM del SDK
        try {
            await paypal.HostedButtons({
              hostedButtonId: "EBQS2ACWE7UZW",
            }).render(`#${uniqueId}`);
            
            if (isMounted) {
              setIsLoading(false);
              setError(null);
            }
        } catch (renderError: any) {
            // Aquí capturamos específicamente errores de "Can not read window host" o excepciones internas
            console.error("PayPal SDK Render Error:", renderError);
            if (isMounted) {
                setError("El entorno de seguridad bloqueó la pasarela de pagos.");
                setIsLoading(false);
            }
        }
        
      } catch (err: any) {
        console.error("PayPal critical initialization error:", err);
        if (isMounted) {
          setError("Servicio de pagos momentáneamente fuera de línea.");
          setIsLoading(false);
        }
      }
    };

    // Retrasar inicio para asegurar que el DOM y scripts externos estén estables
    timeoutId = window.setTimeout(renderButton, 1000);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      if (containerRef.current) {
          containerRef.current.innerHTML = '';
      }
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
                <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl text-center max-w-sm">
                    <p className="text-amber-800 font-bold text-xs mb-2">Aviso del Sistema</p>
                    <p className="text-amber-700 text-[10px] mb-4">No pudimos cargar el botón de pago automático debido a la configuración de seguridad de tu navegador o red.</p>
                    <a 
                        href="https://wa.me/5491140632644?text=Hola! No pude completar el pago por la web, necesito ayuda con una reserva."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-colors"
                    >
                        Pagar vía WhatsApp
                    </a>
                </div>
            ) : (
                <div 
                    ref={containerRef} 
                    className="w-full z-0 relative"
                    style={{ minHeight: '140px', colorScheme: 'only light' }} 
                >
                    {isLoading && (
                        <div className="animate-pulse flex flex-col items-center justify-center py-8">
                            <div className="h-10 w-48 bg-gray-100 rounded-lg mb-2"></div>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Iniciando pasarela segura...</p>
                        </div>
                    )}
                </div>
            )}
            
            {!error && (
              <div className="flex items-center gap-3 mt-4 opacity-40 grayscale">
                  <div className="flex gap-2">
                      <img src="https://img.icons8.com/color/48/000000/visa.png" className="h-4" alt="Visa" />
                      <img src="https://img.icons8.com/color/48/000000/mastercard.png" className="h-4" alt="Mastercard" />
                      <img src="https://img.icons8.com/color/48/000000/paypal.png" className="h-4" alt="PayPal" />
                  </div>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest border-l pl-3 border-gray-200">ABRAS Checkout</span>
              </div>
            )}
        </div>
    </div>
  );
};

export default PayPalButton;
