// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { v4 as uuidV4 } from 'uuid';

import { FetchError, get, post } from '../../api';
import { FormInstance } from '../../components/CustomForms/FormTemplates/types';
import { CreateFormInstanceContext, CreateFormInstancePayload } from './types';
import { createLogEntryFromSubmittedForm } from './utils';
import { useCreateLogEntry } from '../useLogEntries';
import { OfflineFormInstance } from '../../offline/types/OfflineForm';
import { useIsOnline } from '../useIsOnline';
import { addForm } from '../../offline/db/dbOperations';

export async function poll(
  incidentId: string | undefined,
  formId: string | undefined,
  queryClient: QueryClient,
  attemptNumber: number
) {
  const forms = await get<FormInstance[]>(`/incident/${incidentId}/form`);

  if (attemptNumber <= 10) {
    if (forms.find((form) => form.id === formId)) {
      queryClient.invalidateQueries({ queryKey: [`incident/${incidentId}/form`] });
    } else {
      setTimeout(() => poll(incidentId, formId, queryClient, attemptNumber + 1), 10000);
    }
  }
}

export const useCreateFormInstance = (incidentId: string, onSuccess: () => void) => {
  const queryClient = useQueryClient();
  const { createLogEntry } = useCreateLogEntry(incidentId);
  const isOnline = useIsOnline();

  return useMutation<{ id: string }, Error, CreateFormInstancePayload, CreateFormInstanceContext>({
    mutationFn: async ({ formTemplateId, formData, title }) => {
      if (!incidentId) throw new Error('No incident ID provided.');

      const id = uuidV4();
      const createdAt = new Date().toISOString();
      const logEntry = createLogEntryFromSubmittedForm(uuidV4(), title, id, incidentId, createdAt);

      if (!isOnline) {
        const offlineForm: OfflineFormInstance = {
          id,
          title,
          formTemplateId,
          formData,
          incidentId,
          createdAt,
          authorName: 'Offline'
        };

        await addForm(offlineForm);
      } else {
        await post<{ id: string }>(`/incident/${incidentId}/form`, { formTemplateId, formData, createdAt, id });
      }

      createLogEntry({ logEntry });

      return { id };
    },

    onMutate: async ({ formTemplateId, formData, title }) => {
      await queryClient.cancelQueries({ queryKey: [`incident/${incidentId}/form`] });

      const previousFormInstances = queryClient.getQueryData<FormInstance[]>([
        `incident/${incidentId}/form`
      ]);

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
        ...(old ?? [])
      ]);

      return { previousFormInstances };
    },

    onSuccess: async () => {
      onSuccess?.();
    },

    onError: (_err, _vars, context) => {
      if (context?.previousFormInstances) {
        queryClient.setQueryData([`incident/${incidentId}/form`], context.previousFormInstances);
      }
    },

    networkMode: 'always'
  });
};

export const useFormInstances = (incidentId?: string) => {
  const { data, isLoading, isError, error } = useQuery<FormInstance[], FetchError>({
    queryKey: [`incident/${incidentId}/form`],
    queryFn: () => get(`/incident/${incidentId}/form`),
  });

  return { forms: data, isLoading, isError, error };
};

