
import { HeroSlide, PromoBanner } from '../types';
import { INITIAL_HERO_SLIDES, INITIAL_PROMO_BANNERS } from '../constants';
import { supabase } from './supabase';

export const getHeroSlides = async (): Promise<HeroSlide[]> => {
  try {
    const { data, error } = await supabase.from('hero_slides').select('*').order('id', { ascending: true });
    if (error || !data || data.length === 0) return INITIAL_HERO_SLIDES;
    return data;
  } catch (err) {
    return INITIAL_HERO_SLIDES;
  }
};

export const saveHeroSlide = async (slide: HeroSlide): Promise<void> => {
  // Aseguramos que solo enviamos los campos que la tabla espera
  const { error } = await supabase.from('hero_slides').upsert({
      id: slide.id,
      image: slide.image,
      title: slide.title,
      subtitle: slide.subtitle,
      ctaText: slide.ctaText,
      ctaLink: slide.ctaLink,
      highlightColor: slide.highlightColor
  });
  if (error) throw error;
};

export const getPromoBanners = async (): Promise<PromoBanner[]> => {
  try {
    const { data, error } = await supabase.from('promo_banners').select('*');
    if (error || !data || data.length === 0) return INITIAL_PROMO_BANNERS;
    return data;
  } catch (err) {
    return INITIAL_PROMO_BANNERS;
  }
};

export const savePromoBanner = async (banner: PromoBanner): Promise<void> => {
  const { error } = await supabase.from('promo_banners').upsert({
      id: banner.id,
      title: banner.title,
      subtitle: banner.subtitle,
      image: banner.image,
      badge: banner.badge,
      ctaText: banner.ctaText,
      link: banner.link
  });
  if (error) throw error;
};
