import type { SampleImage } from '../types';
import animeHeroineImg from '../assets/samples/anime-heroine.jpg';
import chibiCatgirlImg from '../assets/samples/chibi-catgirl.jpg';
import mangaPortraitImg from '../assets/samples/manga-portrait.jpg';
import sceneryCrossingImg from '../assets/samples/scenery-crossing.jpg';

export const SAMPLE_IMAGES: SampleImage[] = [
  {
    id: 'anime-heroine',
    title: 'Sailor Heroine',
    subtitle: 'Silver-haired anime heroine under clear blue sky',
    url: animeHeroineImg,
  },
  {
    id: 'manga-portrait',
    title: 'Manga Lineart',
    subtitle: 'Clean grayscale manga portrait (Perfect for gradient maps)',
    url: mangaPortraitImg,
  },
  {
    id: 'chibi-catgirl',
    title: 'Chibi Catgirl',
    subtitle: 'Cute chibi catgirl figurine with expressive eyes',
    url: chibiCatgirlImg,
  },
  {
    id: 'scenery-crossing',
    title: 'Seaside Crossing',
    subtitle: 'Anime seaside railway crossing & summer cumulus clouds',
    url: sceneryCrossingImg,
  },
];

export const DEFAULT_IMAGE = SAMPLE_IMAGES[0].url;
