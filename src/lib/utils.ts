export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
