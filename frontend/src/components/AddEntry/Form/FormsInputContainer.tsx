// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { RefObject, useEffect, useMemo, useState } from 'react';
import { Stage } from 'konva/lib/Stage';
import { Box, FormControl, Typography } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { type LogEntry } from 'common/LogEntry';
import { type Incident } from 'common/Incident';
import { LogEntryTypes } from 'common/LogEntryTypes';
import { LogEntryType } from 'common/LogEntryType';
import { Mentionable } from 'common/Mentionable';
import { type Location as TypeOfLocation } from 'common/Location';
import { FieldValueType, OptionType, SketchLine, ValidationError } from '../../../utils/types';
import {
  EntityInputContainer,
  EntityInputContainerData
} from '../../AddEntity/EntityInputContainer';
import { getFormTypes } from '../../../utils/Form/getBaseLogEntryFields';
import { EntityOptionsContainer } from '../../AddEntity/EntityOptionsContainer';
import { EntityOptionData } from '../../AddEntity/EntityOptions';
import { OnFieldChange } from '../../../utils/handlers';
import EntryContent from '../../lexical/EntryContent';

import { Format, Validate } from '../../../utils';
import Sketch from '../../AddEntry/Sketch';
import Files from '../../AddEntry/Files';
import { EntityDivider } from '../../AddEntity/EntityDivider';
import Location from '../../AddEntry/Location';
import { getFieldValue } from '../../../utils/Form/getFieldValue';
import { getFieldIcon } from '../../../utils/Form/getFieldIcon';
import { Field } from 'common/Field';
import { CommunicationMethod } from 'common/Fields/CommunicationMethod';
import { Form as CustomForm, FormDataProperty } from '../../CustomForms/FormTemplates/types';
import { FormContainer as CustomFormContainer } from '../../CustomForms/FormInstances/FormContainer';
import { RelevantHazards } from 'common/LogEntryTypes/RiskAssessment/hazards/RelevantHazards';
import { getRelevantHazard, getHazardLabel } from 'common/LogEntryTypes/RiskAssessment/hazards';
import { EntityTypeDropdown } from '../../AddEntity/EntityTypeDropdown';
import { DateAndTimePicker } from '../../DateAndTimePicker';
import { GenericFormField } from '../../Form/GenericFormField';
import AddFormInstance from '../../CustomForms/FormInstances/AddFormInstance';

type Props = {
  incident: Incident;
  entries: Array<LogEntry>;
  entry: Partial<LogEntry>;
  customForm: CustomForm | null;
  customFormData: Array<FormDataProperty>;
  setCustomForm: (customForm: CustomForm | null) => void;
  formFields: Array<Field>;
  forms: Array<CustomForm>;
  mentionables: Array<Mentionable>;
  selectedFiles: Array<File>;
  recordings: Array<File>;
  canvasRef: RefObject<Stage | null>;
  sketchLines: Array<SketchLine>;
  onFieldChange: OnFieldChange;
  onCustomFormDataChange: (id: string, label: string, value: string) => void;
  resetEntry: () => void;
  resetCustomForm: () => void;
  resetCustomFormData: () => void;
  onFilesSelected: (files: Array<File>) => void;
  onRemoveSelectedFile: (filename: string) => void;
  onRemoveRecording: (recordingName: string) => void;
  onLocationChange: (locationInputType: Partial<TypeOfLocation>) => void;
  setSketchLines: (sketchLines: Array<SketchLine>) => void;
  onMainBackClick: () => void;
  onSubmit: (submissionType: 'customForm' | 'entry' | null) => void;
  onCancel: () => void;
};

