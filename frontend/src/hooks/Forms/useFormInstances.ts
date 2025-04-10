import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FetchError, get, post } from "../../api";
import { FormInstance } from "../../components/CustomForms/FormTemplates/types";
import { CreateFormContext, CreateFormInstancePayload } from "./types";

export const useCreateFormInstance = (incidentId? : string) => {
  const queryClient = useQueryClient();

  return useMutation<FormInstance, Error, CreateFormInstancePayload, CreateFormContext>({
    mutationFn: ({ formTemplateId, formData }) =>
      post(`/incident/${incidentId}/form`, { formTemplateId, formData }),

    onMutate: async ({ formTemplateId, formData, title }) => {
      await queryClient.cancelQueries({ queryKey: [`incident/${incidentId}/form`] });

      const previousForms = queryClient.getQueryData<FormInstance[]>([`incident/${incidentId}/form`]);

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

      return { previousForms };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousForms) {
        queryClient.setQueryData([`incident/${incidentId}/form`], context.previousForms);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`incident/${incidentId}/form`] });
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