import { Incident } from 'common/Incident';
import { LogEntry } from 'common/LogEntry';
import { Mentionable } from 'common/Mentionable';
import { Stage } from 'konva/lib/Stage';
import { RefObject, useEffect, useState } from 'react';
import { SketchLine, ValidationError } from '../../../utils/types';
import { OnFieldChange } from '../../../utils/handlers';
import { type Location as TypeOfLocation } from 'common/Location';
import { Format, Validate } from '../../../utils';
import { EntityOptionData } from '../../AddEntity/EntityOptions';
import {
  EntityInputContainer,
  EntityInputContainerData
} from '../../AddEntity/EntityInputContainer';
import { Box } from '@mui/material';
import { EntityOptionsContainer } from '../../AddEntity/EntityOptionsContainer';
import EntryContent from '../../lexical/EntryContent';
import { DateAndTimePicker } from '../../DateAndTimePicker';
import Location from '../Location';
import Sketch from '../Sketch';
import Files from '../Files';

type Props = {
  incident: Incident;
  entry: Partial<LogEntry>;
  mentionables: Array<Mentionable>;
  selectedFiles: Array<File>;
  recordings: Array<File>;
  canvasRef: RefObject<Stage | null>;
  sketchLines: Array<SketchLine>;
  onFieldChange: OnFieldChange;
  onFilesSelected: (files: Array<File>) => void;
  onRemoveSelectedFile: (filename: string) => void;
  onRemoveRecording: (recordingName: string) => void;
  onLocationChange: (locationInputType: Partial<TypeOfLocation>) => void;
  setSketchLines: (sketchLines: Array<SketchLine>) => void;
  onMainBackClick: () => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export const UpdateInputContainer = ({
  incident,
  entry,
  mentionables,
  selectedFiles,
  recordings,
  canvasRef,
  sketchLines,
  onFieldChange,
  onFilesSelected,
  onRemoveSelectedFile,
  onRemoveRecording,
  onLocationChange,
  setSketchLines,
  onMainBackClick,
  onSubmit,
  onCancel
}: Props) => {
  const [level, setLevel] = useState<number>(0);
  const [validationErrors, setValidationErrors] = useState<Array<ValidationError>>([]);
  const [customHeading, setCustomHeading] = useState<string>('');
  const [addingDescription, setAddingDescription] = useState<boolean>(false);
  const [addingDateAndTime, setAddingDateAndTime] = useState<boolean>(false);
  const [addingLocation, setAddingLocation] = useState<boolean>(false);
  const [addingAttachments, setAddingAttachments] = useState<boolean>(false);
  const [addingSketch, setAddingSketch] = useState<boolean>(false);

  useEffect(() => {
    setValidationErrors(Validate.entry(entry, [...selectedFiles, ...recordings]));
  }, [setValidationErrors, entry, selectedFiles, recordings]);

  const setLevelAndClearState = (level: number) => {
    setLevel(level);

    if (level === 0) {
      setAddingDescription(false);
      setAddingDateAndTime(false);
      setAddingLocation(false);
      setAddingAttachments(false);
      setAddingSketch(false);
    }
  };

  const onContentChange = (id: string, json: string, text: string) => {
    onFieldChange(id, { json, text });
  };

  const dispatchOnChange = (d: string | undefined, t: string | undefined) => {
    if (d && t) {
      const parseDate = Date.parse(`${d}T${t}`);
      if (!Number.isNaN(parseDate)) {
        onFieldChange('dateTime', new Date(`${d}T${t}`).toISOString());
      }
    }
  };

  const addLocationHeading = 'Add location(s)';
  const viewLocationHeading = 'View location(s)';

  const entityOptionsData: EntityOptionData[] = [
    {
      id: 'description',
      onClick: () => {
        setCustomHeading('Update description');
        setAddingDescription(true);
        setLevel(1);
      },
      value: entry.content?.text ? entry.content.text : undefined,
      supportedOffline: true
    },
    {
      id: 'dateAndTime',
      onClick: () => {
        setCustomHeading('Add date and time');
        setAddingDateAndTime(true);
        setLevel(1);
      },
      value: entry.dateTime
        ? `${Format.date(entry.dateTime)} @ ${Format.time(entry.dateTime)}`
        : undefined,
      supportedOffline: true
    },
    {
      id: 'location',
      onClick: () => {
        setCustomHeading(addLocationHeading);
        setAddingLocation(true);
        setLevel(1);
      },
      label: addLocationHeading,
      value: entry.location ? viewLocationHeading : undefined,
      required: false
    },
    {
      id: 'attachments',
      onClick: () => {
        setCustomHeading('Add attachment(s)');
        setAddingAttachments(true);
        setLevel(1);
      },
      value: selectedFiles.length > 0 ? `${selectedFiles.length} attachments` : undefined,
      supportedOffline: true
    },
    {
      id: 'sketch',
      onClick: () => {
        setCustomHeading('Add sketch');
        setAddingSketch(true);
        setLevel(1);
      },
      value: sketchLines.length > 0 ? 'View sketch' : undefined,
      supportedOffline: true
    }
  ];

  const inputContainerData: EntityInputContainerData[] = [
    {
      heading: 'New update',
      inputControls: (
        <>
          <EntityOptionsContainer
            entityType="updates"
            data={entityOptionsData}
            errors={validationErrors}
          />
        </>
      ),
      showButtons: true
    },
    {
      heading: customHeading,
      inputControls: (
        <Box padding={2}>
          {addingDescription && (
            <EntryContent
              id="content"
              editable
              json={typeof entry.content === 'object' ? entry.content.json : undefined}
              recordingActive={false}
              onRecording={undefined}
              onChange={onContentChange}
              error={false}
              mentionables={mentionables}
            />
          )}
          {addingDateAndTime && (
            <DateAndTimePicker
              dateLabel="Date"
              timeLabel="Time"
              dateLowerBound={incident.startedAt}
              disableFuture
              value={entry.dateTime}
              onChange={dispatchOnChange}
            />
          )}
          {addingLocation && (
            <Location.Content
              required={false}
              location={entry.location}
              onLocationChange={onLocationChange}
              validationErrors={validationErrors}
            />
          )}
          {addingAttachments && (
            <Files.Content
              active={addingAttachments}
              selectedFiles={selectedFiles}
              recordings={recordings}
              onFilesSelected={onFilesSelected}
              removeSelectedFile={onRemoveSelectedFile}
              removeRecording={onRemoveRecording}
            />
          )}
          {addingSketch && (
            <Sketch.Content
              active={addingSketch}
              canvasRef={canvasRef}
              lines={sketchLines}
              onChangeLines={setSketchLines}
            />
          )}
        </Box>
      ),
      containerBackgroundColor: 'background.default'
    }
  ];

  return (
    <EntityInputContainer
      data={inputContainerData}
      onMainBackClick={onMainBackClick}
      onSubmit={onSubmit}
      onCancel={onCancel}
      level={level}
      setLevel={setLevelAndClearState}
      disableSubmit={validationErrors.length > 0}
    />
  );
};
