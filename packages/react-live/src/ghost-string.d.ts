export function charEncode(ch: string, table: string[]): string

export type GhostStringOptions = {
  sepChar?: string
  table?: string[]
}

export function encode(string: string, opts?: GhostStringOptions): string

export function decode(encoded: string, opts?: GhostStringOptions): string
