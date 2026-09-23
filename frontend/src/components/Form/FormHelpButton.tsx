// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

import { MouseEvent, useState } from 'react';

import { type Field } from 'common/Field';
import { useOutsideClick } from '../../hooks';
import { bem } from '../../utils';

interface Props {
  field: Field;
}
export default function FormHelpButton({ field }: Readonly<Props>) {
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
          <div className={classes('content')} dangerouslySetInnerHTML={{ __html: field.hint }} />
        </div>
      )}
    </div>
  );
}
