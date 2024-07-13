import { FastjsDom } from "./dom-types";

export type PushTarget =
  | "firstElementChild"
  | "lastElementChild"
  | "randomElementChild"
  | "beforeElement"
  | "afterElement"
  | "replaceElement"
  | number;

export type PushReturn<T, ElementType extends ElementList> = {
  isReplace: T extends "replaceElement" ? true : false;
  newElement: T extends "replaceElement" ? FastjsDom<ElementList> : never;
  oldElement: T extends "replaceElement" ? FastjsDom<ElementType> : never;
  /** @description index to parent -> children, start with 0 */
  index: number;
  /** @description FastjsDom point to the new element */
  el: FastjsDom<ElementList>;
  /** @description FastjsDom point to the origin element when you call(this) */
  origin: FastjsDom<ElementType>;
  father: FastjsDom | null;
};

export type InsertTarget =
  | "first"
  | "last"
  | "random"
  | "before"
  | "after"
  | number;

export type InsertReturn<ElementType extends ElementList> = {
  /** @description index to parent -> children, start with 0 */
  index: number;
  /** @description FastjsDom point to the new element */
  added: FastjsDom;
  /** @description FastjsDom point to the origin element when you call(this) */
  origin: FastjsDom<ElementType>;
};

export type EventCallback<ElementType extends ElementList> = (
  el: FastjsDom<ElementType>,
  event: Event
) => void;
export type EachCallback<ElementType extends ElementList> = (
  el: FastjsDom<ElementType>,
  dom: ElementType,
  index: number
) => void;
export type EventList<ElementType extends ElementList> = Array<{
  type: keyof HTMLElementEventMap;
  callback: EventCallback<ElementType>;
  trigger: EventListener;
  remove: () => void;
}>;

export type ElementList =
  | HTMLElement
  | HTMLAnchorElement
  | HTMLAreaElement
  | HTMLAudioElement
  | HTMLBodyElement
  | HTMLBaseElement
  | HTMLBRElement
  | HTMLButtonElement
  | HTMLCanvasElement
  | HTMLDivElement
  | HTMLDListElement
  | HTMLDataElement
  | HTMLDataListElement
  | HTMLDialogElement
  | HTMLDetailsElement
  | HTMLEmbedElement
  | HTMLFormElement
  | HTMLFieldSetElement
  | HTMLHRElement
  | HTMLHeadingElement
  | HTMLHtmlElement
  | HTMLHeadingElement
  | HTMLIFrameElement
  | HTMLImageElement
  | HTMLInputElement
  | HTMLLegendElement
  | HTMLLabelElement
  | HTMLLIElement
  | HTMLLinkElement
  | HTMLMapElement
  | HTMLMenuElement
  | HTMLMediaElement
  | HTMLMeterElement
  | HTMLModElement
  | HTMLMetaElement
  | HTMLObjectElement
  | HTMLOListElement
  | HTMLOptGroupElement
  | HTMLParagraphElement
  | HTMLPreElement
  | HTMLProgressElement
  | HTMLQuoteElement
  | HTMLScriptElement
  | HTMLSelectElement
  | HTMLSpanElement
  | HTMLSourceElement
  | HTMLStyleElement
  | HTMLTableCaptionElement
  | HTMLTableElement
  | HTMLTableRowElement
  | HTMLTableCellElement
  | HTMLTextAreaElement
  | HTMLTimeElement
  | HTMLTitleElement
  | HTMLUListElement
  | HTMLVideoElement
  | HTMLUnknownElement
  | SVGElements;

type SVGElements =
  | SVGElement
  | SVGAnimateElement
  | SVGAnimateMotionElement
  | SVGAnimateTransformElement
  | SVGCircleElement
  | SVGClipPathElement
  | SVGDefsElement
  | SVGDescElement
  | SVGEllipseElement
  | SVGFEBlendElement
  | SVGFEColorMatrixElement
  | SVGFEComponentTransferElement
  | SVGFECompositeElement
  | SVGFEConvolveMatrixElement
  | SVGFEDiffuseLightingElement
  | SVGFEDisplacementMapElement
  | SVGFEDistantLightElement
  | SVGFEDropShadowElement
  | SVGFEFloodElement
  | SVGFEFuncAElement
  | SVGFEFuncBElement
  | SVGFEFuncGElement
  | SVGFEFuncRElement
  | SVGFEGaussianBlurElement
  | SVGFEImageElement
  | SVGFEMergeElement
  | SVGFEMergeNodeElement
  | SVGFEMorphologyElement
  | SVGFEOffsetElement
  | SVGFEPointLightElement
  | SVGFESpecularLightingElement
  | SVGFESpotLightElement
  | SVGFETileElement
  | SVGFETurbulenceElement
  | SVGFilterElement
  | SVGForeignObjectElement
  | SVGGElement
  | SVGImageElement
  | SVGLineElement
  | SVGLinearGradientElement
  | SVGMarkerElement
  | SVGMaskElement
  | SVGMetadataElement
  | SVGPathElement
  | SVGPatternElement
  | SVGPolygonElement
  | SVGPolylineElement
  | SVGRadialGradientElement
  | SVGRectElement
  | SVGSVGElement
  | SVGScriptElement
  | SVGSetElement
  | SVGStopElement
  | SVGStyleElement
  | SVGSwitchElement
  | SVGSymbolElement
  | SVGTextElement
  | SVGTextPathElement
  | SVGTitleElement
  | SVGTSpanElement
  | SVGUseElement
  | SVGViewElement;

export type CustomProps = {
  html?: string;
  text?: string;
  css?: StyleObj | string;
  class?: string[] | string;
  attr?: { [key: string]: string | null };
  val?: string;
};

export type FastjsDomProps<ElementType extends ElementList> = CustomProps &
  Partial<Record<keyof ElementType, any>>;

export type StyleObj = Partial<CSSStyleDeclaration>;
export type StyleObjKeys = keyof StyleObj;
export type SetStyleObj = { [K in StyleObjKeys]?: StyleObj[K] | null };
