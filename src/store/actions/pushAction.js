import qs from 'qs';
import {Platform} from 'react-native';
import {
	API_TOKEN,
	API_URL_SELECT,
	API_URL_INSERT,
	API_URL_DELETE,
	API_URL_UPDATE,
} from '@env';
import { errorResponse } from '../../variables';

export const createPushToken = (userId, token, date) => {
	return async dispatch => {
		const q = qs.stringify({token: API_TOKEN});
		return await fetch(`${API_URL_INSERT}?${q}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: qs.stringify({
				insert: {
					table: 'notifications_tokens',
					values: [
						{
							user_id: userId,
							token: token,
							platform: Platform.OS,
							date: new Date(),
						},
					],
				},
			}),
		})
			.then(response => response.json())
			.catch(e => {
				console.log('createPushToken exception:', e)
				return errorResponse()
			});
	};
};

export const fetchPushToken = token => {
	return async dispatch => {
		const q = {
			token: API_TOKEN,
			select: {
				from: 'notifications_tokens',
				where: {
					operation: 'AND',
					fields: [
						{
							code: 'token',
							operation: 'IS',
							value: token,
						},
					],
				},
			},
		};
		return await fetch(`${API_URL_SELECT}?${qs.stringify(q)}`, {
			method: 'post',
		})
			.then(response => response.json())
			.catch(e => {
				console.log('fetchPushToken exception:', e)
				return errorResponse()
			});
	};
};

export const updatePushToken = (token, data) => {
	return async dispatch => {
		const q = {token: API_TOKEN};
		return await fetch(`${API_URL_UPDATE}?${qs.stringify(q)}`, {
			method: 'POST',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			body: qs.stringify({
				update: {
					table: 'notifications_tokens',
					set: data,
					where: {
						operation: 'AND',
						fields: [
							{
								code: 'token',
								operation: 'IS',
								value: token,
							},
						],
					},
				},
			}),
		})
			.then(response => response.json())
			.catch(e => {
				console.log('updatePushToken exception:', e)
				return errorResponse()
			});
	};
};

export const deletePushToken = token => {
	return async dispatch => {
		console.log('deletePushToken', token);
		const q = {token: API_TOKEN};
		return await fetch(`${API_URL_DELETE}?${qs.stringify(q)}`, {
			method: 'POST',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			body: qs.stringify({
				delete: {
					table: 'notifications_tokens',
					where: {
						operation: 'AND',
						fields: [
							{
								code: 'token',
								operation: 'IS',
								value: token,
							},
						],
					},
				},
			}),
		})
			.then(response => response.json())
			.catch(e => {
				console.log('deletePushToken exception:', e)
				return errorResponse()
			});
	};
};
