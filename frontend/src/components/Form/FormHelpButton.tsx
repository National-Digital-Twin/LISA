import { MouseEvent, useState } from 'react';

import { type Field } from 'common/Field';
import { useOutsideClick } from '../../hooks';
import { bem } from '../../utils';

interface Props {
  field: Field;
}
export default function FormHelpButton({ field }: Props) {
  const [expanded, setExpanded] = useState<boolean>(false);
  const ref = useOutsideClick<HTMLDivElement>(() => setExpanded(false));

  if (field.type === 'Label' || !field.hint) {
    return null;
  }

  const handleClick = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    evt.stopPropagation();
    setExpanded((prev) => !prev);
  };

  const classes = bem('field-help');

  return (
    <div ref={ref} className={classes()}>
      <button type="button" className={classes('btn')} onClick={handleClick}>
        ?
      </button>
      {expanded && (
        <div className={classes('popup')}>
          <div className={classes('title')}>{field.label}</div>
          {/* eslint-disable-next-line react/no-danger */}
          <div className={classes('content')} dangerouslySetInnerHTML={{ __html: field.hint }} />
        </div>
      )}
    </div>
  );
}
