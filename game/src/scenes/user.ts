import "kaplay/global";
import { uiText } from "../constants.js";
import { scaleUi } from "../layout.js";
import type { PlayerSceneData } from "../types.js";
import { storeUsername } from "../utils.js";
import {
  addArcaneButton,
  addArcaneNightBackdrop,
  addArcanePanel,
  getArcanePalette,
} from "../ui/arcane.js";

const usernameInputMaxLength = 16;

type Vector2 = ReturnType<typeof vec2>;

export default function userScene(): void {
  scene("user", ({ username }: PlayerSceneData) => {
    const palette = getArcanePalette();
    const isTouchDevice = isTouchscreen();
    const inputCenter = vec2(width() / 2, height() / 2);
    const inputOuterSize = vec2(scaleUi(420), scaleUi(74));
    const inputInnerSize = vec2(scaleUi(392), scaleUi(48));
    const initialUsername = normalizeUsername(username);
    let usernameValue = initialUsername;
    let inputSelected = false;
    let attemptedSubmitWithoutUsername = false;

    addArcaneNightBackdrop();
    addArcanePanel(
      vec2(width() / 2, height() / 2),
      vec2(scaleUi(620), scaleUi(420)),
      10,
    );

    add([
      text("Username", { size: scaleUi(32) }),
      pos(width() / 2, scaleUi(118)),
      anchor("center"),
      color(palette.goldGlow),
      fixed(),
      z(12),
    ]);

    const titleLabel = add([
      text(uiText.usernamePrompt, {
        size: scaleUi(16),
        width: scaleUi(460),
        align: "center",
      }),
      pos(width() / 2, scaleUi(176)),
      anchor("center"),
      color(palette.titleBlue),
      fixed(),
      z(12),
    ]);

    const inputFrame = add([
      rect(inputOuterSize.x, inputOuterSize.y, { radius: scaleUi(16) }),
      pos(inputCenter),
      anchor("center"),
      area({ cursor: "text" }),
      outline(scaleUi(4), palette.buttonOutline),
      color(palette.buttonBase),
      fixed(),
      z(11),
    ]);

    add([
      rect(inputInnerSize.x, inputInnerSize.y, { radius: scaleUi(12) }),
      pos(inputCenter),
      anchor("center"),
      color(palette.buttonGlow),
      opacity(0.5),
      fixed(),
      z(11),
    ]);

    const usernameLabel = add([
      text("", {
        size: scaleUi(24),
        width: scaleUi(360),
        align: "center",
      }),
      pos(inputCenter),
      anchor("center"),
      color(palette.parchment),
      fixed(),
      z(12),
    ]);

    const enterLabel = add([
      text(uiText.usernameIdle, {
        size: scaleUi(16),
        width: scaleUi(420),
        align: "center",
      }),
      pos(width() / 2, height() / 2 + scaleUi(72)),
      anchor("center"),
      color(palette.descriptionBlue),
      fixed(),
      z(12),
    ]);

    addArcaneButton(
      "Continue",
      vec2(width() / 2, height() / 2 + scaleUi(148)),
      submitUsername,
      "",
      240,
      20,
    );

    const hiddenInput = createHiddenUsernameInput(
      initialUsername,
      usernameInputMaxLength,
    );

    function refreshInputFeedback(): void {
      inputFrame.outline.color = inputSelected
        ? palette.goldGlow
        : palette.buttonOutline;

      if (attemptedSubmitWithoutUsername && usernameValue === "") {
        titleLabel.text =
          isTouchDevice && !inputSelected
            ? uiText.usernameTapPrompt
            : uiText.usernamePrompt;
        titleLabel.color = palette.titleBlue;
        enterLabel.text = uiText.usernameError;
        enterLabel.color = palette.danger;
        return;
      }

      enterLabel.color = palette.descriptionBlue;

      if (usernameValue === "") {
        titleLabel.text =
          isTouchDevice && !inputSelected
            ? uiText.usernameTapPrompt
            : uiText.usernamePrompt;
        titleLabel.color = palette.titleBlue;
        enterLabel.text = isTouchDevice
          ? inputSelected
            ? uiText.usernameTouchFocused
            : uiText.usernameTouchIdle
          : uiText.usernameIdle;
        return;
      }

      enterLabel.text = isTouchDevice
        ? uiText.usernameTouchContinue
        : uiText.usernameContinue;
      titleLabel.text = "Your broom will carry this name this night";
      titleLabel.color = palette.arcaneGlow;
    }

    function syncUsername(nextValue: string): void {
      usernameValue = normalizeUsername(nextValue);
      hiddenInput.element.value = usernameValue;
      usernameLabel.text = escapeLabelText(usernameValue);

      if (usernameValue !== "") {
        attemptedSubmitWithoutUsername = false;
      }

      refreshInputFeedback();
    }

    function focusUsernameInput(): void {
      hiddenInput.focus();
    }

    function blurUsernameInput(): void {
      hiddenInput.blur();
    }

    function submitUsername(): void {
      const storedUsername = storeUsername(usernameValue);

      if (storedUsername === "") {
        attemptedSubmitWithoutUsername = true;
        refreshInputFeedback();
        focusUsernameInput();
        return;
      }

      blurUsernameInput();
      canvas.focus();
      go("menu", { username: storedUsername });
    }

    const handleInputFocus = () => {
      inputSelected = true;
      refreshInputFeedback();
    };
    const handleInputBlur = () => {
      inputSelected = false;
      refreshInputFeedback();
    };
    const handleInput = () => {
      syncUsername(hiddenInput.element.value);
    };
    const handleInputKeydown = (event: KeyboardEvent) => {
      if (event.key !== "Enter") {
        return;
      }

      event.preventDefault();
      submitUsername();
    };

    hiddenInput.element.addEventListener("focus", handleInputFocus);
    hiddenInput.element.addEventListener("blur", handleInputBlur);
    hiddenInput.element.addEventListener("input", handleInput);
    hiddenInput.element.addEventListener("keydown", handleInputKeydown);

    inputFrame.onClick(focusUsernameInput);

    onMousePress("left", () => {
      if (!isPointInsideRect(mousePos(), inputCenter, inputOuterSize)) {
        blurUsernameInput();
      }
    });

    onTouchStart((touchPosition) => {
      if (isPointInsideRect(touchPosition, inputCenter, inputOuterSize)) {
        focusUsernameInput();
        return;
      }

      blurUsernameInput();
    });

    onKeyPress("enter", submitUsername);

    onSceneLeave(() => {
      hiddenInput.element.removeEventListener("focus", handleInputFocus);
      hiddenInput.element.removeEventListener("blur", handleInputBlur);
      hiddenInput.element.removeEventListener("input", handleInput);
      hiddenInput.element.removeEventListener("keydown", handleInputKeydown);
      hiddenInput.destroy();
      canvas.focus();
    });

    syncUsername(initialUsername);

    if (isTouchDevice) {
      refreshInputFeedback();
      return;
    }

    focusUsernameInput();
  });
}

