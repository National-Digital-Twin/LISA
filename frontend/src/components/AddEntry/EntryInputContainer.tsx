import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Stage } from 'konva/lib/Stage';
import { Incident } from 'common/Incident';
import { LogEntry } from 'common/LogEntry';
import { Mentionable } from 'common/Mentionable';
import { type Location as TypeOfLocation } from 'common/Location';
import { FieldValueType, OptionType, SketchLine, ValidationError } from '../../utils/types';
import { OnFieldChange } from '../../utils/handlers';
import { Document, Format, Validate } from '../../utils';
import { EntityOptionData } from '../AddEntity/EntityOptions';
import { EntityInputContainer, EntityInputContainerData } from '../AddEntity/EntityInputContainer';
import { EntityOptionsContainer } from '../AddEntity/EntityOptionsContainer';
import { useTemporaryState } from '../../hooks/useTemporaryState';
import EntryContent from '../lexical/EntryContent';
import { DateAndTimePicker } from '../DateAndTimePicker';
import Location from './Location';
import Files from './Files';
import Sketch from './Sketch';
import Recordings from '../Recordings';
import { Box, Button, FormControl, Typography } from '@mui/material';
import { Form as CustomForm, FormDataProperty } from '../CustomForms/FormTemplates/types';
import { Field } from 'common/Field';
import { getFormTypes } from '../../utils/Form/getBaseLogEntryFields';
import { getHazardLabel, getRelevantHazard } from 'common/LogEntryTypes/RiskAssessment/hazards';
import { RelevantHazards } from 'common/LogEntryTypes/RiskAssessment/hazards/RelevantHazards';
import { getFieldValue } from '../../utils/Form/getFieldValue';
import { CommunicationMethod } from 'common/Fields/CommunicationMethod';
import { LogEntryTypes } from 'common/LogEntryTypes';
import { LogEntryType } from 'common/LogEntryType';
import { getFieldIcon } from '../../utils/Form/getFieldIcon';
import { EntityTypeDropdown } from '../AddEntity/EntityTypeDropdown';
import { EntityDivider } from '../AddEntity/EntityDivider';
import AddFormInstance from '../CustomForms/FormInstances/AddFormInstance';
import { GenericFormField } from '../Form/GenericFormField';
import { FormContainer as PredefinedFormContainer } from '../CustomForms/FormInstances/FormContainer';
import CircleIcon from '@mui/icons-material/Circle';

type Props = {
  inputType: 'form' | 'update';
  incident: Incident;
  entry: Partial<LogEntry>;
  entries: Array<LogEntry>;
  mentionables: Array<Mentionable>;
  selectedFiles: Array<File>;
  recordings: Array<File>;
  customForm: CustomForm | null;
  customFormData: Array<FormDataProperty>;
  setCustomForm: (customForm: CustomForm | null) => void;
  formFields: Array<Field>;
  forms: Array<CustomForm>;
  onFieldChange: OnFieldChange;
  onFilesSelected: (files: Array<File>) => void;
  onRemoveSelectedFile: (filename: string) => void;
  onRecordingsChanged: (recordings: File[]) => void;
  onLocationChange: (locationInputType: Partial<TypeOfLocation>) => void;
  setSketchFile: (sketch: File | null) => void;
  onCustomFormDataChange: (id: string, label: string, value: string) => void;
  resetEntry: () => void;
  resetCustomForm: () => void;
  resetCustomFormData: () => void;
  onMainBackClick: () => void;
  onSubmit: (submissionType: 'customForm' | 'entry' | null) => void;
  onCancel: () => void;
  disableSubmit: boolean;
};

type FieldType =
  | 'description'
  | 'dateAndTime'
  | 'location'
  | 'attachments'
  | 'recordings'
  | 'sketch'
  | 'customForm'
  | 'siteRepDetails'
  | 'avianFluDetails'
  | 'hazard'
  | 'comments'
  | 'riskAssessmentToReview'
  | 'formFields';

