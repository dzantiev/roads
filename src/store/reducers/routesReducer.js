import { SET_ROUTES, PATCH_SORTED_ROUTES } from '../types';


const initialState = {
	routesList: [],
	sortedRoutesList: [],
	driverDetailRoutesList: [],
};

export const routesReducer = (state = initialState, action) =>
{
	switch (action.type)
	{
		case SET_ROUTES:
			return {
				...state,
				[action.payload.state]: action.payload.items,
			};
		case PATCH_SORTED_ROUTES:
			const sortedRoutesList = state.sortedRoutesList.map(el => {
				if (el.id === action.payload.id) {
					el.trips = action.payload.data;
				}

				return el;
			});
			return {
				...state,
				sortedRoutesList
			};
		default:
			return state;
	}
};
