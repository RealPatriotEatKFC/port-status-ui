import { ko } from './ko';
import { en } from './en';

export type Language = 'ko' | 'en';

export const translations = {
  ko,
  en,
};

export const getTranslation = (lang: Language) => {
  return translations[lang] || translations.ko;
};

