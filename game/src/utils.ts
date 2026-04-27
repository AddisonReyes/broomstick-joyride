import "kaplay/global";

type RgbTuple = [number, number, number];

const usernameStorageKey = "broomstick-joyride.username";

export function hexToRgb(
  hex: string,
): RgbTuple | null {
  let cleanHex = hex.replace(/^#/, "");

  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split("")
      .map((character) => character + character)
      .join("");
  }

  if (cleanHex.length !== 6) {
    return null;
  }

  const red = parseInt(cleanHex.substring(0, 2), 16);
  const green = parseInt(cleanHex.substring(2, 4), 16);
  const blue = parseInt(cleanHex.substring(4, 6), 16);

  return [red, green, blue];
}

export function hexToColor(hex: string): ReturnType<typeof color> | null {
  const rgbValues = hexToRgb(hex);

  if (!rgbValues) {
    return null;
  }

  const [red, green, blue] = rgbValues;
  return color(red, green, blue);
}

export function convertDistance(distance: number): string {
  const roundedDistance = Math.round(distance);
  return roundedDistance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function getStoredUsername(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedUsername = window.localStorage.getItem(usernameStorageKey);
    const normalizedUsername = normalizeUsername(storedUsername ?? "");

    return normalizedUsername === "" ? null : normalizedUsername;
  } catch {
    return null;
  }
}

export function storeUsername(username: string): string {
  const normalizedUsername = normalizeUsername(username);

  if (normalizedUsername === "" || typeof window === "undefined") {
    return normalizedUsername;
  }

  try {
    window.localStorage.setItem(usernameStorageKey, normalizedUsername);
  } catch {
    return normalizedUsername;
  }

  return normalizedUsername;
}

function normalizeUsername(username: string): string {
  return username.trim();
}
