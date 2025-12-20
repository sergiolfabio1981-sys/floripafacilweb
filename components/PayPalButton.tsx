
import React, { useEffect, useRef, useState } from 'react';

const PayPalButton: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const scriptId = 'paypal-sdk-script';

    const loadPayPalScript = () => {
      if (document.getElementById(scriptId)) {
        renderButton();
        return;
      }

      const script = document.createElement('script');
      script.id = scriptId;
      script.src = "https://www.paypal.com/sdk/js?client-id=BAASwB8vDZxz0JI6SiJ_v0PC3EYE2V2EqIgWjy9ms7Vj0IaYurP0IguUrS0fjOywkyZAVMXYtcfIOnQ7qk&components=hosted-buttons&disable-funding=venmo&currency=USD";
      script.async = true;
      script.dataset.cspNonce = "abras-travel-nonce";
      
      script.onload = () => {
        if (isMounted) renderButton();
      };

      script.onerror = () => {
        if (isMounted) {
          setError("No se pudo cargar el componente de pago.");
          setIsLoading(false);
        }
      };

      document.head.appendChild(script);
    };

    const renderButton = async () => {
      try {
        const paypal = (window as any).paypal;
        
        if (!paypal || !paypal.HostedButtons) {
          throw new Error("PayPal SDK no disponible");
        }

        if (!containerRef.current) return;

        // Limpiar contenedor previo
        containerRef.current.innerHTML = '';
        const btnContainer = document.createElement('div');
        const uniqueId = `paypal-btn-${Math.random().toString(36).substr(2, 9)}`;
        btnContainer.id = uniqueId;
        containerRef.current.appendChild(btnContainer);

        // El SDK puede lanzar errores de "Host" aquí
        await paypal.HostedButtons({
          hostedButtonId: "EBQS2ACWE7UZW",
        }).render(`#${uniqueId}`);
        
        if (isMounted) {
          setIsLoading(false);
        }
      } catch (err: any) {
        console.error("PayPal Error:", err);
        if (isMounted) {
          setError("La seguridad de tu navegador bloqueó la pasarela de pagos.");
          setIsLoading(false);
        }
      }
    };

    // Pequeño retardo para estabilidad del DOM
    const timer = setTimeout(loadPayPalScript, 500);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="mt-6 w-full">
        <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Pago Seguro</span>
            <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col items-center justify-center shadow-sm min-h-[180px] relative overflow-hidden">
            {error ? (
                <div className="text-center space-y-4 animate-fade-in">
                    <div className="bg-amber-100 text-amber-700 p-4 rounded-2xl text-[10px] font-bold uppercase leading-tight">
                        {error}
                    </div>
                    <p className="text-gray-500 text-[11px] font-medium">Por favor, coordina el pago directamente con un asesor:</p>
                    <a 
                        href="https://wa.me/5491140632644?text=Hola! Tengo un problema de seguridad con el botón de PayPal y quiero pagar por otro medio."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg"
                    >
                        Pagar vía WhatsApp
                    </a>
                </div>
            ) : (
                <div ref={containerRef} className="w-full z-10">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-6">
                            <div className="w-10 h-10 border-4 border-cyan-100 border-t-cyan-600 rounded-full animate-spin mb-3"></div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Iniciando pasarela...</p>
                        </div>
                    )}
                </div>
            )}
        </div>
        <p className="text-[9px] text-center text-gray-400 mt-3 uppercase tracking-tighter">* Aceptamos todas las tarjetas internacionales vía PayPal</p>
    </div>
  );
};

export default PayPalButton;
