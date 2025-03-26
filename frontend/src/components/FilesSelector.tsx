import { Box, InputLabel, Typography } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { FormEvent, DragEvent, useRef, useLayoutEffect, useState } from 'react';

type SelectorProps = {
  onSelect: (files: File[]) => void;
};

const TYPES_BLACKLIST: string[] = ['application/x-msdownload', 'application/x-apple-diskimage'];

export default function FilesSelector({ onSelect }: Readonly<SelectorProps>) {
  const [canDrag, setCanDrag] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // We use the same button as the drop target
  const dragContainerRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (!dragContainerRef.current) {
      return;
    }
    const dropSupported =
      ('draggable' in dragContainerRef.current ||
        ('ondragstart' in dragContainerRef.current && 'ondrop' in dragContainerRef.current)) &&
      'FormData' in window &&
      'FileReader' in window;
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
    <Box
      component="button"
      type="button"
      draggable
      className={`files-selector ${isDragging ? 'files-selector__dragging' : ''}`}
      ref={dragContainerRef}
      aria-label="Choose files or drag them here"
      onClick={onClick}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onFilesDrop}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        cursor: 'pointer',
        border: '1px dashed stage.closed.primary'
      }}
      padding={3}
    >
      <UploadFileIcon color="primary" />
      <InputLabel sx={{ textTransform: 'none', color: 'text.primary' }}>
        <Typography variant="body1" component="u" color="primary">
          Choose Files
        </Typography>{' '}
        {canDrag && 'or drag them here'}
      </InputLabel>
      <Typography
        component="span"
        variant="body1"
        color="textDisabled"
        sx={{ textTransform: 'none' }}
      >
        SVG, PNG, JPG or GIF (max. 3MB)
      </Typography>
      <input
        id="fileUpload"
        onChange={onFileSelect}
        type="file"
        multiple
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
    </Box>
  );
}

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
