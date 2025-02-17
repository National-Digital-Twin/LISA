import { FormEvent, DragEvent, useRef, useLayoutEffect, useState } from 'react';

type SelectorProps = {
  onSelect: (files: File[]) => void;
};

const TYPES_BLACKLIST: string[] = [
  'application/x-msdownload',
  'application/x-apple-diskimage',
];

export default function FilesSelector({ onSelect }: Readonly<SelectorProps>) {
  const [canDrag, setCanDrag] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // We use the same button as the drop target
  const dragContainerRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (!dragContainerRef.current) {
      return;
    }
    const dropSupported = ('draggable' in dragContainerRef.current
        || ('ondragstart' in dragContainerRef.current && 'ondrop' in dragContainerRef.current))
      && 'FormData' in window
      && 'FileReader' in window;
    setCanDrag(dropSupported);
  }, []);

  const onDragOver = (evt: DragEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    evt.stopPropagation();
  };

  const onDragEnter = (evt: DragEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    evt.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (evt: DragEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    evt.stopPropagation();
    setIsDragging(false);
  };

  const handleFiles = (fileList: FileList | null) => {
    const files = Array.from(fileList || []).filter(
      (file) => file.type && !TYPES_BLACKLIST.includes(file.type)
    );
    onSelect(files);
  };

  const onFilesDrop = (evt: DragEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    evt.stopPropagation();
    setIsDragging(false);
    handleFiles(evt.dataTransfer.files);
  };

  const onFileSelect = (evt: FormEvent<HTMLInputElement>) => {
    evt.preventDefault();
    handleFiles(evt.currentTarget.files);
  };

  // onClick triggers the file input
  const onClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <button
        type="button"
        className={`files-selector ${isDragging ? 'files-selector__dragging' : ''}`}
        ref={dragContainerRef}
        aria-label="Choose files or drag them here"
        onClick={onClick}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onFilesDrop}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <label htmlFor="fileUpload">
          <span className={`prompt ${focused ? 'prompt__focused' : ''}`}>Choose files</span>
          {canDrag && ' or drag them here'}
        </label>
      </button>
      {/* Hidden file input */}
      <input
        id="fileUpload"
        type="file"
        multiple
        onChange={onFileSelect}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
    </>
  );
}
