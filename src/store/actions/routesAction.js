import {
	SET_ROUTES,
	ADD_ROUTE,
	UPDATE_ROUTE,
	PATCH_DRIVER_ROUTES,
	PATCH_SORTED_ROUTES
} from '../types';
import qs from 'qs';
import {
	API_TOKEN,
	API_URL_SELECT,
	API_URL_INSERT,
	API_URL_UPDATE,
} from '@env';
import { errorResponse } from '../../variables';

export const setStoreRoutes = (state, items) => {
	return {
		type: SET_ROUTES,
		payload: {state, items},
	};
};

export const addRoute = item => {
	return {
		type: ADD_ROUTE,
		payload: item,
	};
};

export const updateRoute = (id, data) => {
	return {
		type: UPDATE_ROUTE,
		payload: {id, data},
	};
};

export const patchDriverRoutes = (id, data) => {
	return {
		type: PATCH_DRIVER_ROUTES,
		payload: {id, data},
	};
};

export const patchSortedRoutes = (id, data) => {
	return {
		type: PATCH_SORTED_ROUTES,
		payload: {id, data},
	};
};

export const routeConverter = items => {
	return items.map(el => ({
		...el,
		locations: {
			matrixValue: JSON.parse(el.locations),
		},
	}));
};

export const fetchRoutes = ({
	seats,
	category,
	sort = {},
	limit = 20,
	page = 1,
	all,
}) => {
	return async dispatch => {
		const q = {
			token: API_TOKEN,
			select: {
				page,
				from: 'routes',
				order: [`${sort.field} ${sort.order}`],
				where: {
					operation: 'AND',
					fields: [
						{
							code: 'is_active',
							operation: 'IS',
							value: 1,
						},
					],
				},
			},
		};

		category && q.select.where.fields.push({
			code: 'category',
			operation: 'IS',
			value: category,
		});

		limit && (q.select.limit = limit);

		seats && q.select.where.fields.push({
			code: 'cars',
			operation: 'AND',
			value: [
				{
					code: 'seats',
					operation: 'IS LARGER',
					value: +seats - 1,
				},
				{
					code: 'is_active',
					operation: 'IS',
					value: 1,
				},
			],
		});

		if (all)
			q.select.where.fields = q.select.where.fields.filter(
				el => el.code !== 'is_active',
			);

		return await fetch(`${API_URL_SELECT}?${qs.stringify(q)}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		})
			.then(response => response.json())
			.then(json => json.result?.items)
			.then(items => routeConverter(items))
			.catch(e => {
				console.log('fetchRoutes exception:', e);
				return errorResponse('djfhkdjfhkjb');
			});
	};
};

export const fetchRoute = id => {
	return async dispatch => {
		const q = {
			token: API_TOKEN,
			select: {
				from: 'routes',
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

		return await fetch(`${API_URL_SELECT}?${qs.stringify(q)}`, {
			method: 'POST',
		})
			.then(response => response.json())
			.then(json => json.result.items[0])
			.then(item => ({
				...item,
				locations: {
					matrixValue: JSON.parse(item.locations),
				},
			}))
			.catch(e => {
				console.log('fetchRoute exception:', e);
				return errorResponse();
			});
	};
};

export const bookedRoute = data => {
	return async dispatch => {
		const q = qs.stringify({token: API_TOKEN});
		return fetch(`${API_URL_INSERT}?${q}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: qs.stringify({
				insert: {
					table: 'routes_users',
					values: [data],
				},
			}),
		})
			.then(response => response.json())
			.catch(e => {
				console.log('bookedRoute exception:', e);
				return errorResponse();
			});
	};
};

export const createRoute = data => {
	return dispatch => {
		const q = qs.stringify({token: API_TOKEN});
		return fetch(`${API_URL_INSERT}?${q}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: qs.stringify({
				insert: {
					table: 'routes',
					values: [data],
				},
			}),
		})
			.then(response =>
				// console.log(Object.keys(response))
				response.json()
			)
			.catch(e => {
				console.log('createRoute exception:', e);
				return errorResponse();
			});
	};
};

export const patchRoute = (id, data) => {
	return dispatch => {
		const q = qs.stringify({token: API_TOKEN});
		return fetch(`${API_URL_UPDATE}?${q}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: qs.stringify({
				update: {
					table: 'routes',
					set: data,
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
			})
		})
			.then(response => response.json())
			// .then(response => response.text())
			// .then(text => console.log(text.slice(0, 450)))
			.catch(e => {
				console.log('patchRoute exception:', e);
				return errorResponse();
			});
	};
};

export const deleteRoute = routeId => {
	return dispatch => {
		const q = {token: API_TOKEN};
		return fetch(`${API_URL_UPDATE}?${qs.stringify(q)}`, {
			method: 'POST',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			body: qs.stringify({
				update: {
					table: 'routes',
					set: {
						is_active: 0,
					},
					where: {
						operation: 'AND',
						fields: [
							{
								code: 'id',
								operation: 'IS',
								value: routeId,
							},
						],
					},
				},
			}),
		})
			.then(response => response.json())
			.catch(e => {
				console.log('deleteRoute exception:', e);
				return errorResponse();
			});
	};
};
