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
