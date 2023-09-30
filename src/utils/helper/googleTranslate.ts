import { v2 } from "@google-cloud/translate";

export const Translate = new v2.Translate({
  key: process.env.GOOGLE_TRANSLATE_API_KEY,
});
