import {SET_USER_TRIPS, SET_USER_ROUTES, PATCH_USER, SET_USER} from '../types';
import qs from 'qs';
import {
	API_TOKEN,
	API_URL_SELECT,
	API_URL_UPDATE,
	API_URL_TRYCHANGEPHONE,
	API_URL_CHANGEPHONE,
} from '@env';
import { errorResponse } from '../../variables';


export const patchUser = data => {
	return dispatch => {
		dispatch({
			type: PATCH_USER,
			payload: data,
		});
	};
};

export const tripConverter = items => {
	// items.forEach(el => console.log([el.id, el.route.matrixValue[0]]))
	// items.forEach(el => console.log([el.id, el.route]))
	// items.forEach( el => !el.route.matrixValue[0] && console.log(el.id, el.route.matrixValue[0]))
	return items.map(el => {
		// console.log(el.route.matrixValue);
		return {
			...el,
			route: {
				matrixValue: [
					{
						...el.route.matrixValue[0],
						locations: {
							matrixValue: JSON.parse(
								el.route.matrixValue[0].locations,
							),
						},
					},
				],
			},
		};
	});
};

export const fetchUser = (id, fields) => {
	return dispatch => {
		const q = {
			token: API_TOKEN,
			select: {
				from: 'users',
				...(fields && {fields}),
				where: {
					operation: 'AND',
					fields: [
						{
							code: 'id',
							operation: 'IS',
							value: id,
						},
					],
				},
			},
		};
		return fetch(`${API_URL_SELECT}?${qs.stringify(q)}`, {method: 'POST'})
			.then(response => response.json())
			.then(json => json.result.items)
			.catch(e => {
				console.log('fetchUser exception:', e)
				return errorResponse()
			});
	};
};

export const changeUserStatus = (id, status) => {
	return dispatch => {
		const q = {token: API_TOKEN};
		return fetch(`${API_URL_UPDATE}?${qs.stringify(q)}`, {
			method: 'POST',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			body: qs.stringify({
				update: {
					table: 'users',
					set: {status},
					where: {
						operation: 'AND',
						fields: [
							{
								code: 'id',
								operation: 'IS',
								value: id,
							},
						],
					},
				},
			}),
		})
			.then(response => response.json())
			.then(json => {
				json.success &&
				dispatch({
					type: PATCH_USER,
					payload: {status}
				});
				return json
			})
			.catch(e => {
				console.log('changeUserStatus exception:', e)
				return errorResponse()
			});
	};
};

export const fetchUserTrips = id => {
	return dispatch => {
		const q = {
			token: API_TOKEN,
			select: {
				from: 'trips',
				where: {
					operation: 'AND',
					fields: [
						{
							code: 'users',
							operation: 'AND',
							value: [
								{
									code: 'user_id',
									operation: 'IS',
									value: id,
								},
							],
						},
					],
				},
			},
		};
		return fetch(`${API_URL_SELECT}?${qs.stringify(q)}`, {method: 'POST'})
			.then(async response => {
				// console.log(await response.text());
				return response.json();
			})
			.then(json => json.result.items)
			.then(items => {
				dispatch({
					type: SET_USER_TRIPS,
					payload: tripConverter(items),
				});
			})
			.catch(e => {
				console.log('fetchUserTrips exception:', e)
				return errorResponse()
			});
	};
};

export const fetchUserRoutes = id => {
	return dispatch => {
		const q = {
			token: API_TOKEN,
			select: {
				from: 'routes_users',
				where: {
					operation: 'AND',
					fields: [
						{
							code: 'user_id',
							operation: 'IS',
							value: id,
						},
					],
				},
			},
		};
		return fetch(`${API_URL_SELECT}?${qs.stringify(q)}`, {method: 'POST'})
			.then(response => response.json())
			.then(json => json.result.items)
			.then(items => {
				dispatch({
					type: SET_USER_ROUTES,
					payload: tripConverter(items),
				});
			})
			.catch(e => {
				console.log('fetchUserRoutes exception:', e)
				return errorResponse()
			});
	};
};

export const updateUserData = id => {
	return dispatch => {
		const q = {
			token: API_TOKEN,
			select: {
				from: 'users',
				where: {
					operation: 'AND',
					fields: [
						{
							code: 'id',
							operation: 'IS',
							value: id,
						},
					],
				},
			},
		};
		return fetch(`${API_URL_SELECT}?${qs.stringify(q)}`, {method: 'POST'})
			.then(response => response.json())
			.then(json => json.result.items[0])
			.then(user => {
				dispatch({
					type: PATCH_USER,
					payload: user,
				});
				return user;
			})
			.catch(e => {
				console.log('updateUserData exception:', e)
				return errorResponse()
			});
	};
};

export const tryChangePhone = phone => {
	return async dispatch => {
		const q = {token: API_TOKEN};
		return fetch(`${API_URL_TRYCHANGEPHONE}?${qs.stringify(q)}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: qs.stringify({phone}),
		})
			.then(async response => response.json())
			.catch(e => {
				console.log('tryChangePhone exception:', e)
				return errorResponse()
			});
	};
};

export const changePhone = (code, phone) => {
	return async dispatch => {
		const q = {token: API_TOKEN};
		return fetch(`${API_URL_CHANGEPHONE}?${qs.stringify(q)}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: qs.stringify({code, phone}),
		})
			.then(response => response.json())
			.catch(e => {
				console.log('changePhone exception:', e)
				return errorResponse()
			});
	};
};
