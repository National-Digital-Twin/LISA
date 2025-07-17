// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// eslint-disable-next-line import/no-extraneous-dependencies
import { LogEntry } from "common/LogEntry";
import { FetchError, get, post } from "../../api";
import { FormInstance } from "../../components/CustomForms/FormTemplates/types";
import { CreateFormInstanceContext, CreateFormInstancePayload } from "./types";
import { createLogEntryFromSubmittedForm } from "./utils";
import { useCreateLogEntry } from "../useLogEntries";

export async function poll(
  incidentId: string | undefined,
  formId: string | undefined,
  queryClient: QueryClient,
  attemptNumber: number
) {
  const forms = await get<FormInstance[]>(`/incident/${incidentId}/form`);

  if (attemptNumber <= 10) {
    if (forms.find((form) => form.id === formId)) {
      queryClient.invalidateQueries({ queryKey: [`incident/${incidentId}/form`] })
    } else {
      setTimeout(() => poll(incidentId, formId, queryClient, attemptNumber + 1), 10000);
    }
  }
}

export const useCreateFormInstance = (incidentId? : string) => {
  const queryClient = useQueryClient();
  const { createLogEntry } = useCreateLogEntry(incidentId);

  return useMutation<{ id: string }, Error, CreateFormInstancePayload, CreateFormInstanceContext>({
    mutationFn: ({ formTemplateId, formData }) =>
      post(`/incident/${incidentId}/form`, { formTemplateId, formData }),

    onMutate: async ({ formTemplateId, formData, title }) => {
      await queryClient.cancelQueries({ queryKey: [`incident/${incidentId}/form`] });

      const previousFormInstances = queryClient.getQueryData<FormInstance[]>([`incident/${incidentId}/form`]);

      const optimisticForm: FormInstance = {
        id: `temp-${Date.now()}`,
        title,
        formTemplateId,
        formData,
        createdAt: new Date().toISOString(),
        authorName: 'Saving...'
      };

      queryClient.setQueryData<FormInstance[]>([`incident/${incidentId}/form`], (old = []) => [
        optimisticForm,
        ...(old ?? []),
      ]);

      return { previousFormInstances };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousFormInstances) {
        queryClient.setQueryData([`incident/${incidentId}/form`], context.previousFormInstances);
      }
    },

    onSuccess: async (response, variables) => {
      setTimeout(() => poll(incidentId, response.id, queryClient, 1), 1000);
      const formTitle = variables.title;
      const formId = response.id;
            
      if (!incidentId || !formTitle || !formId) return;
      
      const logEntry = {
        ...createLogEntryFromSubmittedForm(formTitle, formId, incidentId)
      } as Omit<LogEntry, 'id' | 'author'>;
      createLogEntry({ logEntry });
    }
  });
};

export const useFormInstances = (incidentId? : string) => {
  const { data, isLoading, isError, error } = useQuery<FormInstance[], FetchError>({
    queryKey: [`incident/${incidentId}/form`],
    queryFn: () => get(`/incident/${incidentId}/form`)
  });
    
  return { forms: data, isLoading, isError, error };
};