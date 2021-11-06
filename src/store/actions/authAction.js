import {SET_USER, PATCH_USER, UPDATE_USER} from '../types';
import qs from 'qs';
import {
	API_URL_SIGNUP,
	API_URL_SIGNIN,
	API_TOKEN,
	API_URL_UPDATE,
	API_URL_ISLOGGED,
	API_URL_SIGNOUT,
} from '@env';
import {errorResponse} from '../../variables';

export const setUser = user => {
	return dispatch => {
		dispatch({
			type: SET_USER,
			payload: user,
		});
	};
};

export const updateUser = (id, data) => {
	return async dispatch => {
		dispatch({
			type: UPDATE_USER,
			payload: data,
		});
		const q = {token: API_TOKEN};
		return fetch(`${API_URL_UPDATE}?${qs.stringify(q)}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: qs.stringify({
				update: {
					table: 'users',
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
			}),
		})
			.then(async response => {
				return response.json();
			})
			.catch(e => {
				console.log('updateUser exception:', e);
				return errorResponse();
			});
	};
};

export const patchUser = (id, data) => {
	return async dispatch => {
		dispatch({
			type: PATCH_USER,
			payload: data,
		});
		const q = {token: API_TOKEN};
		return fetch(`${API_URL_UPDATE}?${qs.stringify(q)}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: qs.stringify({
				update: {
					table: 'users',
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
			}),
		})
			.then(response => response.json())
			.catch(e => {
				console.log('patchUser exception:', e);
				return errorResponse();
			});
	};
};

export const signUp = (phone, signal) => {
	return async dispatch => {
		const q = {token: API_TOKEN};
		return await fetch(`${API_URL_SIGNUP}?${qs.stringify(q)}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: qs.stringify({phone}),
			signal
		})
			.then(response => response.json())
			.catch(e => {
				console.log('signUp exception:', e);
				return errorResponse('Сервер не отвечает');
			});
	};
};

export const sendCode = (code, phone) => {
	return async dispatch => {
		const q = {token: API_TOKEN};
		return (
			fetch(`${API_URL_SIGNIN}?${qs.stringify(q)}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: qs.stringify({code, phone}),
			})
				.then(response => response.json())
				.catch(e => {
					console.log('sendCode exception:', e);
					return errorResponse();
				})
		);
	};
};

export const isLogged = (signal) => {
	return async dispatch => {
		const q = {token: API_TOKEN};
		return fetch(`${API_URL_ISLOGGED}?${qs.stringify(q)}`, {method: 'POST', signal})
			.then(response => response.json())
			.catch(e => {
				console.log('isLogged exception:', e);
				return errorResponse('Сеть не доступна');
			})
	};
};

export const signOut = () => {
	return async dispatch => {
		const q = {token: API_TOKEN};
		return fetch(`${API_URL_SIGNOUT}?${qs.stringify(q)}`, {method: 'POST'})
			.then(response => response.json())
			.catch(e => {
				console.log('signOut exception:', e);
				return errorResponse();
			});
	};
};
