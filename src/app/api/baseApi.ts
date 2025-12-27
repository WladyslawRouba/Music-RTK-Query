import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { handleErrors} from '@/common/utils';

export const baseApi = createApi({
  reducerPath: 'baseApi',
  tagTypes: ['Playlist'],
  baseQuery: async (args, api, extraOptions) => {
    const result = await fetchBaseQuery({
      baseUrl: import.meta.env.VITE_BASE_URL,
      headers: {
        'API-KEY': import.meta.env.VITE_API_KEY,
      },
      prepareHeaders: headers => {
        headers.set('Authorization', `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`);
        return headers;
      },
    })(args, api, extraOptions);

    if (result.error) {
    handleErrors(result.error)
    }

    return result;
  },
  endpoints: () => ({}),
});