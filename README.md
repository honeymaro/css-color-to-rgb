# css-color-to-rgb

A utility library to convert CSS color values into an RGB array and hex code. Supports `CSS color names`, `hex` values, `RGB`, `HSL`, `CSS variables` and modern CSS color functions such as `color-mix()` and `color()`.

## Motivation

Most color parser libraries implement their own color parsing logic, which often doesn't support the latest CSS color syntax or functions. This library takes a different approach by delegating all color calculations to the browser itself. By using the browser's built-in canvas rendering capabilities, we ensure that:

- All color formats supported by the browser are automatically supported by this library
- New CSS color functions like `color-mix()`, `lch()`, and color spaces like `display-p3` work without requiring library updates
- The results match exactly what would be rendered in the browser

This approach ensures future compatibility and accurate color representation for all browser-supported color formats.

## Notes and Limitations

- **Browser Dependency**: The results depend on the CSS features supported by the user's browser. Different browsers or browser versions may return slightly different RGB values for the same color input.

- **Alpha Channel Handling**: When converting colors with alpha transparency (like `rgba()` or `hsla()`), the alpha component is composited with the canvas background and reflected in the resulting RGB values. This means the output will always be an RGB value without separate alpha information.

## Features

- `cssColorToRgb(cssColorValue, options?)`: Returns an RGB array corresponding to the provided CSS color value.
- `cssColorToHex(cssColorValue, options?)`: Returns a hex string corresponding to the provided CSS color value.

## Installation

Install using pnpm, npm, or yarn.

```bash
# pnpm
pnpm add css-color-to-rgb

# npm
npm install css-color-to-rgb

# yarn
yarn add css-color-to-rgb
```

## Usage

```js
// Example using ES Modules
import { cssColorToRgb, cssColorToHex } from "css-color-to-rgb";

// Basic color name
const rgb = cssColorToRgb("red");
console.log(rgb); // e.g., [255, 0, 0]

const hex = cssColorToHex("red");
console.log(hex); // e.g., "#ff0000"

// Hex color values
cssColorToRgb("#0088ff"); // [0, 136, 255]

// RGB color format
cssColorToRgb("rgb(0, 136, 255)"); // [0, 136, 255]

// HSL color format
cssColorToRgb("hsl(210, 100%, 50%)"); // [0, 136, 255]

// With alpha channel (alpha is reflected in the resulting RGB values)
// Since colors are rendered on canvas, transparent colors are composited with the canvas background
cssColorToRgb("rgba(0, 136, 255, 0.5)"); // The resulting RGB values will be affected by alpha compositing

// CSS Variables
// Assuming --primary-color: #0088ff; is defined in your CSS
cssColorToRgb("var(--primary-color)"); // [0, 136, 255]

// CSS Variables can be referenced in multiple ways
// 1. Using var() syntax
cssColorToRgb("var(--primary-color)"); // [0, 136, 255]

// 2. Direct variable name
cssColorToRgb("--primary-color"); // [0, 136, 255]

// 3. Accessing element's CSS properties
// For an element with style="color: blue; background-color: green;"
cssColorToRgb("color", { element: button }); // [0, 0, 255]
cssColorToRgb("backgroundColor", { element: button }); // [0, 128, 0]

// Passing a specific element to resolve CSS variables from
const button = document.querySelector("button");
cssColorToRgb("var(--button-color)", { element: button });
cssColorToRgb("--button-color", { element: button });

// Modern CSS Color functions like color-mix() are supported (in browsers that support them)
cssColorToRgb("color-mix(in srgb, blue 50%, red)"); // Approximately [128, 0, 128]

// Other CSS color functions
cssColorToRgb("color(display-p3 1 0.5 0)"); // Browser-dependent result based on display-p3 color space support
cssColorToRgb("lch(50% 50 120)"); // Browser-dependent result
```

**Note:** All color values as described in [MDN Web Docs on CSS color values](https://developer.mozilla.org/docs/Web/CSS/color_value) are supported.

## Options

The `options` parameter for the `cssColorToRgb` function (and consequently for `cssColorToHex`) is an optional object that can include the following properties:

- **force** (optional, boolean):  
  When set to `true`, it bypasses the cached result and forces the function to recompute the color conversion.
- **element** (optional, HTMLElement):  
  Specifies the DOM element whose computed CSS styles are used to resolve CSS variables.  
  Defaults to `document.body` if not provided.

## Build

To build the library:

```bash
pnpm build
```

## License

[MIT](LICENSE)
