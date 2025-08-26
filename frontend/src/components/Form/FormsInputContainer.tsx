// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { RefObject, useEffect, useMemo, useState } from 'react';
import { Stage } from 'konva/lib/Stage';
import dayjs from 'dayjs';
import { Box, FormControl, MenuItem, TextField, Typography } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import {
  DatePicker,
  LocalizationProvider,
  renderTimeViewClock,
  TimePicker
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PickerValue } from '@mui/x-date-pickers/internals';
import { type LogEntry } from 'common/LogEntry';
import { type Incident } from 'common/Incident';
import { LogEntryTypes } from 'common/LogEntryTypes';
import { LogEntryType } from 'common/LogEntryType';
import { Mentionable } from 'common/Mentionable';
import { type Location as TypeOfLocation } from 'common/Location';
import { FieldValueType, OptionType, SketchLine, ValidationError } from '../../utils/types';
import { EntityInputContainer, EntityInputContainerData } from '../AddEntity/EntityInputContainer';
import { getLogEntryTypes } from '../../utils/Form/getBaseLogEntryFields';
import { EntityOptionsContainer } from '../AddEntity/EntityOptionsContainer';
import { EntityOptionData } from '../AddEntity/EntityOptions';
import { OnFieldChange } from '../../utils/handlers';
import EntryContent from '../lexical/EntryContent';

import { Format } from '../../utils';
import Sketch from '../AddEntry/Sketch';
import Files from '../AddEntry/Files';
import { EntityDivider } from '../AddEntity/EntityDivider';
import Location from '../AddEntry/Location';
import { getFieldValue } from '../../utils/Form/getFieldValue';
import { getFieldIcon } from '../../utils/Form/getFieldIcon';
import { Field } from 'common/Field';
import { FormFieldWithDependent } from './FormFieldWithDependent';
import { CommunicationMethod } from 'common/Fields/CommunicationMethod';
import { Form as CustomForm } from '../CustomForms/FormTemplates/types';
import { FormContainer as CustomFormContainer } from '../CustomForms/FormInstances/FormContainer';
import { RelevantHazards } from 'common/LogEntryTypes/RiskAssessment/hazards/RelevantHazards';
import { getRelevantHazard } from 'common/LogEntryTypes/RiskAssessment/hazards';
import FormField from './FormField';