function normalizeUsername(username: string): string {
  return username.trim().slice(0, usernameInputMaxLength);
}

function escapeLabelText(value: string): string {
  return value.replace(/([\[\\])/g, "\\$1");
}

function isPointInsideRect(
  point: Vector2,
  center: Vector2,
  size: Vector2,
): boolean {
  const halfWidth = size.x / 2;
  const halfHeight = size.y / 2;

  return (
    point.x >= center.x - halfWidth &&
    point.x <= center.x + halfWidth &&
    point.y >= center.y - halfHeight &&
    point.y <= center.y + halfHeight
  );
}

function createHiddenUsernameInput(initialValue: string, maxLength: number) {
  const inputElement = document.createElement("input");

  inputElement.type = "text";
  inputElement.value = initialValue;
  inputElement.maxLength = maxLength;
  inputElement.inputMode = "text";
  inputElement.autocomplete = "off";
  inputElement.autocorrect = "off";
  inputElement.spellcheck = false;
  inputElement.style.position = "fixed";
  inputElement.style.top = "0";
  inputElement.style.left = "0";
  inputElement.style.width = "1px";
  inputElement.style.height = "1px";
  inputElement.style.padding = "0";
  inputElement.style.border = "0";
  inputElement.style.margin = "0";
  inputElement.style.opacity = "0.01";
  inputElement.style.pointerEvents = "none";
  inputElement.style.fontSize = "16px";
  inputElement.style.background = "transparent";
  inputElement.style.zIndex = "30";
  inputElement.setAttribute("aria-label", "Username");
  inputElement.setAttribute("autocapitalize", "off");
  inputElement.setAttribute("enterkeyhint", "done");

  document.body.appendChild(inputElement);

  return {
    element: inputElement,
    focus(): void {
      inputElement.focus();
      const cursorPosition = inputElement.value.length;
      inputElement.setSelectionRange(cursorPosition, cursorPosition);
    },
    blur(): void {
      inputElement.blur();
    },
    destroy(): void {
      inputElement.remove();
    },
  };
}
