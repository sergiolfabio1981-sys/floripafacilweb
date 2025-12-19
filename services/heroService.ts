
import { HeroSlide, PromoBanner } from '../types';
import { INITIAL_HERO_SLIDES, INITIAL_PROMO_BANNERS } from '../constants';
import { supabase } from './supabase';

export const getHeroSlides = async (): Promise<HeroSlide[]> => {
  try {
    const { data, error } = await supabase.from('hero_slides').select('*').order('id', { ascending: true });
    
    // If DB is empty or error, return defaults
    if (error) {
        console.error("Error loading slides:", error);
        return INITIAL_HERO_SLIDES;
    }

    const dbSlides = data || [];

    // MERGE STRATEGY:
    // We map over the INITIAL structure.
    // If the DB has a slide for that ID, we use the DB version.
    // Otherwise, we use the default version.
    const mergedSlides = INITIAL_HERO_SLIDES.map(initialSlide => {
        const foundInDb = dbSlides.find((dbSlide: any) => dbSlide.id === initialSlide.id);
        return foundInDb ? (foundInDb as HeroSlide) : initialSlide;
    });

    // Add any new slides created in DB that are not in the initial set
    const extraSlides = dbSlides.filter((dbSlide: any) => !INITIAL_HERO_SLIDES.find(is => is.id === dbSlide.id));

    return [...mergedSlides, ...extraSlides].sort((a, b) => a.id - b.id);
  } catch (err) {
    console.error(err);
    return INITIAL_HERO_SLIDES;
  }
};

export const saveHeroSlide = async (slide: HeroSlide): Promise<void> => {
  const { error } = await supabase.from('hero_slides').upsert(slide);
  if (error) console.error('Error saving slide:', error);
};

export const deleteHeroSlide = async (id: number): Promise<void> => {
  const { error } = await supabase.from('hero_slides').delete().eq('id', id);
  if (error) console.error('Error deleting slide:', error);
};

export const getPromoBanners = async (): Promise<PromoBanner[]> => {
  try {
    const { data, error } = await supabase.from('promo_banners').select('*');
    
    if (error) {
        console.error("Error loading banners:", error);
        return INITIAL_PROMO_BANNERS;
    }

    const dbBanners = data || [];

    // Same merge strategy for Banners
    const mergedBanners = INITIAL_PROMO_BANNERS.map(initialBanner => {
        const foundInDb = dbBanners.find((dbBanner: any) => dbBanner.id === initialBanner.id);
        return foundInDb ? (foundInDb as PromoBanner) : initialBanner;
    });
    
    const extraBanners = dbBanners.filter((dbBanner: any) => !INITIAL_PROMO_BANNERS.find(ib => ib.id === dbBanner.id));

    return [...mergedBanners, ...extraBanners];
  } catch (err) {
    console.error(err);
    return INITIAL_PROMO_BANNERS;
  }
};

export const savePromoBanner = async (banner: PromoBanner): Promise<void> => {
  const { error } = await supabase.from('promo_banners').upsert(banner);
  if (error) console.error('Error saving banner:', error);
};
