import "kaplay/global";

type ButtonHandler = () => void;
type RgbTuple = [number, number, number];

export function addButton(
  buttonLabel = "text",
  position = vec2(200, 100),
  onClick: ButtonHandler = () => {},
  descriptionLabel = "",
) {
  const button = add([
    rect(240, 80, { radius: 6 }),
    pos(position),
    area(),
    scale(1),
    anchor("center"),
    outline(4),
    color(255, 255, 255),
  ]);

  const description = add([
    text(descriptionLabel),
    pos(button.pos.x + 160, button.pos.y),
    anchor("left"),
  ]);

  description.hidden = true;

  button.add([text(buttonLabel), anchor("center"), color(0, 0, 0)]);

  button.onHoverUpdate(() => {
    const hoverTime = time() * 10;

    button.color = hsl2rgb((hoverTime / 10) % 1, 0.6, 0.7);
    button.scale = vec2(1.1);
    setCursor("pointer");

    if (descriptionLabel) {
      description.hidden = false;
    }
  });

  button.onHoverEnd(() => {
    if (descriptionLabel) {
      description.hidden = true;
    }

    button.scale = vec2(1);
    button.color = rgb();
  });

  button.onClick(onClick);

  return button;
}

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
