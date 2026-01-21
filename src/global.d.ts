// Bun test type declarations
declare module 'bun:test' {
  interface Test {
    (name: string, fn: () => void | Promise<void>): void;
    skip(name: string, fn: () => void | Promise<void>): void;
    only(name: string, fn: () => void | Promise<void>): void;
  }

  interface Describe {
    (name: string, fn: () => void | Promise<void>): void;
    skip(name: string, fn: () => void | Promise<void>): void;
    only(name: string, fn: () => void | Promise<void>): void;
  }

  interface Expect {
    (value: unknown): Matchers;
    extend(matchers: Record<string, () => void>): void;
  }

  interface Matchers {
    toBe(value: unknown): void;
    toEqual(value: unknown): void;
    toHaveLength(length: number): void;
    toContain(value: unknown): void;
    toBeTruthy(): void;
    toBeFalsy(): void;
    toBeNull(): void;
    toBeUndefined(): void;
    toBeDefined(): void;
    toBeGreaterThan(value: number): void;
    toBeLessThan(value: number): void;
    toThrow(message?: string | RegExp): void;
    toHaveProperty(property: string | string[], value?: unknown): void;
    toMatch(matcher: string | RegExp): void;
    toHaveBeenCalled(): void;
    toHaveBeenCalledWith(...args: unknown[]): void;
    toHaveBeenCalledTimes(times: number): void;
    toResolve(): void;
    toReject(): void;
    not: Matchers;
  }

  export const test: Test;
  export const it: Test;
  export const xtest: Test;
  export const xit: Test;
  export const describe: Describe;
  export const xdescribe: Describe;
  export const beforeEach: (fn: () => void | Promise<void>) => void;
  export const beforeAll: (fn: () => void | Promise<void>) => void;
  export const afterEach: (fn: () => void | Promise<void>) => void;
  export const afterAll: (fn: () => void | Promise<void>) => void;
  export const expect: Expect;
}
