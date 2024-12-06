export type ModifiersType = string | Array<string>;

function toArray(src: ModifiersType): Array<string> {
  if (Array.isArray(src)) {
    return src;
  }
  return [src];
}

function concatClasses(...classes: Array<ModifiersType>) {
  return classes.flat(Infinity).filter((cs) => !!cs).join(' ') || undefined;
}

export default function bem(block: string, blockModifiers?: ModifiersType, blockExtra?: string) {
  const bModifiers = toArray(blockModifiers ?? []);

  return (element?: string, elementModifiers?: ModifiersType, elementExtra?: string) => {
    const eModifiers = toArray(elementModifiers ?? []);
    if (element) {
      return concatClasses(
        `${block}__${element}`,
        eModifiers?.filter((e) => !!e).map((m) => `${block}__${element}--${m}`),
        elementExtra ?? ''
      );
    }
    return concatClasses(
      block,
      bModifiers?.filter((b) => !!b).map((m) => `${block}--${m}`),
      blockExtra ?? ''
    );
  };
}
