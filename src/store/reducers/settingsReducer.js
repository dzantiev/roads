import {SET_CATEGORIES, SET_CURRENT_SCREEN} from '../types';


const initialState = {
	categories: {},
	roleCategories: {},
	currentScreen: null
};

export const settingsReducer = (state = initialState, action) =>
{
	switch (action.type)
	{
		case SET_CURRENT_SCREEN:
			return {
				...state,
				currentScreen: action.payload
			};
		case SET_CATEGORIES:
			return {
				...state,
				[action.payload.state]: action.payload.categories,
			};
		default:
			return state;
	}
};
