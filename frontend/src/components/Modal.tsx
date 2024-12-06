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
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button type="button" onClick={onClose} className={classes('close')} title="Close and cancel">
          <Icons.Close />
        </button>
        {children}
      </dialog>
    );
  }

  return children;
}
