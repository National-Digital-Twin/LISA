import { useEffect, useRef } from 'react';
import { Icons, bem } from '../../utils';
import { ToastEntry } from '../../utils/types';

interface Props {
  toast: ToastEntry;
  onRemove: (id: string) => void;
}
export default function Toast({ toast, onRemove }: Readonly<Props>) {
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    timer.current = setTimeout(() => {
      onRemove(toast.id);
    }, toast.isDismissable ? 10000 : 3000);
    return () => {
      clearTimeout(timer.current);
    };
  }, [toast, onRemove]);

  const onMouseEnter = () => {
    if (!toast.isDismissable) {
      return;
    }
    clearTimeout(timer.current);
    timer.current = undefined;
  };

  const onMouseLeave = () => {
    if (!toast.isDismissable) {
      return;
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      onRemove(toast.id);
    }, 3000);
  };

  const onClose = () => {
    clearTimeout(timer.current);
    onRemove(toast.id);
  };

  const { content, type, isDismissable } = toast;
  const classes = bem('toast', type.toLowerCase());

  return (
    <div
      className={classes()}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="alertdialog"
    >
      <button className={classes('content')} onClick={onClose} type="button">
        {content}
      </button>
      {isDismissable && (
        <div className={classes('close')}>
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button type="button" onClick={onClose}>
            <Icons.Close />
          </button>
        </div>
      )}
    </div>
  );
}
