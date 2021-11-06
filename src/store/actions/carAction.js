import {UPDATE_USER_CAR} from '../types';
import qs from 'qs';

import {API_TOKEN, API_URL_INSERT, API_URL_UPDATE, API_URL_DELETE} from '@env';
import { errorResponse } from '../../variables';

export const createCar = data => {
	return dispatch => {
		const q = {token: API_TOKEN};
		return fetch(`${API_URL_INSERT}?${qs.stringify(q)}`, {
			method: 'POST',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			body: qs.stringify({
				insert: {
					table: 'cars',
					values: [data],
				},
			}),
		})
			.then(response => response.json())
			.catch(e => {
				console.log('createCar exception:', e)
				return errorResponse()
			});
	};
};

export const patchCar = (carId, data) => {
	return dispatch => {
		const q = {token: API_TOKEN};
		return fetch(`${API_URL_UPDATE}?${qs.stringify(q)}`, {
			method: 'POST',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			body: qs.stringify({
				update: {
					table: 'cars',
					set: data,
					where: {
						operation: 'AND',
						fields: [
							{
								code: 'id',
								operation: 'IS',
								value: carId,
							},
						],
					},
				},
			}),
		})
			// .then(response => response.text())
			// .then(text => console.log(text.slice(0, 500)))
			// .then(() => errorResponse())
			.then(response => response.json())
			.then(json => {
				dispatch({
					type: UPDATE_USER_CAR,
					payload: {
						id: carId,
						data,
					},
				});
				return json;
			})
			.catch(e => {
				console.log('patchCar exception:', e)
				return errorResponse()
			});
	};
};

export const deleteCar = (carId) => {
	return dispatch => {
		const q = {token: API_TOKEN};
		return fetch(`${API_URL_UPDATE}?${qs.stringify(q)}`, {
			method: 'POST',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			body: qs.stringify({
				update: {
					table: 'cars',
					set: {is_active: false},
					where: {
						operation: 'AND',
						fields: [
							{
								code: 'id',
								operation: 'IS',
								value: carId,
							},
						],
					},
				},
			}),
		})
			.then(response => response.json())
			.catch(e => {
				console.log('deleteCar exception:', e)
				return errorResponse()
			});
	};
};
