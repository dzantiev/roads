import qs from 'qs';
import {API_TOKEN, API_URL_SELECT} from '@env';
import {SET_CATEGORIES, SET_CURRENT_SCREEN} from '../types';
import {errorResponse} from '../../variables';

export const setCurrentScreen = screen => {
	return dispatch => {
		dispatch({
			type: SET_CURRENT_SCREEN,
			payload: screen
		})
	}
}

export const fetchCategories = ({fields, role, state = 'categories'}) => {
	return dispatch => {
		const q = {
			token: API_TOKEN,
			select: {
				from: 'categories',
				where: {
					operation: 'AND',
					fields: [],
				},
			},
		};
		fields && (q.select.fields = fields);
		role && q.select.where.fields.push({
				code: `is_${role}`,
				operation: 'IS',
				value: 1,
			});

		return fetch(`${API_URL_SELECT}?${qs.stringify(q)}`, {method: 'POST'})
			.then(response => response.json())
			.then(json => {
				dispatch({
					type: SET_CATEGORIES,
					payload: {
						state,
						categories: json.result.items.reduce(
							(acc, el) => ({...acc, [el.key]: el.value}),
							{},
						),
					},
				});
				return json;
			})
			.catch(e => {
				console.log('fetchCategories exception:', e);
				return errorResponse();
			});
	};
};
