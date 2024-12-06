import { FormEvent, DragEvent, useRef, useLayoutEffect, useState } from 'react';

type SelectorProps = {
  onSelect: (files: File[]) => void;
}

const TYPES_BLACKLIST: string[] = [
  'application/x-msdownload',
  'application/x-apple-diskimage'
];

export default function FilesSelector({ onSelect }: SelectorProps) {
  const [canDrag, setCanDrag] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const dragContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!dragContainerRef?.current) {
      return;
    }
    const dropDragSupported = (('draggable' in dragContainerRef.current) || ('ondragstart' in dragContainerRef.current && 'ondrop' in dragContainerRef.current))
      && 'FormData' in window && 'FileReader' in window;
    setCanDrag(dropDragSupported);
  }, []);

  const onDragOver = (evt: DragEvent<HTMLDivElement>) => {
    // ensures we get the ondrop firing by stopping the browser default behaviour
    evt.preventDefault();
    evt.stopPropagation();
  };

  const onDragEnter = (evt: DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    evt.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (evt: DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    evt.stopPropagation();
    setIsDragging(false);
  };

  const handleFiles = (fileList: FileList | null) => {
    const files = Array.from(fileList || [])
      .filter((file) => file.type && !TYPES_BLACKLIST.includes(file.type));
    onSelect(files);
  };

  const onFileSelect = (evt: FormEvent<HTMLInputElement>) => {
    evt.preventDefault();
    handleFiles(evt.currentTarget.files);
  };

  const onFilesDrop = (evt: DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    evt.stopPropagation();
    setIsDragging(false);
    handleFiles(evt.dataTransfer.files);
  };

  return (
    <div
      className={`files-selector ${isDragging ? 'files-selector__dragging' : ''}`}
      ref={dragContainerRef}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onFilesDrop}
    >
      <label htmlFor="fileUpload">
        <span className={`prompt ${focused ? 'prompt__focused' : ''}`}>Choose files</span>
        {canDrag && ' or drag them here'}
      </label>
      <input
        id="fileUpload"
        type="file"
        multiple
        onChange={onFileSelect}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        value=""
      />
    </div>
  );
}
