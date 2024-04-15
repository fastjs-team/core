type styleObj = {
  [K in keyof CSSStyleDeclaration as CSSStyleDeclaration[K] extends string
    ? K
    : never]?: CSSStyleDeclaration[K];
};
type styleObjKeys = keyof styleObj;

export type { styleObj, styleObjKeys };
