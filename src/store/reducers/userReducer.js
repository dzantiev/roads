import {
	SET_AUTH,
	SET_USER,
	PATCH_USER,
	UPDATE_USER,
	SET_USER_TRIPS,
	SET_USER_ROUTES,
	SET_DRIVER_TRIPS,
	SET_DRIVER_ROUTES,
	SET_DRIVER_PLANING_ROUTES,
	UPDATE_USER_CAR,
	PATCH_DRIVER_ROUTES
	// REWRITE_USER_CAR,
} from '../types';

const initialState = {
	data: {
		id: null,
		name: null,
		lastname: null,
		phone: null,
		email: null,
		driver: null,
		driver_id: null,
		image: null,
		status: null,
		cars: null,
		created_date: null,
		token: null
	},
	userTrips: [],
	userRoutes: [],
	driverTrips: [],
	driverRoutes: [],
	driverPlaningRoutes: [],
};

export const userReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_AUTH:
			return {
				...state,
				isAuth: action.payload,
			};
		case SET_USER:
			return {
				...state,
				data: action.payload,
			};
		case PATCH_USER:
			return {
				...state,
				data: {
					...state.data,
					...action.payload
				},
			};
		case UPDATE_USER:
			return {
				...state,
				data: {
					...state.data,
					...action.payload,
				},
			};
		case UPDATE_USER_CAR:
			const cars = state.data.cars.matrixValue.map(el => {
				if (el.id === action.payload.id) {
					el = {
						...el,
						...action.payload.data,
					};
				}
				return el;
			});
			return {
				...state,
				data: {
					...state.data,
					cars: {
						matrixValue: cars,
					},
				},
			};
		case SET_USER_TRIPS:
			return {
				...state,
				userTrips: action.payload,
			};
		case SET_USER_ROUTES:
			return {
				...state,
				userRoutes: action.payload,
			};
		case SET_DRIVER_TRIPS:
			return {
				...state,
				driverTrips: action.payload,
			};
		case SET_DRIVER_ROUTES:
			return {
				...state,
				driverRoutes: action.payload,
			};
		case PATCH_DRIVER_ROUTES:
			const driverRoutes = state.driverRoutes.map(el => {
				if (el.id === action.payload.id) {
					el.trips = action.payload.data;
				}

				return el;
			});
			return {
				...state,
				driverRoutes,
			};
		case SET_DRIVER_PLANING_ROUTES:
			return {
				...state,
				driverPlaningRoutes: action.payload,
			};
		default:
			return state;
	}
};
