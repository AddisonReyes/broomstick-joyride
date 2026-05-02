import "kaplay/global";
import { playButtonClickSound } from "../audio.js";
import { scaleUi } from "../layout.js";

type ArcaneAction = () => void;
type Vector2 = ReturnType<typeof vec2>;

function createArcanePalette() {
  return {
    moonColor: rgb(248, 231, 180),
    nightBlue: rgb(14, 17, 40),
    mistBlue: rgb(42, 58, 92),
    arcaneBlue: rgb(89, 129, 196),
    arcaneGlow: rgb(109, 224, 214),
    goldGlow: rgb(226, 196, 120),
    inkBlack: rgb(12, 11, 24),
    parchment: rgb(235, 224, 198),
    footerBlue: rgb(150, 176, 221),
    titleBlue: rgb(161, 194, 221),
    buttonOutline: rgb(85, 113, 164),
    buttonBase: rgb(28, 31, 58),
    buttonGlow: rgb(57, 70, 114),
    panelInner: rgb(44, 49, 90),
    buttonHover: rgb(38, 42, 76),
    buttonHoverGlow: rgb(84, 103, 165),
    descriptionBlue: rgb(183, 202, 227),
    labelHover: rgb(249, 239, 217),
    danger: rgb(203, 108, 124),
  };
}

export type ArcanePalette = ReturnType<typeof createArcanePalette>;

export function getArcanePalette(): ArcanePalette {
  return createArcanePalette();
}

export function addArcaneNightBackdrop(footerText: string = ""): void {
  const palette = getArcanePalette();
  const moonOffsetX = scaleUi(160);
  const moonOffsetY = scaleUi(120);

  add([
    rect(width(), height()),
    pos(0, 0),
    color(palette.nightBlue),
    fixed(),
    z(-100),
  ]);

  add([
    circle(scaleUi(96)),
    pos(width() - moonOffsetX, moonOffsetY),
    color(palette.moonColor),
    opacity(0.95),
    fixed(),
    z(-90),
  ]);

  add([
    circle(scaleUi(124)),
    pos(width() - moonOffsetX, moonOffsetY),
    color(palette.goldGlow),
    opacity(0.12),
    fixed(),
    z(-91),
  ]);

  add([
    rect(width() * 0.82, scaleUi(220), { radius: scaleUi(28) }),
    pos(width() * 0.1, height() - scaleUi(220)),
    color(palette.mistBlue),
    opacity(0.28),
    rotate(-4),
    fixed(),
    z(-80),
  ]);

  add([
    rect(width() * 0.68, scaleUi(180), { radius: scaleUi(24) }),
    pos(width() * 0.38, height() - scaleUi(160)),
    color(palette.arcaneBlue),
    opacity(0.14),
    rotate(5),
    fixed(),
    z(-79),
  ]);

  add([
    rect(scaleUi(170), height() * 0.55),
    pos(width() * 0.08, height() * 0.45),
    color(palette.inkBlack),
    opacity(0.65),
    fixed(),
    z(-78),
  ]);

  add([
    rect(scaleUi(120), height() * 0.42),
    pos(width() * 0.78, height() * 0.58),
    color(palette.inkBlack),
    opacity(0.58),
    fixed(),
    z(-78),
  ]);

  for (let index = 0; index < 20; index++) {
    const star = add([
      circle(rand(1, 2.6)),
      pos(
        rand(scaleUi(48), width() - scaleUi(48)),
        rand(scaleUi(32), height() * 0.5),
      ),
      color(index % 3 === 0 ? palette.goldGlow : palette.parchment),
      opacity(rand(0.45, 0.95)),
      fixed(),
      z(-70),
    ]);

    const driftSpeed = rand(1.2, 3.4);
    const driftOffset = rand(0, 10);

    star.onUpdate(() => {
      star.opacity = wave(0.25, 0.95, time() * driftSpeed + driftOffset);
    });
  }

  if (footerText) {
    add([
      text(footerText, { size: scaleUi(16) }),
      pos(width() / 2, height() - scaleUi(42)),
      anchor("center"),
      color(palette.footerBlue),
      opacity(0.72),
      fixed(),
      z(5),
    ]);
  }
}

