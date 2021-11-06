// import {SET_USER_TRIPS, SET_USER_ROUTES, PATCH_USER} from '../types';
import qs from 'qs';
import {
	API_TOKEN,
	API_URL_UPLOAD,
} from '@env';
import { errorResponse } from '../../variables';

export const uploadImage = (formData) =>
{
	return (dispatch) =>
	{
		const q = {token: API_TOKEN};
		return fetch(`${API_URL_UPLOAD}?${qs.stringify(q)}`, {
			method: 'POST',
			headers: {'Content-Type': 'multipart/form-data'},
			body: formData,
		})
			.then(response => response.json())
			.catch(e => {
				console.log('uploadImage exception:', e)
				return errorResponse()
			});
	};
};
