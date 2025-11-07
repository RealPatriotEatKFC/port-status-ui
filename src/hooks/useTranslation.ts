import { usePortStore } from '../store/usePortStore';
import { getTranslation } from '../locales';

export const useTranslation = () => {
  const language = usePortStore((state) => state.language);
  const t = getTranslation(language);
  return t;
};

