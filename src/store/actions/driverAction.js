import {
	SET_DRIVER_TRIPS,
	SET_DRIVER_ROUTES,
	SET_DRIVER_PLANING_ROUTES,
} from '../types';
import qs from 'qs';
import {API_TOKEN, API_URL_SELECT, API_URL_INSERT} from '@env';
import {tripConverter} from './userAction';
import { errorResponse } from '../../variables';

export const fetchDriverTrips = (id, isActual = true) => {
	return dispatch => {
		const q = {
			token: API_TOKEN,
			select: {
				from: 'trips',
				where: {
					operation: 'AND',
					fields: [
						{
							code: 'route',
							operation: 'AND',
							value: [{
								code: 'driver_id',
								operation: 'IS',
								value: id,
							}],
						},
						...(isActual && [{
							code: 'date',
							operation: 'IS LARGER',
							value: new Date(),
						}]),
					],
				},
			},
		};
		return fetch(`${API_URL_SELECT}?${qs.stringify(q)}`, {method: 'POST'})
			.then(response => response.json())
			.then(json => json.result.items)
			.then(items => {
				dispatch({
					type: SET_DRIVER_TRIPS,
					payload: tripConverter(items),
				});
			})
			.catch(e => {
				console.log('fetchDriverTrips exception:', e);
				return errorResponse();
			});
	};
};

export const fetchDriverRoutes = (id, all) => {
	return dispatch => {
		const q = {
			token: API_TOKEN,
			select: {
				from: 'routes',
				where: {
					operation: 'AND',
					fields: [
						{
							code: 'driver_id',
							operation: 'IS',
							value: id,
						},
						{
							code: 'is_active',
							operation: 'IS',
							value: 1,
						},
					],
				},
			},
		};

		if (all) q.select.where.fields =  q.select.where.fields.filter(el => el.code !== 'is_active')

		return fetch(`${API_URL_SELECT}?${qs.stringify(q)}`, {method: 'POST'})
			.then(response => response.json())
			.then(json => json.result.items)
			.then(items => {
				const routes = items.map(el => ({
					...el,
					locations: {
						matrixValue: JSON.parse(el.locations),
					},
				}));
				dispatch({
					type: SET_DRIVER_ROUTES,
					payload: routes,
				});
			})
			.catch(e => {
				console.log('fetchDriverRoutes exception:', e);
				return errorResponse();
			});
	};
};

export const fetchDriverPlaningRoutes = id => {
	return dispatch => {
		const q = {
			token: API_TOKEN,
			select: {
				from: 'routes_users',
				where: {
					operation: 'AND',
					fields: [
						{
							code: 'route',
							operation: 'AND',
							value: [{
								code: 'driver_id',
								operation: 'IS',
								value: id,
							}],
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
					type: SET_DRIVER_PLANING_ROUTES,
					payload: tripConverter(items),
				});
			})
			.catch(e => {
				console.log('fetchDriverPlaningRoutes exception:', e)
				return errorResponse()
			});
	};
};

export const createDriver = (data) =>
{
	return (dispatch) =>
	{
		const q = {token: API_TOKEN};
		return fetch(`${API_URL_INSERT}?${qs.stringify(q)}`, {
			method: 'POST',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			body: qs.stringify({
				insert: {
					table: 'drivers_data',
					values: [data],
				},
			}),
		})
			.then(response => response.json())
			.catch(e => {
				console.log('createDriver exception:', e);
				return errorResponse();
			});
	};
};

export const fetchDrivers = ({fields, isRoutes = false, limit = 20, page = 1}) => {
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
							code: 'driver',
							operation: 'AND',
							value: [{
								code: 'status',
								operation: 'IS',
								value: 'rs',
							}],
						},
						isRoutes &&
						{
							code: 'routes_count',
							operation: 'IS LARGER',
							value: 0,
						},
					],
				},
				limit,
				page
			},
		};
		return fetch(`${API_URL_SELECT}?${qs.stringify(q)}`, {method: 'POST'})
			.then(response => response.json())
			.then(json => json.result.items)
			.catch(e => {
				console.log('fetchDrivers exception:', e);
				return errorResponse();
			});
	};
};

export const fetchDriver = id => {
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
			.then(json => json.result.items)
			.catch(e => {
				console.log('fetchDriver exception:', e);
				return errorResponse();
			});
	};
};


export const fetchAnyDriverTrips = id => {
	return async dispatch => {
		const q = {
			token: API_TOKEN,
			select: {
				from: 'trips',
			},
		};
		q.select.where = {
			operation: 'AND',
			fields: [
				{
					code: 'date',
					operation: 'IS LARGER',
					value: new Date(),
				},
				{
					code: 'driver',
					operation: 'AND',
					value: [{
						code: 'id',
						operation: 'IS',
						value: id,
					}],
				},
				{
					code: 'full',
					operation: 'IS EMPTY',
				},
			],
		};

		return await fetch(`${API_URL_SELECT}?${qs.stringify(q)}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		})
			.then(response => response.json())
			.then(json => json.result.items)
			.then(items => tripConverter(items))
			.catch(e => {
				console.log('fetchAnyDriverTrip exception:', e);
				return errorResponse();
			});
	};
};

export const fetchAnyDriverRoutes = id => {
	return async dispatch => {
		const q = {
			token: API_TOKEN,
			select: {
				from: 'routes',
			},
		};
		q.select.where = {
			operation: 'AND',
			fields: [
				{
					code: 'driver_id',
					operation: 'IS',
					value: id,
				},
				{
					code: 'is_active',
					operation: 'IS',
					value: 1,
				},
			],
		};

		return await fetch(`${API_URL_SELECT}?${qs.stringify(q)}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		})
			.then(response => response.json())
			.then(json => json.result.items)
			.catch(e => {
				console.log('fetchAnyDriverRoute exception:', e);
				return errorResponse();
			});
	};
};
