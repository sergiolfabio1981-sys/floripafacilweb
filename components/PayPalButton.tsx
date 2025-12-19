
import React, { useEffect, useRef } from 'react';

const PayPalButton: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendered = useRef(false);

  useEffect(() => {
    // Check if PayPal SDK is loaded and container exists
    if ((window as any).paypal && containerRef.current && !rendered.current) {
        try {
            // Render the hosted button
            (window as any).paypal.HostedButtons({
                hostedButtonId: "EBQS2ACWE7UZW",
            }).render("#paypal-container-EBQS2ACWE7UZW");
            
            rendered.current = true;
        } catch (err) {
            console.error("Error rendering PayPal button:", err);
        }
    }
  }, []);

  return (
    <div className="mt-6 w-full">
        {/* Divider with Text */}
        <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pago Online Seguro</span>
            <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Styled Container */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col items-center justify-center shadow-sm">
            {/* 
               Fixed Layout: Removed 'flex justify-center items-center' from the inner div.
               This allows the PayPal iframe to take full width naturally without being squashed.
               
               Fixed Colors: Added 'color-scheme: only light' to force browser inputs to be light.
            */}
            <div 
                id="paypal-container-EBQS2ACWE7UZW" 
                ref={containerRef} 
                className="w-full z-0 relative text-center"
                style={{ minHeight: '150px', colorScheme: 'only light' }} 
            ></div>
            
            <div className="flex items-center gap-3 mt-2 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                 <div className="flex gap-2">
                    <img src="https://img.icons8.com/color/48/000000/visa.png" className="h-5" alt="Visa" />
                    <img src="https://img.icons8.com/color/48/000000/mastercard.png" className="h-5" alt="Mastercard" />
                    <img src="https://img.icons8.com/color/48/000000/amex.png" className="h-5" alt="Amex" />
                 </div>
                 <span className="text-[10px] text-gray-400 font-medium border-l pl-3 border-gray-300">Pagos procesados por PayPal</span>
            </div>
        </div>
    </div>
  );
};

export default PayPalButton;
