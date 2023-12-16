import { Translate } from "./googleTranslate";

export const TranslateText = async (
  text: string,
  language: string
): Promise<string> => {
  const [translations] = await Translate.translate(text, language);

  return translations;
};
