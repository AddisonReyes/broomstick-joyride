import "kaplay/global";
import { viewport } from "./constants.js";

export function getResponsiveViewport(root: HTMLElement): {
  width: number;
  height: number;
} {
  const containerWidth =
    root.clientWidth > 0
      ? root.clientWidth
      : window.innerWidth > 0
        ? window.innerWidth
        : viewport.width;
  const containerHeight =
    root.clientHeight > 0
      ? root.clientHeight
      : window.innerHeight > 0
        ? window.innerHeight
        : viewport.height;
  const aspectRatio = viewport.width / viewport.height;
  const containerRatio = containerWidth / containerHeight;

  if (containerRatio > aspectRatio) {
    const height = containerHeight;
    return {
      width: Math.round(height * aspectRatio),
      height,
    };
  }

  const width = containerWidth;
  return {
    width,
    height: Math.round(width / aspectRatio),
  };
}

export function getViewportScale(): number {
  return Math.min(width() / viewport.width, height() / viewport.height);
}

export function scaleUi(value: number): number {
  return Math.max(1, Math.round(value * getViewportScale()));
}
