class Vector3d {
  x; y; z;

  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static zero() {
    return new Vector3d(0, 0, 0);
  }

  static identity(component) {
    if (isNaN(component)) {
      return new Vector3d(1, 1, 1);
    }
    return new Vector3d(component, component, component);
  }

  scale(factor) {
    return new Vector3d(this.x * factor, this.y * factor, this.z * factor);
  }

  multiply(vector) {
    return new Vector3d(this.x * vector.x, this.y * vector.y, this.z * vector.z);
  }

  dot(vector) {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  }

  add(vector) {
    return new Vector3d(this.x + vector.x, this.y + vector.y, this.z + vector.z);
  }

  sub(vector) {
    return new Vector3d(this.x - vector.x, this.y - vector.y, this.z - vector.z);
  }

  inverse() {
    return new Vector3d(-this.x, -this.y, -this.z);
  }

  sqLength() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
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
      this.z *= normalization;
    }
    return this;
  }
}
export default Vector3d;