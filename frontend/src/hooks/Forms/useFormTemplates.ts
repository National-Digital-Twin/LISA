// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FetchError, get, post } from '../../api';
import { Form } from '../../components/CustomForms/FormTemplates/types';
import { CreateFormTemplatePayload, CreateFormContext } from "./types";

export async function poll(
  formTemplateId: string | undefined,
  queryClient: QueryClient,
  attemptNumber: number
) {
  const forms = await get<Form[]>('/form');

  if (attemptNumber <= 10) {
    if (forms.find((form) => form.id === formTemplateId)) {
      queryClient.invalidateQueries({ queryKey: [`forms`] })
    } else {
      setTimeout(() => poll(formTemplateId, queryClient, attemptNumber + 1), 10000);
    }
  }
}

export const useCreateFormTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation<Form, Error, CreateFormTemplatePayload, CreateFormContext>({
    mutationFn: ({ title, formData }) =>
      post('/form', { title, formData }),

    onMutate: async ({ title, formData }) => {
      await queryClient.cancelQueries({ queryKey: ['forms'] });

      const previousForms = queryClient.getQueryData<Form[]>(['forms']);

      const optimisticForm: Form = {
        id: `temp-${Date.now()}`,
        title,
        formData,
        createdAt: new Date().toISOString(),
        authorName: 'Saving...'
      };

      queryClient.setQueryData<Form[]>(['forms'], (old = []) => [
        optimisticForm,
        ...(old ?? []),
      ]);

      return { previousForms };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousForms) {
        queryClient.setQueryData(['forms'], context.previousForms);
      }
    },

    onSuccess: async (response) => {
      setTimeout(() => poll(response.id, queryClient, 1), 1000);
    }
  });
};

export const useFormTemplates = () => {
  const { data, isLoading, isError, error } = useQuery<Form[], FetchError>({
    queryKey: ['forms'],
    queryFn: () => get("/form")
  });
  
  return { forms: data, isLoading, isError, error };
};