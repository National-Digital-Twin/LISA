// Global imports
import { useMemo } from 'react';

// Local imports
import { bem, Format, Icons } from '../../../utils';
import FilesSelector from '../../FilesSelector';

interface Props {
  active: boolean;
  selectedFiles: File[],
  recordings: File[];
  onFilesSelected: (files: File[]) => void;
  removeSelectedFile: (name: string) => void;
  removeRecording: (name: string) => void;
}

export default function FilesContent({
  active,
  selectedFiles,
  recordings,
  onFilesSelected,
  removeSelectedFile,
  removeRecording
}: Readonly<Props>) {
  const classes = bem('add-entry-tab', [active ? 'active' : ''], 'files');
  const totalLength = useMemo(
    () => recordings.length + selectedFiles.length,
    [selectedFiles, recordings]
  );
  const title = useMemo(() => {
    if (recordings.length > 0) {
      if (totalLength > recordings.length) {
        return `${totalLength} selected files and recordings`;
      }
      return `${recordings.length} recording${recordings.length === 1 ? '' : 's'}`;
    }
    if (totalLength > 0) {
      return `${totalLength} selected file${totalLength === 1 ? '' : 's'}`;
    }
    return 'No selected files or recordings';
  }, [recordings, totalLength]);
  return (
    <ul className={classes()}>
      <li className="full-width field-label">{title}</li>
      {selectedFiles.map((file) => (
        <li key={file.name} className="full-width selected-file">
          <span>
            {file.name}
            <span className="file-size">
              {` (${Format.fileSize(file.size)})`}
            </span>
          </span>
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button
            type="button"
            onClick={() => removeSelectedFile(file.name)}
            className="remove-button"
            title="Remove file"
          >
            <Icons.Close />
          </button>
        </li>
      ))}
      {recordings.map((recording) => (
        <li key={recording.name} className="full-width selected-file">
          <span>
            {recording.name}
            <span className="file-size">
              {` (${Format.fileSize(recording.size)})`}
            </span>
          </span>
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button
            type="button"
            onClick={() => removeRecording(recording.name)}
            className="remove-button"
            title="Remove recording"
          >
            <Icons.Close />
          </button>
        </li>
      ))}
      <li className="full-width">
        <FilesSelector onSelect={onFilesSelected} />
      </li>
    </ul>
  );
}
