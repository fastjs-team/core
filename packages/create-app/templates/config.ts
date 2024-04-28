export interface TemplateConfig {
  name: string;
  label?: string;
  path?: string;
  plugins?: PluginConfig[];
  types?: TemplateType[];
}

export interface TemplateType {
  name: string;
  label: string;
  path: string;
  plugins?: PluginConfig[];
}

export interface PluginConfig {
  name: string;
  label?: string;
  selectable: boolean;
  default?: boolean;
  setup?: (path: string) => any;
}

export const templates: TemplateConfig[] = [
  {
    name: "vanilla",
    label: "Vanilla",
    types: [
      {
        name: "vanilla-js",
        label: "JavaScript",
        path: "./templates/vanilla/"
      },
      {
        name: "vanilla-ts",
        label: "TypeScript",
        path: "./templates/vanilla-ts/"
      }
    ]
  }
];

export const globalPlugins: PluginConfig[] = [
  {
    name: "prettier",
    label: "Prettier",
    selectable: true,
    default: true
  }
];
