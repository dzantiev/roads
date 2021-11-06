import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import {
	userReducer,
	routesReducer,
	tripsReducer,
	settingsReducer
} from "./reducers";

const rootReducer = combineReducers({
	user: userReducer,
	routes: routesReducer,
	trips: tripsReducer,
	settings: settingsReducer
})


export default createStore(rootReducer, applyMiddleware(thunk))
