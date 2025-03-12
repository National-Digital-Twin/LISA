function prettyName(name: string): string {
  return name?.replace(/\W/g, ' ')?.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
}

function prettyInitials(name: string): string {
  const words = name.trim().split(/[\s.]+/);
  return words.map((word) => word[0].toUpperCase()).join('');
}

export const pretty = {
  name: prettyName,
  initials: prettyInitials
};
