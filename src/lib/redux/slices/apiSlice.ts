import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { endpoints } from '@/configs/apiConfig';
import { Form } from '@/types/api';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
  tagTypes: ['Form'],
  endpoints: (builder) => ({
    getForms: builder.query<Form[], void>({
      query: () => endpoints.forms.all,
      providesTags: (result) => 
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Form' as const, id: _id })),
              { type: 'Form', id: 'LIST' },
            ]
          : [{ type: 'Form', id: 'LIST' }],
    }),
    
    getFormById: builder.query<Form, string>({
      query: (id) => endpoints.forms.byId(id),
      providesTags: (_, __, id) => [{ type: 'Form', id }],
    }),
    
    createForm: builder.mutation<Form, Omit<Form, '_id'>>({
      query: (form) => ({
        url: endpoints.forms.all,
        method: 'POST',
        body: form,
      }),
      invalidatesTags: [{ type: 'Form', id: 'LIST' }],
    }),
    
    updateForm: builder.mutation<Form, Form>({
      query: (form) => ({
        url: endpoints.forms.byId(form._id!),
        method: 'PUT',
        body: form,
      }),
      invalidatesTags: (_, __, arg) => [
        { type: 'Form', id: arg._id },
        { type: 'Form', id: 'LIST' },
      ],
    }),
    
    deleteForm: builder.mutation<void, string>({
      query: (id) => ({
        url: endpoints.forms.byId(id),
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Form', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetFormsQuery,
  useGetFormByIdQuery,
  useCreateFormMutation,
  useUpdateFormMutation,
  useDeleteFormMutation,
} = apiSlice; 