import {GET_TRIPS, SET_TRIP, UPDATE_USER_TRIPS} from '../types';
import qs from 'qs';
import {tripConverter} from './userAction';
import {API_URL_SELECT, API_URL_INSERT, API_URL_DELETE, API_TOKEN, API_URL_UPDATE} from '@env';
import { errorResponse } from '../../variables';

export const setStoreTrips = (state, items) => {
	return {
		type: GET_TRIPS,
		payload: {state, items},
	};
};

export const setTrip = (index, prop, value) => {
	return {
		type: SET_TRIP,
		payload: {index, prop, value},
	};
};

export const fetchTrips = ({
	dates,
	seats,
	category,
	sort,
	limit = 20,
	page = 1,
}) => {
	return async dispatch => {
		const q = {
			token: API_TOKEN,
			select: {
				from: 'trips',
				page,
				limit,
				order: [`${sort.field} ${sort.order}`],
				where: {
					operation: 'AND',
					fields: [
						{
							code: 'date',
							operation: 'IS LARGER',
							value: dates?.start || new Date(),
						},
						{
							code: 'full',
							operation: 'IS',
							value: 0,
						},
					],
				},
			},
		};

		category && q.select.where.fields.push({
			code: 'route',
			operation: 'AND',
			value: [{
				code: 'category',
				operation: 'IS',
				value: category,
			}],
		});

		dates.end && q.select.where.fields.push({
			code: 'date',
			operation: 'IS SMALLER',
			value: new Date(dates.end),
		});
		seats && q.select.where.fields.push({
			code: 'free_seats',
			operation: 'IS LARGER',
			value: +seats - 1,
		});

		return await fetch(`${API_URL_SELECT}?${qs.stringify(q)}`, {method: 'post'})
			.then(response => response.json())
			.then(json => json.result?.items || [])
			.then(items => {
				// console.log('items', items);
				return tripConverter(items)
			})
			.catch(e => {
				console.log('fetchTrips exception:', e);
				return errorResponse();
			});
	};
};

export const fetchTripsByRouteID = (
	routeID,
	isActual = true
) => {
	return async dispatch => {
		const q = {
			token: API_TOKEN,
			select: {
				from: 'trips',
				where: {
					operation: 'AND',
					fields: [
						{
							code: 'route_id',
							operation: 'IS',
							value: +routeID,
						},
					],
				},
			},
		};

		isActual && q.select.where.fields.push({
			code: 'date',
			operation: 'IS LARGER',
			value: new Date(),
		});

		return await fetch(`${API_URL_SELECT}?${qs.stringify(q)}`, {method: 'post'})
			.then(response => response.json())
			.then(json => json.result?.items || [])
			.then(items => {
				// console.log('fetchTripsByRouteID items', items);
				return tripConverter(items)
			})
			.catch(e => {
				console.log('fetchTripsByRouteID exception:', e);
				return errorResponse();
			});
	};
};

export const fetchTrip = id => {
	return async dispatch => {
		const q = {
			token: API_TOKEN,
			select: {
				from: 'trips',
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

		return await fetch(`${API_URL_SELECT}?${qs.stringify(q)}`, {method: 'post'})
			.then(response => response.json())
			.then(json => json.result.items)
			.then(items => tripConverter(items)[0])
			.catch(e => {
				console.log('fetchTrip exception:', e);
				return errorResponse();
			});
	};
};

export const bookedTrip = data => {
	return async dispatch => {
		const q = qs.stringify({token: API_TOKEN});

		return fetch(`${API_URL_INSERT}?${q}`, {
			method: 'POST',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			body: qs.stringify({
				insert: {
					table: 'trips_users',
					values: [data],
				},
			}),
		})
			.then(response => response.json())
			// .then(response => response.text())
			// .then(text => console.log(text.slice(0, 500)))
			.catch(e => {
				console.log('bookedTrip exception:', e);
				return errorResponse();
			});
	};
};

export const createTrip = data => {
	return dispatch => {
		const q = {token: API_TOKEN};
		return fetch(`${API_URL_INSERT}?${qs.stringify(q)}`, {
			method: 'POST',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			body: qs.stringify({
				insert: {
					table: 'trips',
					values: [data],
				},
			}),
		})
			.then(response => response.json())
			.catch(e => {
				console.log('createTrip exception:', e);
				return errorResponse();
			});
	};
};

export const leaveTrip = (tripId, userId) => {
	return dispatch => {
		const q = {token: API_TOKEN};
		return fetch(`${API_URL_DELETE}?${qs.stringify(q)}`, {
			method: 'POST',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			body: qs.stringify({
				delete: {
					table: 'trips_users',
					where: {
						operation: 'AND',
						fields: [
							{
								code: 'trip_id',
								operation: 'IS',
								value: tripId,
							},
							{
								code: 'user_id',
								operation: 'IS',
								value: userId,
							},
						],
					},
				},
			}),
		})
			.then(response => response.json())
			// .then(response => response.text())
			// .then(text => console.log(text.slice(0, 500)))
			.catch(e => {
				console.log('leaveTrip exception:', e);
				return errorResponse();
			});
	};
};

export const patchTrip = (tripId, data) => {
	return dispatch => {
		const q = {token: API_TOKEN};
		return fetch(`${API_URL_UPDATE}?${qs.stringify(q)}`, {
			method: 'POST',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			body: qs.stringify({
				update: {
					table: 'trips',
					set: data,
					where: {
						operation: 'AND',
						fields: [
							{
								code: 'id',
								operation: 'IS',
								value: tripId,
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
					type: UPDATE_USER_TRIPS,
					payload: {
						id: tripId,
						data,
					},
				});
				return json;
			})
			.catch(e => {
				console.log('patchTrip exception:', e);
				return errorResponse();
			});
	};
};

export const deleteTrip = (tripId) => {
	return dispatch => {
		const q = {token: API_TOKEN};
		return fetch(`${API_URL_DELETE}?${qs.stringify(q)}`, {
			method: 'POST',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			body: qs.stringify({
				delete: {
					table: 'trips',
					where: {
						operation: 'AND',
						fields: [
							{
								code: 'id',
								operation: 'IS',
								value: tripId,
							},
						],
					},
				},
			}),
		})
			.then(async response => {
				return response.json();
			})
			.catch(e => {
				console.log('deleteTrip exception:', e);
				return errorResponse();
			});
	};
};
