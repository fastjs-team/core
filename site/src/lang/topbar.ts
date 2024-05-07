import { LangComponent, LangFile } from ".";

const en: LangComponent = {
  lang: "en",
  label: "English",
  index: {
    home: "Home",
    about: "About",
    sponsor: "Sponsor",
    playground: "Playground",
    docs: "Docs"
  }
};

const topbar: LangFile = {
  name: "topbar",
  list: [en]
};

export default topbar;