type Props = {
  incident: Incident;
  entries: Array<LogEntry>;
  entry: Partial<LogEntry>;
  formFields: Array<Field>;
  forms: Array<CustomForm>;
  mentionables: Array<Mentionable>;
  selectedFiles: Array<File>;
  recordings: Array<File>;
  canvasRef: RefObject<Stage | null>;
  sketchLines: Array<SketchLine>;
  errors: ValidationError[];
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

export const FormsInputContainer = ({
  incident,
  entries,
  entry,
  formFields,
  forms,
  mentionables,
  selectedFiles,
  recordings,
  canvasRef,
  sketchLines,
  errors,
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
  const formTypes: OptionType[] = useMemo(() => getLogEntryTypes(incident), [incident]);
  const [level, setLevel] = useState<number>(0);
  const [customHeading, setCustomHeading] = useState<string>('');
  const [addingDescription, setAddingDescription] = useState<boolean>(false);
  const [addingSiteRepDetails, setAddingSiteRepDetails] = useState<boolean>(false);
  const [addingHazard, setAddingHazard] = useState<boolean>(false);
  const [selectedHazardIndex, setSelectedHazardIndex] = useState<number>(0);
  const [hazardValue, setHazardValue] = useState<string>();
  const [hazardsOptionData, setHazardsOptionData] = useState<EntityOptionData[]>([]);
  const [refreshRemoveHazardsCall, setRefreshRemoveHazardsCall] = useState<boolean>(false);
  const [addingComments, setAddingComments] = useState<boolean>(false);
  const [addingFormFields, setAddingFormFields] = useState<boolean>(false);
  const [addingDateAndTime, setAddingDateAndTime] = useState<boolean>(false);
  const [addingLocation, setAddingLocation] = useState<boolean>(false);
  const [addingAttachments, setAddingAttachments] = useState<boolean>(false);
  const [addingSketch, setAddingSketch] = useState<boolean>(false);
  const [entryDate, setEntryDate] = useState<string>();
  const [entryTime, setEntryTime] = useState<string>();
  const [formField, setFormField] = useState<Field>();

  const setLevelAndClearState = (level: number) => {
    setLevel(level);
    setAddingDescription(false);
    setAddingSiteRepDetails(false);
    setAddingHazard(false);
    setAddingComments(false);
    setAddingDateAndTime(false);
    setAddingLocation(false);
    setAddingAttachments(false);
    setAddingSketch(false);
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

  const onDateChange = (value: PickerValue) => {
    const isoDate = value ? Format.isoDate(value?.toISOString()) : undefined;
    setEntryDate(isoDate ?? '');
    dispatchOnChange(isoDate, entryTime);
  };
  const onTimeChange = (value: PickerValue) => {
    const timeString = value ? Format.time(value.toISOString()) : undefined;
    setEntryTime(timeString ?? '');
    dispatchOnChange(entryDate, timeString);
  };

  const onNestedFieldChange = (id: string, value: FieldValueType) => {
    onFieldChange(id, value, true);
  };

  const onHazardOptionClick = (
    index: number,
    label: string,
    value: string | undefined,
    selectedRelevantHazards: string[]
  ) => {
    const relevantHazardField = getRelevantHazard();
    const options = relevantHazardField.options?.filter(
      (option) => option.value === value || !selectedRelevantHazards.includes(option.value)
    );

    setCustomHeading(label);
    setFormField({
      ...relevantHazardField,
      value: value,
      options
    });
    setAddingHazard(true);
    setHazardValue(value ?? '');
    setSelectedHazardIndex(index);
    setLevel(2);
  };

  const hazardOptionData = (
    index: number,
    required: boolean,
    label: string,
    selectedRelevantHazards: string[]
  ): EntityOptionData => {
    const relevantHazardsField = formFields.find(
      (formField) => formField.id === RelevantHazards.id
    );

    if (relevantHazardsField) {
      const relevantHazardsValue = getFieldValue(relevantHazardsField, entry);

      if (relevantHazardsValue && index < relevantHazardsValue.length - 1) {
        return {
          id: `selectHazard-${index}`,
          onClick: () => onHazardOptionClick(index, label, undefined, selectedRelevantHazards),
          label: label,
          value: relevantHazardsValue[index],
          required,
          supportedOffline: true
        };
      }

      return {
        id: `selectHazard-${index}`,
        onClick: () => onHazardOptionClick(index, label, undefined, selectedRelevantHazards),
        label: label,
        value: undefined,
        required,
        supportedOffline: true
      };
    }

    return {
      id: `selectHazard-${index}`,
      onClick: () => onHazardOptionClick(index, label, undefined, selectedRelevantHazards),
      label: label,
      value: undefined,
      required,
      supportedOffline: true
    };
  };

  const updateHazardOptionData = (
    option: EntityOptionData,
    index: number,
    value: string | undefined,
    relevantHazards: string[] | undefined,
    removable: boolean
  ): EntityOptionData => ({
    ...option,
    id: `selectHazard-${index}`,
    value: value ? value : option.value,
    onClick: () =>
      onHazardOptionClick(
        index,
        option.label!,
        value ? value : option.value,
        relevantHazards ?? []
      ),
    removable
  });

  const reconcileReleventHazards = (
    relevantHazardsFieldValue: string | string[] | undefined,
    value: string
  ) => {
    let relevantHazards = [value];

    if (relevantHazardsFieldValue) {
      if (selectedHazardIndex >= 0 && selectedHazardIndex < relevantHazardsFieldValue.length) {
        relevantHazards = [
          ...(selectedHazardIndex > 0
            ? relevantHazardsFieldValue.slice(0, selectedHazardIndex)
            : relevantHazards),
          ...(selectedHazardIndex > 0 ? relevantHazards : []),
          ...(selectedHazardIndex > 0
            ? relevantHazardsFieldValue.slice(selectedHazardIndex + 1)
            : [])
        ];
      } else {
        relevantHazards = [...relevantHazardsFieldValue, ...relevantHazards];
      }
    }

    return relevantHazards;
  };

  const onFormTypeChange = (formType: string) => {
    onFieldChange('type', formType);

    if (formType === 'RiskAssessment') {
      setHazardsOptionData([hazardOptionData(0, true, 'Select hazard', [])]);
    }

    setLevel(1);
  };

  const onRemoveHazard = (index: number, relevantHazards: string[]) => {
    const value = index > 0 ? relevantHazards.at(index) : undefined;

    if (value) {
      const updatedRelevantHazards =
        index === relevantHazards.length - 1
          ? [...relevantHazards.slice(0, index), ...relevantHazards.slice(index + 1)]
          : undefined;

      if (updatedRelevantHazards) {
        onNestedFieldChange(RelevantHazards.id, updatedRelevantHazards);

        let updatedAdditionalHazardsOptionData: EntityOptionData[] = [];

        if (index === hazardsOptionData.length - 2) {
          updatedAdditionalHazardsOptionData = [
            ...hazardsOptionData.slice(0, index).map((data, innerIndex) => {
              if (innerIndex === index - 1) {
                return updateHazardOptionData(
                  data,
                  innerIndex,
                  undefined,
                  updatedRelevantHazards,
                  innerIndex > 0
                );
              }
              return updateHazardOptionData(
                data,
                innerIndex,
                undefined,
                updatedRelevantHazards,
                false
              );
            }),
            hazardOptionData(index, false, 'Add hazard', updatedRelevantHazards)
          ];
        }

        setHazardsOptionData(updatedAdditionalHazardsOptionData);
        setRefreshRemoveHazardsCall(true);
      }
    }
  };

  useEffect(() => {
    if (formFields) {
      const relevantHazardsField = formFields.find(
        (formField) => formField.id === RelevantHazards.id
      );

      if (relevantHazardsField) {
        const relevantHazardsFieldValue = getFieldValue(relevantHazardsField, entry);

        if (relevantHazardsFieldValue) {
          if (hazardsOptionData.some((option) => option.removable)) {
            const underlyingValue = relevantHazardsFieldValue.valueOf();

            if (Array.isArray(underlyingValue)) {
              const updateAdditionalHazardsOptionData = hazardsOptionData.map((option, index) => {
                if (option.removable) {
                  return {
                    ...option,
                    onRemove: () => onRemoveHazard(index, underlyingValue)
                  };
                }
                return option;
              });
              setHazardsOptionData(updateAdditionalHazardsOptionData);
            }
          }
        }
      }
    }

    return setRefreshRemoveHazardsCall(false);
  }, [refreshRemoveHazardsCall]);

  const updateAdditionalOptionData = (value: string, selectedRelevantHazards: string[]) => {
    let updatedAdditionalHazardsOptionData = hazardsOptionData;

    if (updatedAdditionalHazardsOptionData.length < selectedHazardIndex + 2) {
      updatedAdditionalHazardsOptionData.push(
        hazardOptionData(selectedHazardIndex + 1, false, 'Add hazard', selectedRelevantHazards)
      );
    }

    updatedAdditionalHazardsOptionData = updatedAdditionalHazardsOptionData.map((data, index) => {
      const removable = index > 0 && index === hazardsOptionData.length - 2;

      if (index === selectedHazardIndex) {
        return updateHazardOptionData(data, index, value, selectedRelevantHazards, removable);
      }

      return updateHazardOptionData(data, index, undefined, selectedRelevantHazards, removable);
    });

    setHazardsOptionData(updatedAdditionalHazardsOptionData);
  };

  const handleRelevantHazardsChange = (id: string, value: FieldValueType) => {
    if (id === 'RelevantHazard') {
      const relevantHazardsField = formFields.find(
        (formField) => formField.id === RelevantHazards.id
      );

      if (relevantHazardsField) {
        const relevantHazardsFieldValue = getFieldValue(relevantHazardsField, entry);

        if (value) {
          const underlyingValue = value.valueOf();

          if (typeof underlyingValue === 'string') {
            const relevantHazards = reconcileReleventHazards(
              relevantHazardsFieldValue,
              underlyingValue
            );

            setHazardValue(underlyingValue);
            onNestedFieldChange(RelevantHazards.id, relevantHazards);

            updateAdditionalOptionData(underlyingValue, relevantHazards);
            setRefreshRemoveHazardsCall(true);
          }
        }
      }
    }
  };

  const getDateValue = () => {
    if (entry.dateTime) {
      return dayjs(new Date(Format.isoDate(entry.dateTime)));
    }
    if (entryDate) {
      return dayjs(new Date(entryDate));
    }

    return null;
  };

  const getTimeValue = () => {
    if (entry.dateTime) {
      return dayjs(new Date(entry.dateTime));
    }
    if (entryTime) {
      const now = new Date();
      return dayjs(new Date(`${Format.isoDate(now.toISOString())}T${entryTime}`));
    }

    return null;
  };

  const getFormattedValueForField = (field: Field, value: FieldValueType) => {
    if (field.id === 'CommunicationMethod') {
      return CommunicationMethod?.options?.find((option) => option.value === value)?.label ?? value;
    }

    return value;
  };

  const filteredFormFieldsForView = ['SituationReport', 'RiskAssessment'].includes(entry.type ?? '')
    ? []
    : formFields;
  const dependentFieldIds = filteredFormFieldsForView.map(
    (formField) => formField.dependentFieldId
  );
  const parentFormFields = filteredFormFieldsForView.filter(
    (formField) => !dependentFieldIds.includes(formField.id)
  );

  const descriptionOptionData: EntityOptionData[] = [
    {
      id: 'description',
      onClick: () => {
        setCustomHeading('Add a description');
        setAddingDescription(true);
        setLevel(2);
      },
      value: entry.content?.text ? entry.content.text : undefined,
      supportedOffline: true
    }
  ];

  const siteRepDetailOptionData: EntityOptionData[] = [
    {
      id: 'siteRepDetails',
      onClick: () => {
        setCustomHeading('Details');
        setAddingSiteRepDetails(true);
        setLevel(2);
      },
      label: formFields
        .filter((formField) => formField.id !== 'ExactLocation')
        .every((formField) => getFieldValue(formField, entry))
        ? 'View details'
        : undefined,
      value: 'Details',
      required: true,
      supportedOffline: true
    }
  ];

  const riskReviewOptionData: EntityOptionData[] = [
    ...hazardsOptionData,
    {
      id: 'addComments',
      onClick: () => {
        setCustomHeading('Add comment');
        setAddingComments(true);
        setLevel(2);
      },
      label: 'Add comments',
      value: entry.content?.text ? entry.content.text : undefined,
      supportedOffline: true
    }
  ];

  const formTypeLabel = LogEntryTypes[entry.type as LogEntryType].label;

  const addLocationHeading =
    entry.type === 'SituationReport' ? 'Add exact location' : 'Add location(s)';

  const viewLocationHeading =
    entry.type === 'SituationReport' ? 'View exact location' : 'View location(s)';

  const entityOptionsData: EntityOptionData[] = [
    ...(['SituationReport', 'RiskAssessment', 'RiskAssessmentReview'].includes(entry.type ?? '')
      ? []
      : descriptionOptionData),
    ...(entry.type === 'SituationReport' ? siteRepDetailOptionData : []),
    ...(entry.type === 'RiskAssessment' ? riskReviewOptionData : []),
    ...parentFormFields.map(
      (field) =>
        ({
          id: `field-${field.id}`,
          dependentId: field.dependentFieldId,
          onClick: () => {
            setCustomHeading('Add field');
            setAddingFormFields(true);
            setFormField(field);
            setLevel(2);
          },
          value: getFormattedValueForField(
            field,
            getFieldValue(
              formFields.find((formField) => field.dependentFieldId === formField.id) ?? field,
              entry
            )
          ),
          label: field.label,
          icon: getFieldIcon(field)?.icon,
          supportedOffline: true
        }) as EntityOptionData
    ),
    {
      id: 'dateAndTime',
      onClick: () => {
        setCustomHeading('Add date and time');
        setAddingDateAndTime(true);
        setLevel(2);
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
        setLevel(2);
      },
      label: addLocationHeading,
      value: entry.location ? viewLocationHeading : undefined,
      required: LogEntryTypes[entry.type as LogEntryType].requireLocation
    },
    {
      id: 'attachments',
      onClick: () => {
        setAddingAttachments(true);
        setLevel(2);
      },
      value: selectedFiles.length > 0 ? `${selectedFiles.length} attachments` : undefined,
      supportedOffline: true
    },
    {
      id: 'sketch',
      onClick: () => {
        setAddingSketch(true);
        setLevel(2);
      },
      value: sketchLines.length > 0 ? 'View sketch' : undefined,
      supportedOffline: true
    }
  ];
  const inputContainerData: EntityInputContainerData[] = [
    {
      heading: 'Select form',
      inputControls: (
        <>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <TextField
              select
              value={entry.type}
              variant="filled"
              label={entry.type ? '' : 'Select'}
              onChange={(event) => onFormTypeChange(event.target.value)}
              slotProps={{ inputLabel: { shrink: false } }}
            >
              {formTypes.map((formType) => (
                <MenuItem key={`key-${formType.value}`} value={formType.value}>
                  {formType.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <EntityDivider />
        </>
      )
    },
    {
      heading: `Add form - ${formTypeLabel}`,
      inputControls: (
        <>
          <Box display="flex">
            <CircleIcon sx={{ opacity: 0 }} />
            <Typography variant="body1" padding={1}>
              {formTypeLabel}
            </Typography>
          </Box>
          <EntityDivider />
          <EntityOptionsContainer entityType="forms" data={entityOptionsData} errors={errors} />
        </>
      )
    },
    {
      heading: customHeading,
      inputControls: (
        <>
          {(addingDescription || addingComments) && (
            <Box flexGrow={1}>
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
            </Box>
          )}
          {addingSiteRepDetails && forms && (
            <Box flexGrow={1}>
              <CustomFormContainer
                entry={entry}
                selectedForm={forms.find((form) => form.id === 'siteRepMethane')!}
                fields={formFields}
                onFieldChange={onNestedFieldChange}
              />
            </Box>
          )}
          {addingFormFields && formFields && formField && (
            <Box flexGrow={1}>
              <FormFieldWithDependent
                mainFormField={{ field: formField }}
                dependentFormField={{
                  field: formFields.find((x) => x.id === formField.dependentFieldId)
                }}
                entry={entry}
                entries={entries}
                onChange={onNestedFieldChange}
                errors={errors}
              />
            </Box>
          )}
          {addingHazard && formField && (
            <Box display="flex" flexDirection="column" flexGrow={1} gap={2}>
              <FormField
                field={formField}
                entry={entry}
                entries={entries}
                onChange={handleRelevantHazardsChange}
                error={errors.find((error) => error.fieldId === formField.id)}
              />
              {hazardValue && forms && (
                <CustomFormContainer
                  entry={entry}
                  selectedForm={
                    forms.find((form) => form.id === `haz_${hazardValue.toLowerCase()}`)!
                  }
                  fields={formFields}
                  onFieldChange={onNestedFieldChange}
                />
              )}
            </Box>
          )}
          {addingDateAndTime && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box display="flex" flexDirection="column" flexGrow={1} gap={4} marginTop={2}>
                <FormControl variant="standard">
                  <DatePicker
                    label="Date"
                    slotProps={{ textField: { variant: 'filled', hiddenLabel: true } }}
                    disableFuture
                    value={getDateValue()}
                    onChange={onDateChange}
                  />
                </FormControl>
                <FormControl>
                  <TimePicker
                    label="Time"
                    slotProps={{ textField: { variant: 'filled', hiddenLabel: true } }}
                    viewRenderers={{ hours: renderTimeViewClock, minutes: renderTimeViewClock }}
                    value={getTimeValue()}
                    onChange={onTimeChange}
                  />
                </FormControl>
              </Box>
            </LocalizationProvider>
          )}
          {addingLocation && (
            <Box flexGrow={1}>
              <Location.Content
                location={entry.location}
                onLocationChange={onLocationChange}
                validationErrors={errors}
                showValidationErrors={errors.length > 0}
                active={addingLocation}
              />
            </Box>
          )}
          {addingAttachments && (
            <Box>
              <Files.Content
                active={addingAttachments}
                selectedFiles={selectedFiles}
                recordings={recordings}
                onFilesSelected={onFilesSelected}
                removeSelectedFile={onRemoveSelectedFile}
                removeRecording={onRemoveRecording}
              />
            </Box>
          )}
          {addingSketch && (
            <Box>
              <Sketch.Content
                active={addingSketch}
                canvasRef={canvasRef}
                lines={sketchLines}
                onChangeLines={setSketchLines}
              />
            </Box>
          )}
        </>
      ),
      hideButtons: true
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
      disableSubmit={errors.length > 0}
    />
  );
};
