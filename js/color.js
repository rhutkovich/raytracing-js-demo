class Color {
  r;
  g;
  b;
  a;

  constructor(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  static rgb(r, g, b) {
    return new Color(r, g, b, 1.0);
  }

  multiply(otherColor) {
    return new Color(this.r * otherColor.r, this.g * otherColor.g, this.b * otherColor.b, this.a * otherColor.a);
  }

  intense(factor) {
    return new Color(this.r * factor, this.g * factor, this.b * factor, this.a * factor);
  }

  add(otherColor) {
    return new Color(this.r + otherColor.r, this.g + otherColor.g, this.b + otherColor.b, this.a + otherColor.a);
  }

  isNonBlack() {
    return this.r > 0 || this.g > 0 || this.b > 0;
  }
}

export default Color;