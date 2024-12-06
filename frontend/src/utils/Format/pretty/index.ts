function prettyName(name: string): string {
  return name?.replace(/[^\w]/g, ' ')?.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
}

export const pretty = {
  name: prettyName
};