export const FormsInputContainer = ({
  incident,
  entries,
  entry,
  customForm,
  customFormData,
  setCustomForm,
  formFields,
  forms,
  mentionables,
  selectedFiles,
  recordings,
  canvasRef,
  sketchLines,
  onFieldChange,
  onCustomFormDataChange,
  resetEntry,
  resetCustomForm,
  resetCustomFormData,
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
  const [submissionType, setSubmissionType] = useState<'customForm' | 'entry' | null>(null);
  const [validationErrors, setValidationErrors] = useState<Array<ValidationError>>([]);
  const [selectingCustomForm, setSelectingCustomForm] = useState<boolean>(false);
  const [customHeading, setCustomHeading] = useState<string>('');
  const [addingCustomForm, setAddingCustomForm] = useState<boolean>(false);
  const [addingDescription, setAddingDescription] = useState<boolean>(false);
  const [addingSiteRepDetails, setAddingSiteRepDetails] = useState<boolean>(false);
  const [addingHazard, setAddingHazard] = useState<boolean>(false);
  const [selectedHazardIndex, setSelectedHazardIndex] = useState<number>(0);
  const [hazardValue, setHazardValue] = useState<string>();
  const [hazardsOptionData, setHazardsOptionData] = useState<EntityOptionData[]>([]);
  const [refreshHazardOptions, setRefreshHazardOptions] = useState<boolean>(false);
  const [refreshRemoveHazardsCall, setRefreshRemoveHazardsCall] = useState<boolean>(false);
  const [addingComments, setAddingComments] = useState<boolean>(false);
  const [addingRiskAssessmentToReview, setAddingRiskAssessmentToReview] = useState<boolean>(false);
  const [addingFormFields, setAddingFormFields] = useState<boolean>(false);
  const [addingDateAndTime, setAddingDateAndTime] = useState<boolean>(false);
  const [addingLocation, setAddingLocation] = useState<boolean>(false);
  const [addingAttachments, setAddingAttachments] = useState<boolean>(false);
  const [addingSketch, setAddingSketch] = useState<boolean>(false);
  const [formField, setFormField] = useState<Field>();
  const customForms: CustomForm[] = useMemo(
    () => forms.filter((form) => form.id !== 'siteRepMethane' && !form.id.includes('haz_')),
    [forms]
  );
  const formTypes: OptionType[] = useMemo(
    () => [
      { label: 'Select form', value: 'SelectForm', disabled: true },
      ...getFormTypes(incident, customForms.length > 0)
    ],
    [incident, customForms]
  );
  const customFormTypes: OptionType[] = useMemo(
    () => [
      { label: 'Select custom form', value: 'SelectCustomForm', disabled: true },
      ...customForms.map((customForm) => ({ label: customForm.title, value: customForm.id }))
    ],
    [customForms]
  );

  useEffect(() => {
    if (submissionType === 'entry') {
      setValidationErrors(Validate.entry(entry, [...selectedFiles, ...recordings]));
    }
  }, [submissionType, setValidationErrors, entry, selectedFiles, recordings]);

  const setLevelAndClearState = (level: number) => {
    setLevel(level);

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

      setAddingCustomForm(false);
      setAddingDescription(false);
      setAddingSiteRepDetails(false);
      setAddingHazard(false);
      setAddingComments(false);
      setAddingRiskAssessmentToReview(false);
      setAddingFormFields(false);
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
    if (selectedRelevantHazards.length > 0) {
      if (index < selectedRelevantHazards.length) {
        return {
          id: `selectHazard-${index}`,
          onClick: () =>
            onHazardOptionClick(
              index,
              label,
              selectedRelevantHazards[index],
              selectedRelevantHazards
            ),
          label: label,
          value: selectedRelevantHazards[index],
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
    } else {
      const relevantHazardsField = formFields.find(
        (formField) => formField.id === RelevantHazards.id
      );

      if (relevantHazardsField) {
        const relevantHazardsValue = getFieldValue(relevantHazardsField, entry);

        if (relevantHazardsValue && index < relevantHazardsValue.length - 1) {
          return {
            id: `selectHazard-${index}`,
            onClick: () =>
              onHazardOptionClick(
                index,
                label,
                relevantHazardsValue[index],
                selectedRelevantHazards
              ),
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
    }
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
    value: value ?? option.value,
    valueLabel: value ? getHazardLabel(value) : option.valueLabel,
    onClick: () =>
      onHazardOptionClick(index, option.label!, value ?? option.value, relevantHazards ?? []),
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
    if (formType === 'CustomForm') {
      setSelectingCustomForm(true);
      setSubmissionType('customForm');
    } else {
      onFieldChange('type', formType);
      setSubmissionType('entry');

      if (formType === 'RiskAssessment') {
        setHazardsOptionData([hazardOptionData(0, true, 'Select hazard', [])]);
      }
    }

    setLevel(1);
  };

  const onCustomFormSelectionChange = (customFormSelection: string) => {
    const selectedCustomForm = customForms.find(
      (customForm) => customForm.id === customFormSelection
    );

    if (selectedCustomForm) {
      setCustomForm(selectedCustomForm);
      setAddingCustomForm(true);
      setLevel(2);
    }
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

            if (formField) {
              setFormField({ ...formField, value: underlyingValue });
            } else {
              setFormField({ ...getRelevantHazard(), value: underlyingValue });
            }
          }
        }
      }
    }
  };

  useEffect(() => {
    if (entry.type === 'RiskAssessmentReview') {
      const relevantHazardsField = formFields.find(
        (formField) => formField.id === RelevantHazards.id
      );

      if (relevantHazardsField) {
        const relevantHazardsFieldValue = getFieldValue(relevantHazardsField, entry);

        if (relevantHazardsFieldValue) {
          if (Array.isArray(relevantHazardsFieldValue)) {
            const relevantHazardOptions: EntityOptionData[] = relevantHazardsFieldValue
              .map((_value, index) => {
                if (index === 0) {
                  return hazardOptionData(0, true, 'Select hazard', relevantHazardsFieldValue);
                }

                return hazardOptionData(index, false, 'Add hazard', relevantHazardsFieldValue);
              })
              .concat(
                hazardOptionData(
                  relevantHazardsFieldValue.length,
                  false,
                  'Add hazard',
                  relevantHazardsFieldValue
                )
              );

            setHazardsOptionData(relevantHazardOptions);
          }
        }
      }
    }

    return setRefreshHazardOptions(false);
  }, [refreshHazardOptions]);

  const getFormattedValueForField = (field: Field, value: FieldValueType) => {
    if (field.id === 'CommunicationMethod') {
      return CommunicationMethod?.options?.find((option) => option.value === value)?.label ?? value;
    }

    return value;
  };

  const filteredFormFieldsForView = [
    'SituationReport',
    'RiskAssessment',
    'RiskAssessmentReview'
  ].includes(entry.type ?? '')
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
      id: 'sitRepDetails',
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
        setCustomHeading('Add comments');
        setFormField(formFields.find((formField) => formField.id === 'Comments'));
        setAddingComments(true);
        setLevel(2);
      },
      label: 'Add comments',
      value:
        ((entry.type === 'RiskAssessment' || entry.type === 'RiskAssessmentReview') &&
          formFields
            .filter((formField) => formField.id === 'Comments')
            .map((formField) => getFieldValue(formField, entry)?.toString())?.[0]) ||
        undefined,
      supportedOffline: true
    }
  ];

  const riskAssessmentReviewOptionData = (): EntityOptionData[] => {
    const value =
      (entry.type === 'RiskAssessmentReview' &&
        formFields
          .filter((formField) => formField.id === 'Review')
          .map((formField) => getFieldValue(formField, entry)?.toString())?.[0]) ||
      undefined;
    const linkedEntry = entries.find((e) => e.id === value);
    return [
      {
        id: 'riskAssessmentReview',
        onClick: () => {
          setCustomHeading('Select risk assessment to review');
          setFormField(formFields.find((formField) => formField.id === 'Review'));
          setAddingRiskAssessmentToReview(true);
          setLevel(2);
        },
        label: 'Select risk assessment to review',
        value,
        valueLabel:
          (linkedEntry && Format.mentionable.entry(linkedEntry as LogEntry, true)?.label) ||
          undefined,
        supportedOffline: true
      },
      ...(value ? riskReviewOptionData : [])
    ];
  };

  const formTypeLabel = LogEntryTypes[entry.type as LogEntryType]?.label;

  const addLocationHeading =
    entry.type === 'SituationReport' ? 'Add exact location' : 'Add location(s)';

  const viewLocationHeading =
    entry.type === 'SituationReport' ? 'View exact location' : 'View location(s)';

  const entityOptionsData: EntityOptionData[] = [
    ...(['SituationReport', 'RiskAssessment', 'RiskAssessmentReview'].includes(entry.type ?? '')
      ? []
      : descriptionOptionData),
    ...(entry.type === 'SituationReport' ? siteRepDetailOptionData : []),
    ...(entry.type === 'RiskAssessmentReview' ? riskAssessmentReviewOptionData() : []),
    ...(entry.type === 'RiskAssessment' ? riskReviewOptionData : []),
    ...parentFormFields.map(
      (field) =>
        ({
          id: `field-${field.id}`,
          dependentId: field.dependentFieldId,
          onClick: () => {
            setCustomHeading(`Add ${field.title ?? 'field'}`);
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
      required: LogEntryTypes[entry.type as LogEntryType]?.requireLocation
    },
    {
      id: 'attachments',
      onClick: () => {
        setCustomHeading('Add attachment(s)');
        setAddingAttachments(true);
        setLevel(2);
      },
      value: selectedFiles.length > 0 ? `${selectedFiles.length} attachments` : undefined,
      supportedOffline: true
    },
    {
      id: 'sketch',
      onClick: () => {
        setCustomHeading('Add sketch');
        setAddingSketch(true);
        setLevel(2);
      },
      value: sketchLines.length > 0 ? 'View sketch' : undefined,
      supportedOffline: true
    }
  ];
  const inputContainerData: EntityInputContainerData[] = [
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
            data={entityOptionsData}
            errors={validationErrors}
          />
        </>
      ),
      showButtons: true
    },
    (addingCustomForm &&
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
          {addingSiteRepDetails && forms && (
            <CustomFormContainer
              entry={entry}
              selectedForm={forms.find((form) => form.id === 'siteRepMethane')!}
              fields={formFields}
              onFieldChange={onNestedFieldChange}
            />
          )}
          {(addingFormFields || addingComments || addingRiskAssessmentToReview || addingHazard) &&
            formFields &&
            formField && (
              <Box display="flex" flexDirection="column" gap={2}>
                <GenericFormField
                  field={formField}
                  fields={formFields}
                  entry={entry}
                  entries={entries}
                  onChange={(id, value) => {
                    if (addingHazard) {
                      handleRelevantHazardsChange(id, value);
                    } else {
                      onNestedFieldChange(id, value);
                      if (addingRiskAssessmentToReview) {
                        setRefreshHazardOptions(true);
                      }
                    }
                  }}
                  errors={validationErrors}
                />
                {addingHazard && hazardValue && forms && (
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
              required={entry.type && LogEntryTypes[entry.type].requireLocation}
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
      onSubmit={() => onSubmit(submissionType)}
      onCancel={onCancel}
      level={level}
      setLevel={setLevelAndClearState}
      disableSubmit={validationErrors.length > 0}
    />
  );
};
