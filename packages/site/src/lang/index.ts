import topbar from "./topbar";
import { cookie } from "jsfast";

export interface LangComponent {
  lang: string;
  label?: string;
  index: {
    [key: string]: string;
  };
}
export type LangFile = {
  name: string;
  list: LangComponent[];
};

interface I18n {
  [key: string]: LangComponent;
}

export function getI18n(name: string): I18n {
  const fileList = [topbar];
  const i18n: I18n = {};

  fileList.forEach((file) => {
    if (file.name !== name) return;
    file.list.forEach((component) => {
      // Base: en, if the language is not fully translated, use en as the fallback(base language)
      if (component.lang === getCurrentLang() || component.lang === "en") i18n[component.lang] = component;
    });
  });

  return i18n;
}

export function getCurrentLang() {
  if (!cookie.get("lang")) cookie.set("lang", "en");
  return cookie.get("lang");
}
