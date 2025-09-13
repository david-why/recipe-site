export function strip(text: string, chars: string): string {
  while (text && chars.includes(text.charAt(0))) {
    text = text.slice(1)
  }
  return text
}
