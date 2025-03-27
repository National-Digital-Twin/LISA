// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { PropsWithChildren, useEffect, useRef } from 'react';

// Local imports
import { bem, Icons } from '../utils';

type Props = PropsWithChildren & {
  modal: boolean;
  onClose: () => void
};

export default function Modal({ modal, onClose, children }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  }, []);

  const classes = bem('modal-dialog');

  if (modal) {
    return (
      <dialog className={classes()} ref={dialogRef}>
        <button type="button" onClick={onClose} className={classes('close')} title="Close and cancel">
          <Icons.Close />
        </button>
        {children}
      </dialog>
    );
  }

  return children;
}
