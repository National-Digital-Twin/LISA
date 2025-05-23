// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import { Theme as Mui5Theme } from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import { JSONSchema7 } from 'json-schema';
import { useEffect, useRef, useState } from "react";
import { IChangeEvent, withTheme } from "@rjsf/core";
import { RJSFValidationError } from '@rjsf/utils';
import { useParams } from "react-router-dom";
import Modal from '../../Modal';
import { MODAL_KEY } from "../../../utils/constants";
import { useFormTemplates } from "../../../hooks/Forms/useFormTemplates";
import { Form } from "../FormTemplates/types";
import { useCreateFormInstance } from "../../../hooks/Forms/useFormInstances";
import CustomLabelField from "../FormTemplates/CustomLabelField";

type AddFormProps = {
  onCancel: () => void;
};

const RJSFForm = withTheme(Mui5Theme);

const AddFormInstance = ({ onCancel }: AddFormProps) => {
  const { forms } = useFormTemplates();
  const { incidentId } = useParams();
  const { mutate: createForm } = useCreateFormInstance(incidentId);
  const [modal] = useState<boolean>(sessionStorage.getItem(MODAL_KEY) === 'yes');
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [invalidFormDataAttempted, setInvalidFormDataAttempted] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formRef = useRef<any>(null);

  useEffect(() => {
    if (!invalidFormDataAttempted) return undefined;
  
    const timeout = setTimeout(() => {
      formRef.current?.validateForm();
    }, 0);
  
    return () => clearTimeout(timeout);
  }, [invalidFormDataAttempted]);

  const getLabelMap = (schema: JSONSchema7): Record<string, string> => {
    const labelMap: Record<string, string> = {};
    Object.entries(schema.properties ?? {}).forEach(([key, value]) => {
      if (typeof value === 'object' && value && 'title' in value) {
        labelMap[key] = value.title as string;
      }
    });
    return labelMap;
  };

  const transformErrors = (errors: RJSFValidationError[]) => {
    if (!selectedForm?.formData) return errors;
    const labelMap = getLabelMap(selectedForm.formData.schema);
  
    return errors.map((error) => {
      if (error.name === 'required' && error.params?.missingProperty) {
        const key = error.params.missingProperty;
        const label = labelMap[key] ?? key;
        return {
          ...error,
          message: `${label} is required`,
        };
      }
      return error;
    });
  };
  

  const handleChange = (event: SelectChangeEvent<string>) => {
    const selected = forms?.find((form) => form.id === event.target.value) ?? null;
    setSelectedForm(selected);
  };

  const handleSave = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  const handleFormSubmit = (event: IChangeEvent) => {
    if (!selectedForm) return;
  
    const rawData = event.formData;
    const {schema} = selectedForm.formData;
    const labelMap = getLabelMap(schema);
  
    const formData = Object.entries(rawData).map(([fieldId, value]) => {
      const property = schema.properties?.[fieldId];
      let normalisedValue = value;
  
      if (typeof property === 'object' && 'type' in property && property.type === 'boolean') {
        normalisedValue = value === true ? 'Yes' : 'No';
      }
  
      return {
        fieldId,
        label: labelMap[fieldId] ?? fieldId,
        value: normalisedValue
      };
    });
  
    createForm({formTemplateId: selectedForm.id, title: selectedForm.title, formData});
    onCancel();
  };
  
  
  return (
    <Modal modal={modal} onClose={onCancel}>
      <Box display="flex" flexDirection="column" displayPrint="none">
        <Box padding={2} bgcolor="background.default" id="rollup-log-book-entry">

          <Typography variant="h2" fontSize="1.3rem" mb={2}>
        Create new form entry
          </Typography>

          <FormControl fullWidth size="small" margin="normal">
            <InputLabel id="form-select-label">Select a form</InputLabel>
            <Select
              labelId="form-select-label"
              value={selectedForm?.id ?? ""}
              onChange={handleChange}
              label="Select a form"
            >
              {forms?.map((form) => (
                <MenuItem key={form.id} value={form.id}>
                  {form.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedForm?.formData && (
            <Box mt={3}>
              <RJSFForm
                ref={formRef}
                showErrorList={false}
                noHtml5Validate
                transformErrors={transformErrors}
                schema={selectedForm.formData.schema}
                validator={validator}
                uiSchema={selectedForm.formData.uiSchema}
                onSubmit={handleFormSubmit}
                onError={() => setInvalidFormDataAttempted(true)}
                fields={{ label: CustomLabelField }}
              />
              <Box mt={2} display="flex" justifyContent="end" gap={1}>
                <Button onClick={onCancel} variant="outlined">
        Cancel
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  startIcon={<ImportContactsIcon />}
                  onClick={handleSave}
                >
                  Save
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  )
}

export default AddFormInstance;