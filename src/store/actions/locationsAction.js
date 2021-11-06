import qs from 'qs';
import {API_URL_SELECT, API_TOKEN, API_URL_INSERT} from '@env';
import { errorResponse } from '../../variables';


export const createLoaction = data => {
	return async (dispatch) => {
		const q = {token: API_TOKEN};

		return fetch(`${API_URL_INSERT}?${qs.stringify(q)}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: qs.stringify({
				insert: {
					table: 'locations',
					values: [data]
				}
			})
		})
			.then(response => response.json())
			.catch(e => {
				console.log('createLoaction exception:', e)
				return errorResponse()
			});
	};
};

export const createRouteLocation = data => {
	return async (dispatch) => {
		const q = {token: API_TOKEN};

		return fetch(`${API_URL_INSERT}?${qs.stringify(q)}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: qs.stringify({
				insert: {
					table: 'routes_locations',
					values: [data]
				}
			})
		})
			.then(response => response.json())
			.catch(e => {
				console.log('createRouteLocation exception:', e)
				return errorResponse()
			});
	};
};
