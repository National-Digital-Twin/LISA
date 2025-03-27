// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

interface Props {
  id: string;
  hint: string | undefined;
}
export default function LabelField({ id, hint }: Readonly<Props>) {
  if (!hint) {
    return null;
  }

  if (hint.indexOf('$|$') > -1) {
    const hints = hint.split('$|$');
    return (
      <ul id={id} className="label-field">
        {hints.map((h) => <li key={h}>{h}</li>)}
      </ul>
    );
  }

  return (
    <div id={id} className="label-field">{hint}</div>
  );
}