export const EntryInputContainer = ({
  inputType,
  incident,
  entry,
  entries,
  mentionables,
  selectedFiles,
  recordings,
  customForm,
  customFormData,
  setCustomForm,
  formFields,
  forms,
  onFieldChange,
  onCustomFormDataChange,
  resetEntry,
  resetCustomForm,
  resetCustomFormData,
  onFilesSelected,
  onRemoveSelectedFile,
  onRecordingsChanged,
  onLocationChange,
  setSketchFile,
  onMainBackClick,
  onSubmit,
  onCancel,
  disableSubmit,
}: Props) => {
  const [level, setLevel] = useState<number>(0);
  const [submissionType, setSubmissionType] = useState<'customForm' | 'entry' | null>(
    inputType === 'update' ? 'entry' : null
  );
  const [validationErrors, setValidationErrors] = useState<Array<ValidationError>>([]);
  const [customHeading, setCustomHeading] = useState<string>('');
  const [activeField, setActiveField] = useState<FieldType | null>(null);
  const [selectingCustomForm, setSelectingCustomForm] = useState<boolean>(false);
  const [selectedHazardIndex, setSelectedHazardIndex] = useState<number>(0);
  const [selectedHazardType, setSelectedHazardType] = useState<string>();
  const [activeFormField, setActiveFormField] = useState<Field>();
  const [hazardChanges, setHazardChanges] = useState<Record<string, FieldValueType>>({});

  const canvasRef = useRef<Stage>(null);
  const [sketchLines, setSketchLines] = useState<SketchLine[]>([]);

  type EditableState = {
    entry: Partial<LogEntry>;
    selectedFiles: Array<File>;
    recordings: Array<File>;
    sketchLines: Array<SketchLine>;
    customFormData: Array<FormDataProperty>;
    activeFormField?: Field;
    selectedHazardType?: string;
    selectedHazardIndex: number;
  };

  const tempState = useTemporaryState<EditableState>();

  const saveCurrentState = () => {
    tempState.save({
      entry,
      selectedFiles,
      recordings,
      sketchLines,
      customFormData,
      activeFormField,
      selectedHazardType,
      selectedHazardIndex
    });
    setHazardChanges({});
  };

  const getEntryWithHazardChanges = (): Partial<LogEntry> => {
    return { ...entry, ...hazardChanges };
  };

  const applyHazardChangesToParent = () => {
    Object.entries(hazardChanges).forEach(([key, value]) => {
      onFieldChange(key, value, true);
    });
    setHazardChanges({});
  };

  const onHazardFieldChange = (id: string, value: FieldValueType) => {
    setHazardChanges((prev) => ({ ...prev, [id]: value }));
  };

  const customForms: CustomForm[] = useMemo(
    () =>
      (inputType === 'form' &&
        forms.filter(
          (form) => !['siteRepMethane', 'avianFlu'].includes(form.id) && !form.id.includes('haz_')
        )) ||
      [],
    [inputType, forms]
  );
  const formTypes: OptionType[] = useMemo(
    () =>
      (inputType === 'form' && [
        { label: 'Select form', value: 'SelectForm', disabled: true },
        ...getFormTypes(incident, customForms.length > 0)
      ]) ||
      [],
    [inputType, incident, customForms]
  );
  const customFormTypes: OptionType[] = useMemo(
    () =>
      (inputType === 'form' && [
        { label: 'Select custom form', value: 'SelectCustomForm', disabled: true },
        ...customForms.map((customForm) => ({ label: customForm.title, value: customForm.id }))
      ]) ||
      [],
    [inputType, customForms]
  );

  useEffect(() => {
    if (submissionType === 'entry') {
      setValidationErrors(
        Validate.entry(entry, [...selectedFiles, ...recordings], incident.startedAt)
      );
    }
  }, [submissionType, setValidationErrors, entry, selectedFiles, recordings, incident]);

  const captureSketch = (confirm: boolean) => {
    if (confirm && activeField === 'sketch' && sketchLines.length > 0 && canvasRef.current) {
      const dataURL = canvasRef.current.toDataURL();
      if (dataURL) {
        const file = Document.dataURLtoFile(dataURL, `Sketch ${Format.timestamp()}.png`);
        setSketchFile(file);
      }
    }
  };

  const restoreState = (level: number, confirm: boolean) => {
    const shouldRestore =
      (inputType === 'form' && level === 1 && !confirm) ||
      (inputType === 'update' && level === 0 && !confirm);

    if (shouldRestore) {
      const saved = tempState.getSaved();
      if (saved) {
        Object.entries(saved.entry).forEach(([key, value]) => {
          onFieldChange(key, value as FieldValueType);
        });
        setActiveFormField(saved.activeFormField);
        setSelectedHazardType(saved.selectedHazardType);
        setSelectedHazardIndex(saved.selectedHazardIndex);

        selectedFiles.forEach((file) => {
          onRemoveSelectedFile(file.name);
        });
        onFilesSelected(saved.selectedFiles);
        onRecordingsChanged(saved.recordings || []);

        setSketchLines(saved.sketchLines);
        resetCustomFormData();
        saved.customFormData.forEach((prop) => {
          onCustomFormDataChange(prop.id, prop.label, String(prop.value));
        });
      }
      setHazardChanges({});
      tempState.clear();
    }
  };

  const setLevelAndClearState = (level: number, confirm = false) => {
    // Capture sketch before canvas is unmounted
    captureSketch(confirm);
    restoreState(level, confirm);
    setLevel(level);

    if (inputType === 'form') {
      if (level === 0) {
        setSelectingCustomForm(false);
        resetCustomFormData();
        resetCustomForm();
        resetEntry();
      } else if (level === 1) {
        if (selectingCustomForm) {
          resetCustomForm();
          resetCustomFormData();
        }

        setActiveField(null);
      }
    } else if (inputType === 'update') {
      if (level === 0) {
        setActiveField(null);
      }
    }
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
    saveCurrentState();
    const relevantHazardField = getRelevantHazard();
    const options = relevantHazardField.options?.filter(
      (option) => option.value === value || !selectedRelevantHazards.includes(option.value)
    );

    setCustomHeading(label);
    setActiveFormField({
      ...relevantHazardField,
      value: value,
      options
    });
    setActiveField('hazard');
    setSelectedHazardType(value ?? '');
    setSelectedHazardIndex(index);
    setLevel(2);
  };

  const onRemoveHazard = (index: number) => {
    const entry = getEntryWithHazardChanges();
    const relevantHazardsField = formFields.find((f) => f.id === RelevantHazards.id);
    const selectedHazards = relevantHazardsField
      ? (getFieldValue(relevantHazardsField, entry) as string[] | undefined) || []
      : [];

    const updatedHazards = selectedHazards.filter((_, i) => i !== index);
    onNestedFieldChange(RelevantHazards.id, updatedHazards);
  };

  const getHazardOptions = (): EntityOptionData[] => {
    const entry = getEntryWithHazardChanges();
    const relevantHazardsField = formFields.find((f) => f.id === RelevantHazards.id);
    const selectedHazards = relevantHazardsField
      ? (getFieldValue(relevantHazardsField, entry) as string[] | undefined) || []
      : [];

    const options: EntityOptionData[] = [];

    selectedHazards.forEach((hazard, index) => {
      options.push({
        id: `selectHazard-${index}`,
        onClick: () => onHazardOptionClick(index, 'Select hazard', hazard, selectedHazards),
        label: 'Select hazard',
        value: hazard,
        valueLabel: getHazardLabel(hazard),
        required: index === 0,
        supportedOffline: true,
        removable: selectedHazards.length > 1,
        onRemove: () => onRemoveHazard(index)
      });
    });

    options.push({
      id: `selectHazard-${selectedHazards.length}`,
      onClick: () =>
        onHazardOptionClick(
          selectedHazards.length,
          selectedHazards.length === 0 ? 'Select hazard' : 'Add hazard',
          undefined,
          selectedHazards
        ),
      label: selectedHazards.length === 0 ? 'Select hazard' : 'Add hazard',
      value: undefined,
      required: selectedHazards.length === 0,
      supportedOffline: true
    });

    return options;
  };

  const getRiskReviewOptions = (): EntityOptionData[] => [
    ...getHazardOptions(),
    {
      id: 'addComments',
      onClick: () => {
        saveCurrentState();
        setCustomHeading('Add comments');
        setActiveFormField(formFields.find((field) => field.id === 'Comments'));
        setActiveField('comments');
        setLevel(2);
      },
      label: 'Add comments',
      value:
        ((entry.type === 'RiskAssessment' || entry.type === 'RiskAssessmentReview') &&
          formFields
            .filter((activeFormField) => activeFormField.id === 'Comments')
            .map((activeFormField) => getFieldValue(activeFormField, entry)?.toString())?.[0]) ||
        undefined,
      supportedOffline: true
    }
  ];

  const onFormTypeChange = (formType: string) => {
    if (formType === 'CustomForm') {
      setSelectingCustomForm(true);
      setSubmissionType('customForm');
    } else {
      onFieldChange('type', formType);
      setSubmissionType('entry');
    }

    setLevel(1);
  };

  const onCustomFormSelectionChange = (customFormSelection: string) => {
    const selectedCustomForm = customForms.find(
      (customForm) => customForm.id === customFormSelection
    );

    if (selectedCustomForm) {
      setCustomForm(selectedCustomForm);
      setActiveField('customForm');
      setLevel(2);
    }
  };

  const handleRelevantHazardsChange = (id: string, value: FieldValueType) => {
    if (id === getRelevantHazard().id && typeof value === 'string') {
      const entry = getEntryWithHazardChanges();
      const relevantHazardsField = formFields.find((f) => f.id === RelevantHazards.id);
      const currentHazards = relevantHazardsField
        ? (getFieldValue(relevantHazardsField, entry) as string[] | undefined) || []
        : [];

      const updatedHazards = [...currentHazards];
      if (selectedHazardIndex < updatedHazards.length) {
        updatedHazards[selectedHazardIndex] = value;
      } else {
        updatedHazards.push(value);
      }

      setSelectedHazardType(value);
      onHazardFieldChange(RelevantHazards.id, updatedHazards);

      if (activeFormField) {
        setActiveFormField({ ...activeFormField, value });
      }
    }
  };

  const getFormattedValueForField = (field: Field, value: FieldValueType) => {
    if (field.id === 'CommunicationMethod') {
      return CommunicationMethod?.options?.find((option) => option.value === value)?.label ?? value;
    }

    return value;
  };

  const filteredFormFieldsForView = [
    'SituationReport',
    'AvianFlu',
    'RiskAssessment',
    'RiskAssessmentReview'
  ].includes(entry.type ?? '')
    ? []
    : formFields;
  const dependentFieldIds = filteredFormFieldsForView.map(
    (activeFormField) => activeFormField.dependentFieldId
  );
  const parentFormFields = filteredFormFieldsForView.filter(
    (activeFormField) => !dependentFieldIds.includes(activeFormField.id)
  );

  const descriptionOptionData = (onClickLevel: number): EntityOptionData[] => [
    {
      id: 'description',
      onClick: () => {
        saveCurrentState();
        setCustomHeading('Add a description');
        setActiveField('description');
        setLevel(onClickLevel);
      },
      value: entry.content?.text || undefined,
      supportedOffline: true
    }
  ];

  const detailsOptionData = (type: 'siteRepMethane' | 'avianFlu'): EntityOptionData[] => {
    let id = '';
    let onClick = () => {};

    if (type === 'siteRepMethane') {
      id = 'sitRepDetails';
      onClick = () => {
        saveCurrentState();
        setCustomHeading('Details');
        setActiveField('siteRepDetails');
        setLevel(2);
      };
    } else if (type === 'avianFlu') {
      id = 'avianFlu';
      onClick = () => {
        saveCurrentState();
        setCustomHeading('Details');
        setActiveField('avianFluDetails');
        setLevel(2);
      };
    }

    return [
      {
        id,
        onClick,
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
  };

  const riskAssessmentReviewOptionData = (): EntityOptionData[] => {
    const value =
      (entry.type === 'RiskAssessmentReview' &&
        formFields
          .filter((activeFormField) => activeFormField.id === 'Review')
          .map((activeFormField) => getFieldValue(activeFormField, entry)?.toString())?.[0]) ||
      undefined;
    const linkedEntry = entries.find((e) => e.id === value);
    return [
      {
        id: 'riskAssessmentReview',
        onClick: () => {
          saveCurrentState();
          setCustomHeading('Select risk assessment to review');
          setActiveFormField(formFields.find((field) => field.id === 'Review'));
          setActiveField('riskAssessmentToReview');
          setLevel(2);
        },
        label: 'Select risk assessment to review',
        value,
        valueLabel:
          (linkedEntry && Format.mentionable.entry(linkedEntry as LogEntry, true)?.label) ||
          undefined,
        supportedOffline: true
      },
      ...(value ? getRiskReviewOptions() : [])
    ];
  };

  const formTypeLabel = LogEntryTypes[entry.type as LogEntryType]?.label;

  const addLocationHeading =
    entry.type === 'SituationReport' ? 'Add exact location' : 'Add locations';

  const viewLocationHeading =
    entry.type === 'SituationReport' ? 'View exact location' : 'View locations';

  const baseEntityOptionsData = (onClickLevel: number): EntityOptionData[] => [
    {
      id: 'dateAndTime',
      onClick: () => {
        saveCurrentState();
        setCustomHeading('Add date and time');
        setActiveField('dateAndTime');
        setLevel(onClickLevel);
      },
      value: entry.dateTime
        ? `${Format.date(entry.dateTime)} @ ${Format.time(entry.dateTime)}`
        : undefined,
      supportedOffline: true
    },
    {
      id: 'location',
      onClick: () => {
        saveCurrentState();
        setCustomHeading(addLocationHeading);
        setActiveField('location');
        setLevel(onClickLevel);
      },
      label: addLocationHeading,
      value: entry.location ? viewLocationHeading : undefined,
      required: LogEntryTypes[entry.type as LogEntryType]?.requireLocation
    },
    {
      id: 'attachments',
      onClick: () => {
        saveCurrentState();
        setCustomHeading('Add attachments');
        setActiveField('attachments');
        setLevel(onClickLevel);
      },
      value:
        selectedFiles.length > 0
          ? Format.pretty.pluralize(selectedFiles.length, 'attachment')
          : undefined,
      supportedOffline: true
    },
    {
      id: 'recordings',
      onClick: () => {
        saveCurrentState();
        setCustomHeading('Add voice recordings');
        setActiveField('recordings');
        setLevel(onClickLevel);
      },
      value:
        recordings.length > 0
          ? Format.pretty.pluralize(recordings.length, 'voice recording')
          : undefined,
      supportedOffline: true
    },
    {
      id: 'sketch',
      onClick: () => {
        saveCurrentState();
        setCustomHeading('Add sketch');
        setActiveField('sketch');
        setLevel(onClickLevel);
      },
      value: sketchLines.length > 0 ? 'View sketch' : undefined,
      supportedOffline: true
    }
  ];

  const entityOptionsData = (inputType: 'form' | 'update'): EntityOptionData[] => {
    let onClickLevel = 0;

    if (inputType === 'form') {
      onClickLevel = 2;
    } else if (inputType === 'update') {
      onClickLevel = 1;
    }

    return [
      ...(['SituationReport', 'AvianFlu', 'RiskAssessment', 'RiskAssessmentReview'].includes(
        entry.type ?? ''
      )
        ? []
        : descriptionOptionData(onClickLevel)),
      ...(inputType === 'form' && entry.type === 'SituationReport'
        ? detailsOptionData('siteRepMethane')
        : []),
      ...(inputType === 'form' && entry.type === 'AvianFlu' ? detailsOptionData('avianFlu') : []),
      ...(inputType === 'form' && entry.type === 'RiskAssessmentReview'
        ? riskAssessmentReviewOptionData()
        : []),
      ...(inputType === 'form' && entry.type === 'RiskAssessment' ? getRiskReviewOptions() : []),
      ...(inputType === 'form'
        ? parentFormFields.map(
          (field) =>
              ({
                id: `field-${field.id}`,
                dependentId: field.dependentFieldId,
                onClick: () => {
                  saveCurrentState();
                  setCustomHeading(`Add ${field.title ?? 'field'}`);
                  setActiveField('formFields');
                  setActiveFormField(field);
                  setLevel(2);
                },
                value: getFormattedValueForField(
                  field,
                  getFieldValue(
                    formFields.find((formField) => field.dependentFieldId === formField.id) ??
                      field,
                    entry
                  )
                ),
                label: field.label,
                icon: getFieldIcon(field)?.icon,
                supportedOffline: true
              }) as EntityOptionData
        )
        : []),
      ...baseEntityOptionsData(onClickLevel)
    ];
  };

  const handleDateTimeChange = useCallback(
    (d: string | undefined, t: string | undefined) => {
      if (d && t) {
        const parseDate = Date.parse(`${d}T${t}`);
        if (!Number.isNaN(parseDate)) {
          onFieldChange('dateTime', new Date(`${d}T${t}`).toISOString());
        }
      }
    },
    [onFieldChange]
  );

  const renderFieldInput = () => {
    if (!activeField) return null;

    const hasHazardChanges = Object.keys(hazardChanges).length > 0;

    const hasDataChanges = tempState.hasChangesInProps({
      entry,
      selectedFiles,
      recordings,
      sketchLines,
      customFormData
    });

    const isDirty = hasHazardChanges || hasDataChanges;

    const fieldInput = (() => {
      switch (activeField) {
        case 'description':
          return (
            <EntryContent
              id="content"
              editable
              json={typeof entry.content === 'object' ? entry.content.json : undefined}
              onChange={(id: string, json: string, text: string) => {
                onFieldChange(id, { json, text });
              }}
              error={false}
              mentionables={mentionables}
              placeholder="Type @ to tag a person, log, task or file"
            />
          );

        case 'dateAndTime':
          return (
            <DateAndTimePicker
              dateLabel="Date"
              timeLabel="Time"
              dateLowerBound={incident.startedAt}
              lowerBoundErrorMessage="##Time## cannot be earlier than the incident start date"
              disableFuture
              value={entry.dateTime}
              onChange={handleDateTimeChange}
            />
          );

        case 'location':
          return (
            <Location.Content
              location={entry.location}
              validationErrors={validationErrors}
              onLocationChange={onLocationChange}
              required={LogEntryTypes[entry.type as LogEntryType].requireLocation}
            />
          );

        case 'attachments':
          return (
            <Files.Content
              active={true}
              selectedFiles={selectedFiles}
              onFilesSelected={onFilesSelected}
              removeSelectedFile={onRemoveSelectedFile}
            />
          );

        case 'recordings':
          return <Recordings recordings={recordings} onRecordingsChanged={onRecordingsChanged} />;

        case 'sketch':
          return (
            <Sketch.Content
              active={true}
              canvasRef={canvasRef}
              lines={sketchLines}
              onChangeLines={setSketchLines}
            />
          );

        case 'siteRepDetails':
        case 'avianFluDetails':
          return forms ? (
            <PredefinedFormContainer
              entry={entry}
              selectedForm={
                forms.find(
                  (form) =>
                    (activeField === 'siteRepDetails' && form.id === 'siteRepMethane') ||
                    (activeField === 'avianFluDetails' && form.id === 'avianFlu')
                )!
              }
              fields={formFields}
              onFieldChange={onNestedFieldChange}
            />
          ) : null;

        case 'formFields':
        case 'comments':
        case 'riskAssessmentToReview':
        case 'hazard':
          return formFields && activeFormField ? (
            <Box display="flex" flexDirection="column" gap={2}>
              <GenericFormField
                field={activeFormField}
                fields={formFields}
                entry={getEntryWithHazardChanges()}
                entries={entries}
                onChange={(id, value) => {
                  if (activeField === 'hazard') {
                    handleRelevantHazardsChange(id, value);
                  } else {
                    onNestedFieldChange(id, value);
                  }
                }}
                errors={validationErrors}
              />
              {activeField === 'hazard' && selectedHazardType && forms && (
                <PredefinedFormContainer
                  entry={getEntryWithHazardChanges()}
                  selectedForm={
                    forms.find((form) => form.id === `haz_${selectedHazardType.toLowerCase()}`)!
                  }
                  fields={formFields}
                  onFieldChange={onHazardFieldChange}
                />
              )}
            </Box>
          ) : null;

        default:
          return null;
      }
    })();

    return (
      <Box>
        {fieldInput}
        <Box display="flex" justifyContent="flex-end" marginTop={2}>
          <Button
            onClick={() => {
              applyHazardChangesToParent();
              setLevelAndClearState(inputType === 'form' ? 1 : 0, true);
            }}
            variant="contained"
            disabled={!isDirty}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    );
  };

  const formInputContainerData = (): EntityInputContainerData[] => [
    {
      heading: 'New form',
      inputControls: (
        <>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <EntityTypeDropdown
              options={formTypes}
              value={entry.type ?? formTypes[0]?.value}
              onChange={onFormTypeChange}
            />
          </FormControl>
          <EntityDivider />
        </>
      )
    },
    (selectingCustomForm && {
      heading: 'New custom form',
      inputControls: (
        <>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <EntityTypeDropdown
              options={customFormTypes}
              value={customForm?.id ?? customFormTypes[0]?.value}
              onChange={onCustomFormSelectionChange}
            />
          </FormControl>
          <EntityDivider />
        </>
      )
    }) || {
      heading: `Add form - ${formTypeLabel}`,
      inputControls: (
        <>
          <Box display="flex" sx={{ py: 0.8 }}>
            <CircleIcon sx={{ opacity: 0 }} />
            <Typography variant="body1" padding={1}>
              {formTypeLabel}
            </Typography>
          </Box>
          <EntityDivider />
          <EntityOptionsContainer
            entityType="forms"
            data={entityOptionsData('form')}
            errors={validationErrors}
          />
        </>
      ),
      showButtons: true
    },
    (activeField === 'customForm' &&
      customForm && {
      heading: `New custom form - ${customForm.title}`,
      inputControls: (
        <Box flexGrow={1} padding={2}>
          <AddFormInstance
            selectedForm={customForm}
            selectedFormData={customFormData}
            onChange={onCustomFormDataChange}
            setErrors={setValidationErrors}
          />
        </Box>
      ),
      showButtons: true,
      containerBackgroundColor: 'background.default'
    }) || {
      heading: customHeading,
      inputControls: <Box padding={2}>{renderFieldInput()}</Box>,
      containerBackgroundColor: 'background.default'
    }
  ];

  const updateInputContainerData = (): EntityInputContainerData[] => [
    {
      heading: 'New update',
      inputControls: (
        <EntityOptionsContainer
          entityType="updates"
          data={entityOptionsData('update')}
          errors={validationErrors}
        />
      ),
      showButtons: true
    },
    {
      heading: customHeading,
      inputControls: <Box padding={2}>{renderFieldInput()}</Box>,
      containerBackgroundColor: 'background.default'
    }
  ];

  return (
    <EntityInputContainer
      data={
        (inputType === 'form' && formInputContainerData()) ||
        (inputType === 'update' && updateInputContainerData()) ||
        []
      }
      onMainBackClick={onMainBackClick}
      onSubmit={() => onSubmit(submissionType)}
      onCancel={onCancel}
      level={level}
      setLevel={setLevelAndClearState}
      disableSubmit={validationErrors.length > 0 || disableSubmit}
    />
  );
};
