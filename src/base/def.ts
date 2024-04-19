export interface FastjsModuleBase {
  [key: string]: any;
  setCustomProp(name: string, value: any): this;
  setCustomProps(props: {[key: string]: any}): this;
  getCustomProp(name: string): any;
  setCustomEvent(name: string, func: (module: this, ...args: any[]) => void, setup?: boolean): this;
  callCustomEvent(name: string, ...args: any[]): this;
  then(func: (e: this) => void, time?: number): this;
}