export function addArcanePanel(
  center: Vector2,
  panelSize: Vector2,
  layer = 10,
) {
  const palette = getArcanePalette();
  const outlineWidth = scaleUi(4);
  const outerRadius = scaleUi(22);
  const innerPadding = scaleUi(26);
  const innerRadius = scaleUi(18);

  const panel = add([
    rect(panelSize.x, panelSize.y, { radius: outerRadius }),
    pos(center),
    anchor("center"),
    outline(outlineWidth, palette.buttonOutline),
    color(palette.buttonBase),
    opacity(0.94),
    fixed(),
    z(layer),
  ]);

  panel.add([
    rect(panelSize.x - innerPadding, panelSize.y - innerPadding, {
      radius: innerRadius,
    }),
    anchor("center"),
    color(palette.panelInner),
    opacity(0.88),
  ]);

  return panel;
}

export function addArcaneButton(
  label: string,
  buttonCenter: Vector2,
  onClick: ArcaneAction,
  description = "",
  widthPx = 320,
  layer = 20,
) {
  const palette = getArcanePalette();
  const buttonWidth = scaleUi(widthPx);
  const buttonHeight = scaleUi(76);
  const buttonRadius = scaleUi(16);
  const outlineWidth = scaleUi(4);
  const innerInsetX = scaleUi(24);
  const innerHeight = scaleUi(52);
  const innerRadius = scaleUi(12);
  const glyphRadius = scaleUi(12);
  const glyphX = -(buttonWidth / 2) + scaleUi(34);
  const labelCenterX = scaleUi(12);
  const labelCenterY = scaleUi(2);

  const button = add([
    rect(buttonWidth, buttonHeight, { radius: buttonRadius }),
    pos(buttonCenter),
    anchor("center"),
    area(),
    scale(1),
    outline(outlineWidth, palette.buttonOutline),
    color(palette.buttonBase),
    opacity(0.96),
    fixed(),
    z(layer),
  ]);

  const innerGlow = button.add([
    rect(buttonWidth - innerInsetX, innerHeight, { radius: innerRadius }),
    anchor("center"),
    color(palette.buttonGlow),
    opacity(0.68),
  ]);

  const glyph = button.add([
    circle(glyphRadius),
    pos(glyphX, 0),
    anchor("center"),
    scale(1),
    color(palette.arcaneGlow),
    opacity(0.9),
  ]);

  const labelText = button.add([
    text(label, { size: scaleUi(32) }),
    pos(labelCenterX, labelCenterY),
    anchor("center"),
    color(palette.parchment),
  ]);

  const descriptionText = add([
    text(description, { size: scaleUi(16), width: scaleUi(220) }),
    pos(buttonCenter.x + buttonWidth / 2 + scaleUi(28), buttonCenter.y),
    anchor("left"),
    color(palette.descriptionBlue),
    opacity(description ? 0.65 : 0),
    fixed(),
    z(layer - 1),
  ]);

  button.onHoverUpdate(() => {
    setCursor("pointer");
    button.scale = vec2(1.04);
    button.color = palette.buttonHover;
    innerGlow.color = palette.buttonHoverGlow;
    glyph.scale = vec2(1.2);
    glyph.color = palette.goldGlow;
    labelText.color = palette.labelHover;

    if (description) {
      descriptionText.opacity = 1;
    }
  });

  button.onHoverEnd(() => {
    setCursor("default");
    button.scale = vec2(1);
    button.color = palette.buttonBase;
    innerGlow.color = palette.buttonGlow;
    glyph.scale = vec2(1);
    glyph.color = palette.arcaneGlow;
    labelText.color = palette.parchment;

    if (description) {
      descriptionText.opacity = 0.65;
    }
  });

  button.onClick(() => {
    playButtonClickSound();
    onClick();
  });

  return button;
}
