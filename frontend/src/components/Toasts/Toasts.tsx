import { useToastEntries } from '../../hooks';
import Toast from './Toast';

export default function Toasts() {
  const { toasts, removeToast } = useToastEntries();
  return (
    <div className="toasts-container">
      {toasts.slice(0, 4).map((t) => (
        <Toast key={t.id} toast={t} onRemove={removeToast} />
      ))}
    </div>
  );
}
