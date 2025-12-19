
import React, { useState, useEffect } from 'react';

interface ImageGalleryProps {
  images: string[];
  title?: string;
  altText?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, title, altText = "Imagen del destino" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') setIsOpen(false);
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  if (!images || images.length === 0) return null;

  return (
    <>
      {/* INLINE GALLERY GRID */}
      <div className="space-y-2">
        {/* Main Hero Image */}
        <div 
          className="relative h-80 md:h-[450px] w-full rounded-xl overflow-hidden cursor-pointer group shadow-md"
          onClick={() => openModal(0)}
        >
          <img 
            src={images[0]} 
            alt={altText} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
             <div className="bg-black/50 text-white px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 duration-300">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                Ver pantalla completa
             </div>
          </div>
        </div>

        {/* Thumbnails Row (Only if more than 1 image) */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.slice(1, 5).map((img, idx) => (
              <div 
                key={idx} 
                className="relative h-20 md:h-28 rounded-lg overflow-hidden cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
                onClick={() => openModal(idx + 1)}
              >
                <img src={img} alt={`${altText} ${idx + 2}`} className="w-full h-full object-cover" />
                {/* Show "+X" on the last thumbnail if there are more images */}
                {idx === 3 && images.length > 5 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-lg">
                    +{images.length - 5}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center animate-fade-in">
          
          {/* Close Button */}
          <button 
            onClick={() => setIsOpen(false)} 
            className="absolute top-4 right-4 z-[110] text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          {/* Navigation Buttons */}
          <button 
            onClick={prevImage}
            className="absolute left-4 z-[110] text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all hidden md:block"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>

          <button 
            onClick={nextImage}
            className="absolute right-4 z-[110] text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all hidden md:block"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>

          {/* Main Image */}
          <div className="relative w-full h-full p-4 md:p-10 flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img 
              src={images[currentIndex]} 
              alt={altText} 
              className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm"
            />
            {title && (
                <div className="mt-4 text-white text-center">
                    <h3 className="text-xl font-medium">{title}</h3>
                    <p className="text-sm text-gray-400">{currentIndex + 1} / {images.length}</p>
                </div>
            )}
          </div>

          {/* Bottom Thumbnails Strip in Lightbox */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] pb-2 scrollbar-hide">
             {images.map((img, idx) => (
                 <button 
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`flex-shrink-0 w-12 h-12 rounded border-2 transition-all ${currentIndex === idx ? 'border-white opacity-100 scale-110' : 'border-transparent opacity-50 hover:opacity-80'}`}
                 >
                     <img src={img} className="w-full h-full object-cover" />
                 </button>
             ))}
          </div>

        </div>
      )}
    </>
  );
};

export default ImageGallery;
