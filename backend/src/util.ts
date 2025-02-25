export function tryParseJSONArray(str: string) {
  if (str?.startsWith('[')) {
    try {
      return JSON.parse(str) as string[];
    } catch (e) {
      console.info('Could not parse string as JSON', str);
    }
  }
  return str;
}
