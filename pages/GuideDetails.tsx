
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getGuideById } from '../services/guideService';
import { DestinationGuide } from '../types';
import ImageGallery from '../components/ImageGallery';

const GuideDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [guide, setGuide] = useState<DestinationGuide | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) getGuideById(id).then(data => {
      setGuide(data);
      setIsLoading(false);
    });
  }, [id]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div></div>;
  if (!guide) return <div className="min-h-screen flex items-center justify-center">Guía no encontrada</div>;

  // Helper para embeber videos de YouTube
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
    if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/');
    return url;
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="relative h-[60vh] w-full overflow-hidden">
        <img src={guide.images[0]} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <Link to="/guides" className="bg-white/20 hover:bg-white/40 text-white px-6 py-2 rounded-full text-xs font-black uppercase mb-6 backdrop-blur-md transition-all">&larr; Volver a Destinos</Link>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic drop-shadow-2xl">{guide.name}</h1>
          <div className="w-32 h-2 bg-lime-500 mt-6 rounded-full"></div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-16 border border-gray-100">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tighter mb-6">¿Qué esperar de este destino?</h2>
                <div className="prose prose-lg text-gray-600 leading-relaxed whitespace-pre-line font-medium">
                  {guide.description}
                </div>
              </div>

              {guide.videoUrl && (
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-gray-800 uppercase tracking-widest">Video Tour</h3>
                  <div className="aspect-video w-full rounded-[2rem] overflow-hidden shadow-xl bg-slate-900 border-4 border-slate-50">
                    <iframe 
                      src={getEmbedUrl(guide.videoUrl)} 
                      className="w-full h-full"
                      title="Destination Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-xl font-black text-gray-800 uppercase tracking-widest">Galería de Fotos</h3>
                <ImageGallery images={guide.images} title={guide.name} />
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-green-50 p-8 rounded-[2.5rem] border border-green-100 sticky top-24">
                <h3 className="text-xl font-black text-green-900 uppercase tracking-widest mb-6">Imperdibles</h3>
                <ul className="space-y-4">
                  {guide.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3 bg-white p-4 rounded-2xl shadow-sm border border-green-100">
                      <span className="text-xl">🌟</span>
                      <span className="text-sm font-bold text-green-800">{h}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-10">
                  <p className="text-xs font-black text-green-600 uppercase mb-4 text-center">¿Listos para viajar?</p>
                  <Link to="/trips" className="block w-full bg-green-600 text-white text-center font-black py-5 rounded-2xl shadow-xl hover:bg-green-700 transition-all uppercase text-sm tracking-widest">Explorar Servicios</Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GuideDetails;
