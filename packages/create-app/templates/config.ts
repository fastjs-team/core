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
  },
  {
    name: "vue",
    label: "Vue",
    types: [
      {
        name: "vue-js",
        label: "JavaScript",
        path: "./templates/vue/"
      },
      {
        name: "vue-ts",
        label: "TypeScript",
        path: "./templates/vue-ts/"
      },
      {
        name: "vue-option-js",
        label: "Vue Option API (JavaScript)",
        path: "./templates/vue-option/"
      },
      {
        name: "vue-option-ts",
        label: "Vue Option API (TypeScript)",
        path: "./templates/vue-option-ts/"
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
