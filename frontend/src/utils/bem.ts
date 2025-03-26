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

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
