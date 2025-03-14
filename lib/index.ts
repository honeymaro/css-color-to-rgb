const cache = new WeakMap<HTMLElement, Map<string, number[]>>();

const toHex = (num: number) => num.toString(16).padStart(2, "0");

function getVariable(variableName: string, element: HTMLElement) {
  return getComputedStyle(element).getPropertyValue(variableName);
}

export function cssColorToRgb(
  cssColorValue: string,
  options?: { force?: boolean; element?: HTMLElement }
) {
  const { force, element = document.body } = options || {};
  let color = cssColorValue.trim();
  const elementCache = cache.get(element);
  const cachedColor = elementCache?.get(cssColorValue);
  if (cachedColor && !force) {
    return cachedColor;
  }

  const variableFunctionMatches = color.match(
    /(?<=var\(\s*)(--[\w-]+)(?=\s*\))/g
  );

  if (variableFunctionMatches?.length) {
    variableFunctionMatches.forEach((match) => {
      const variableValue = getVariable(match, element);
      color = color.replace(`var(${match})`, variableValue);
    });
  }

  if (element) {
    const computedStyle = getComputedStyle(element);

    if (Object.prototype.hasOwnProperty.call(computedStyle, color)) {
      const value = computedStyle[color as keyof CSSStyleDeclaration];
      if (typeof value === "string" && value) {
        color = value;
      }
    } else {
      const propertyValue = computedStyle.getPropertyValue(color);
      if (propertyValue) {
        color = propertyValue;
      }
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return [0, 0, 0];
  }
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const pixelData = ctx.getImageData(0, 0, 1, 1).data;

  const rgb = [pixelData[0], pixelData[1], pixelData[2]];

  if (!elementCache) {
    cache.set(element, new Map([[cssColorValue, rgb]]));
  } else {
    elementCache.set(cssColorValue, rgb);
  }

  canvas.remove();
  return rgb;
}

export function cssColorToHex(...args: Parameters<typeof cssColorToRgb>) {
  const rgb = cssColorToRgb(...args);
  const hex = "#" + toHex(rgb[0]) + toHex(rgb[1]) + toHex(rgb[2]);
  return hex;
}
