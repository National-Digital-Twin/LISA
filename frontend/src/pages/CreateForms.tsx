/* eslint-disable import/no-extraneous-dependencies */
import { useCallback, useState } from "react";
import { UiSchema } from '@rjsf/utils';
import { JSONSchema7 } from "json-schema";
import FormBuilder from "../components/CustomForms/FormBuilder";
import FormPreview from "../components/CustomForms/FormPreview";

const CreateForms = () => {

  const [schema, setSchema] = useState({});
  const [uiSchema, setUiSchema] = useState({});

  const handleSchemaChange = useCallback((jSchema : JSONSchema7, jUiSchema : UiSchema) => {
    setSchema(jSchema);
    setUiSchema(jUiSchema);
  }, []);

  return (
    <div style={{ display: "flex", gap: "2rem", padding: "2rem" }}>
      <div style={{ flex: 1 }}>
        <FormBuilder onSchemaChange={handleSchemaChange} />
      </div>
      <div style={{ flex: 1 }}>
        <FormPreview schema={schema} uiSchema={uiSchema} />
      </div>
    </div>
  );
}

export default CreateForms;