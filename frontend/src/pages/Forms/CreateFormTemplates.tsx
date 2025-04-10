// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { useCallback, useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { UiSchema } from '@rjsf/utils';
import { JSONSchema7 } from "json-schema";
import FormBuilder from "../../components/CustomForms/FormTemplates/FormBuilder";
import FormPreview from "../../components/CustomForms/FormTemplates/FormPreview";

const CreateFormTemplates = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const form = location.state?.form;
  const isViewMode = !!form;

  const [schema, setSchema] = useState({});
  const [uiSchema, setUiSchema] = useState({});

  const handleSchemaChange = useCallback((jSchema : JSONSchema7, jUiSchema : UiSchema) => {
    setSchema(jSchema);
    setUiSchema(jUiSchema);
  }, []);

  useEffect(() => {
    if (form) {
      setSchema(form.formData as JSONSchema7);
      setUiSchema({"ui:submitButtonOptions": { norender: true }})
    }
  }, [form]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      height="100%"
      p={4}
    >
      <Box display="flex" gap="2rem" flex={1}>
        {!isViewMode && (
          <Box flex={1}>
            <FormBuilder onSchemaChange={handleSchemaChange} />
          </Box>
        )}
        <Box flex={1}>
          <FormPreview schema={schema} uiSchema={uiSchema} />
        </Box>
      </Box>
  
      {isViewMode && (
        <Box mt={4} display="flex" justifyContent="flex-end">
          <Button variant="outlined" onClick={() => navigate('/forms')}>
            Back to Forms
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default CreateFormTemplates;