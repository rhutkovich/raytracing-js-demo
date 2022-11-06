class Vector2d {
  x;
  y;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static zero() {
    return new Vector2d(0, 0);
  }

  static identity(component) {
    if (isNaN(component)) {
      return new Vector2d(1, 1);
    }
    return new Vector2d(component, component);
  }

  scale(factor) {
    return new Vector2d(this.x * factor, this.y * factor);
  }

  multiply(vector) {
    return new Vector2d(this.x * vector.x, this.y * vector.y);
  }

  dot(vector) {
    return this.x * vector.x + this.y * vector.y;
  }

  add(vector) {
    return new Vector2d(this.x + vector.x, this.y + vector.y);
  }

  sub(vector) {
    return new Vector2d(this.x - vector.x, this.y - vector.y);
  }

  inverse() {
    return new Vector2d(-this.x, -this.y);
  }

  sqLength() {
    return this.x * this.x + this.y * this.y;
  }

  length() {
    return Math.sqrt(this.sqLength());
  }

  normalize() {
    const length = this.length();
    if (length > 0) {
      const normalization = 1 / length;
      this.x *= normalization;
      this.y *= normalization;
    }
    return this;
  }
}

export default Vector2d;