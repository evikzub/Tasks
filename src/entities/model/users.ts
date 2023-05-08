import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../../shared/config';
import { IUser } from '../../shared/api';

const USER_LIST_QUERY_KEY = 'users';

export const usersApi = createApi({
	reducerPath: 'userApi',
	baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
	tagTypes: ['Users'],
	endpoints: (builder) => ({
		fetchAllUsers: builder.query<IUser[], number>({
			query: (limit: number = 10) => ({
				url: USER_LIST_QUERY_KEY,
				params: {
					_limit: limit,
				}
			}),
			providesTags: result => ['Users']
		}),
		createUser: builder.mutation<IUser, IUser>({
			query: (user) => ({
				url: USER_LIST_QUERY_KEY,
				method: 'POST',
				body: user
			}),
			invalidatesTags: ['Users']
		}),
		updateUser: builder.mutation<IUser, IUser>({
			query: (user) => ({
				url: `${USER_LIST_QUERY_KEY}/${user.id}`,
				method: 'PUT',
				body: user
			}),
			invalidatesTags: ['Users']
		}),
		deleteUser: builder.mutation<IUser, IUser>({
			query: (user) => ({
				url: `${USER_LIST_QUERY_KEY}/${user.id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Users']
		}),
	})
})