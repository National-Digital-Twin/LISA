import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FetchError, get, post } from '../../api';
import { Form } from '../../components/CustomForms/FormTemplates/types';
import { CreateFormTemplatePayload, CreateFormContext } from "./types";

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

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
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