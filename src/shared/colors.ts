function componentToHex(c: number) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

export function rgbToHex(r: number, g: number, b: number) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function hexToRgb(c: string): { r: number; g: number; b: number } {
  if (c.length !== 7 || !c.startsWith("#"))
    throw new Error(`Not a color: ${c}`);
  const red = c.slice(1, 3);
  const green = c.slice(3, 5);
  const blue = c.slice(5, 7);
  return {
    r: parseInt(red, 16),
    g: parseInt(green, 16),
    b: parseInt(blue, 16),
  };
}
