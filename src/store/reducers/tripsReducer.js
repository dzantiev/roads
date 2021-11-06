import { GET_TRIPS, SET_TRIP } from '../types';


const initialState = {
	tripsList: [],
	sortedTripsList: [],
	driverDetailTripsList: [],
};

export const tripsReducer = (state = initialState, action) =>
{
	switch (action.type)
	{
	case GET_TRIPS: return {
		...state,
		[action.payload.state]: action.payload.items,
	};
	case SET_TRIP: return {
		...state,
		tripsList: state.tripsList.map((el, i) =>
		{
			if (i === action.payload.index)
				el[action.payload.prop] = action.payload.value;
			return el;
		}),
	};
	default:
		return state;
	}
};
