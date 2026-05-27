export class TransformStack {
  private stack: { a: number; b: number; c: number; d: number; tx: number; ty: number }[] = [];

  constructor() {
    this.stack.push({ a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 });
  }

  push(matrix: { a: number; b: number; c: number; d: number; tx: number; ty: number }) {
    const parent = this.stack[this.stack.length - 1];
    const result = this.multiply(parent, matrix);
    this.stack.push(result);
  }

  pop() {
    if (this.stack.length > 1) {
      this.stack.pop();
    }
  }

  getCurrent() {
    return this.stack[this.stack.length - 1];
  }

  private multiply(
    a: { a: number; b: number; c: number; d: number; tx: number; ty: number },
    b: { a: number; b: number; c: number; d: number; tx: number; ty: number }
  ) {
    return {
      a: a.a * b.a + a.c * b.b,
      b: a.b * b.a + a.d * b.b,
      c: a.a * b.c + a.c * b.d,
      d: a.b * b.c + a.d * b.d,
      tx: a.a * b.tx + a.c * b.ty + a.tx,
      ty: a.b * b.tx + a.d * b.ty + a.ty,
    };
  }
}
