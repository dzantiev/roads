import React, {useCallback, useEffect, useMemo, useState, useRef} from 'react';
import {
	SafeAreaView,
	RefreshControl,
	Linking,
	ActivityIndicator,
	Platform,
	FlatList,
} from 'react-native';
import {connect} from 'react-redux';
import styles from './styles';
import {
	Header,
	Trip,
	PersonalRout,
	RoutesTripsSwitcher,
	FilterTripsBar,
	AppText,
} from '../../../components';
import {fetchTrips, setStoreTrips} from '../../../store/actions/tripsAction';
import {fetchRoutes, setStoreRoutes} from '../../../store/actions/routesAction';
import {fetchUserTrips, patchUser} from '../../../store/actions/userAction';
import {setCurrentScreen} from '../../../store/actions/settingsAction';
import {
	createPushToken,
	fetchPushToken,
	updatePushToken,
} from '../../../store/actions/pushAction';
import {
	smallTripFormatter,
	smallRouteFormatter,
} from '../../../services';
import {
	dates,
	defaultTripsParams,
	defaultSortedField,
	itemsLimit,
	screensLinks,
	sortFields,
	defaultRouteParams,
} from '../../../variables';
import {fcmService} from '../../../services/FCMService';
import {localNotificationService} from '../../../services/LocalNotificationService';
import AppMetrica from 'react-native-appmetrica';

const MainTrips = ({
	navigation,
	route,
	USER,
	SORTED_TRIPS_LIST,
	SET_STORE_TRIPS,
	SORTED_ROUTES_LIST,
	SET_STORE_ROUTES,
	FETCH_ROUTES,
	FETCH_TRIPS,
	FETCH_USER_TRIPS,
	CREATE_PUSH_TOKEN,
	FETCH_PUSH_TOKEN,
	UPDATE_PUSH_TOKEN,
	PATCH_USER,
	CATEGORIES,
	CURRENT_SCREEN,
	SET_CURRENT_SCREEN,
}) => {
	// ============== push notif and linking settings ==============
	useEffect(() => {
		fcmService.register(onRegister, onNotification, onOpenNotification);
		localNotificationService.configure(onOpenNotification);
	}, []);

	const onRegister = async token => {
		await getPushToken(token);
	};

	const onNotification = notify => {
		if (Platform.OS === 'ios')
			localNotificationService.showNotificationIOS({
				...notify.notification,
				data: notify.data,
			});
		else
			localNotificationService.showNotification({
				...JSON.parse(notify.data.notification),
				data: notify.data,
			});
	};

	const onOpenNotification = async notify => {
		notify?.link && goFromLink(notify.link);
	};

	const goFromLink = url => {
		console.log('start url', url);
		const params = url.split('://')[1];

		if (params.startsWith('roads-go')) {
			var [_, link, id] = params.split('/');
		} else {
			var [link, id] = url.split('://')[1].split('/');
		}

		navigation.navigate(screensLinks[link].stack, {
			screen: screensLinks[link].screen,
			params: id ? {screen: id} : {reload: true},
		});
	};

	const getPushToken = async token => {
		PATCH_USER({token});
		const response = await FETCH_PUSH_TOKEN(token);
		if (!+response.result.total_items) {
			await CREATE_PUSH_TOKEN(USER.id, token);
		} else {
			UPDATE_PUSH_TOKEN(token, {date: new Date()});
		}
		return token;
	};

	useEffect(() => {
		Linking.addEventListener('url', callback);
		Linking.getInitialURL().then(url => url && goFromLink(url));
		return () => Linking.removeEventListener('url', callback);
	}, []);

	const callback = ({url}) => goFromLink(url);

	// ============== To top scroller ==============

	const routesFlatList = useRef();
	const tripsFlatList = useRef();

	useEffect(() => {
		AppMetrica.reportEvent(route.name);
	}, []);

	useEffect(() => {
		const unsubscribe = navigation.addListener('tabPress', (e) => {
			if (CURRENT_SCREEN === route.name) {
				isRoutes
					? routesFlatList.current.scrollToOffset({offset: 0, animated: true})
					: tripsFlatList.current.scrollToOffset({offset: 0, animated: true});
			}
			else {
				AppMetrica.reportEvent(route.name);
				SET_CURRENT_SCREEN(route.name);
			}
		});
		return unsubscribe;
	}, [CURRENT_SCREEN]);

	// ============== MainTrips screen work ==============
	const defaultFilters = {
		sort: '',
		category: '',
	};
	const defaultTripsFilters = {
		date: dates,
		seats: -1,
		...defaultFilters,
	};
	const [tripFilters, setTripFilters] = useState(defaultTripsFilters);
	const [routeFilters, setRouteFilters] = useState(defaultFilters);

	const [isTripsGettingBlock, setIsTripsGettingBlock] = useState(false);
	const [isTripsLoading, setIsTripsLoading] = useState(false);
	const [isTripsFilterLoading, setIsTripsFilterLoading] = useState(true);
	const [isRoutesGettingBlock, setIsRoutesGettingBlock] = useState(false);
	const [isRoutesLoading, setIsRoutesLoading] = useState(false);
	const [isRoutesFilterLoading, setIsRoutesFilterLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	const [tripsPage, setTripsPage] = useState(1);
	const [routesPage, setRoutesPage] = useState(1);

	const [isRoutes, setIsRoutes] = useState(true);

	const tripsList = useMemo(() => {
		return SORTED_TRIPS_LIST?.map(el => smallTripFormatter(el)) || [];
	}, [SORTED_TRIPS_LIST]);
	const routesList = useMemo(() => {
		return SORTED_ROUTES_LIST?.map(el => smallRouteFormatter(el, routeFilters.seats + 1)) || [];
	}, [SORTED_ROUTES_LIST]);

	const setDefailtTripsFilter = () => {
		setTripFilters(defaultTripsFilters);
	};
	const setDefailtRoutesFilters = () => {
		setRouteFilters(defaultFilters);
	};

	const getDefaultTrips = async () => {
		return await FETCH_TRIPS(defaultTripsParams);
	};
	const getTrips = useCallback(async page => {
		const d = (new Date()).toISOString();
		const nowDate = d.slice(0,10);
		const startDate = nowDate === tripFilters.date.start
			? tripFilters.date.start + d.slice(10)
			: tripFilters.date.start;

		return await FETCH_TRIPS({
			dates: {
				start: startDate,
				end: tripFilters.date.end + 'T23:59:59.999Z',
			},
			seats: +tripFilters.seats + 1,
			category: tripFilters.category,
			sort: sortFields[tripFilters.sort || defaultSortedField],
			limit: itemsLimit,
			page,
		});
	}, [tripFilters]);
	const getDefaultRoutes = async () => {
		return await FETCH_ROUTES(defaultRouteParams);
	};
	const getRoutes = useCallback(async page => {
		return await FETCH_ROUTES({
			seats: +routeFilters.seats + 1,
			category: routeFilters.category,
			sort: sortFields[routeFilters.sort || defaultSortedField],
			limit: itemsLimit,
			page,
		});
	}, [routeFilters]);

	const loadData = async () => {
		SET_STORE_TRIPS('sortedTripsList', await getDefaultTrips());
		setIsTripsFilterLoading(false);
		SET_STORE_ROUTES('sortedRoutesList', await getDefaultRoutes());
		setIsRoutesFilterLoading(false);
	};
	const updateTrips = useCallback(async () => {
		setIsTripsFilterLoading(true);
		const items = await getTrips(1);
		SET_STORE_TRIPS('sortedTripsList', items);
		setTripsPage(1);
		setIsTripsFilterLoading(false);
		setIsTripsGettingBlock(false);
	}, [getTrips]);
	const updateRoutes = useCallback(async () => {
		setIsRoutesFilterLoading(true);
		const items = await getRoutes(1);
		SET_STORE_ROUTES('sortedRoutesList', items);
		setRoutesPage(1);
		setIsRoutesFilterLoading(false);
		setIsRoutesGettingBlock(false);
	}, [getRoutes]);

	const [firstLoad, setFirstLoad] = useState(true);
	useEffect(async () => {
		if (firstLoad) {
			loadData();
			FETCH_USER_TRIPS(USER.id);
			setFirstLoad(false);
		}
		!firstLoad && await updateTrips();
	}, [tripFilters]);
	useEffect(async () => {
		!firstLoad && await updateRoutes();
	}, [routeFilters]);

	const onTripsRefresh = useCallback(async () => {
		setTripsPage(1);
		setRefreshing(true);
		SET_STORE_TRIPS('sortedTripsList', await getTrips(1));
		setIsTripsGettingBlock(false);
		setRefreshing(false);
	}, [getTrips]);
	const onRoutesRefresh = useCallback(async () => {
		setRoutesPage(1);
		setRefreshing(true);
		SET_STORE_ROUTES('sortedRoutesList', await getRoutes(1));
		setIsRoutesGettingBlock(false);
		setRefreshing(false);
	}, [getRoutes]);

	const getMoreTrips = useCallback(async () => {
		if (isTripsLoading) return;

		setIsTripsLoading(true);
		const page = tripsPage + 1;
		const items = await getTrips(page);
		setTripsPage(page);
		items.length
			? await SET_STORE_TRIPS('sortedTripsList', [
				...SORTED_TRIPS_LIST,
				...items,
			])
			: setIsTripsGettingBlock(true);
		setIsTripsLoading(false);
	}, [isTripsLoading, tripsPage, getTrips, SORTED_TRIPS_LIST]);

	const getMoreRoutes = useCallback(async () => {
		if (isRoutesLoading) return;

		setIsRoutesLoading(true);
		const page = routesPage + 1;
		const items = await getRoutes(page);
		setRoutesPage(page);
		items.length
			? await SET_STORE_ROUTES('sortedRoutesList', [
				...SORTED_ROUTES_LIST,
				...items,
			])
			: setIsRoutesGettingBlock(true);
		setIsRoutesLoading(false);
	}, [isRoutesLoading, routesPage, SORTED_ROUTES_LIST]);

	const keyExtractor = useCallback(el => el.id, []);
	// ========== TRIPS ==========
	const tripTemplate = ({item, index}) => {
		return <Trip
			{...item}
			testID={`trip${index}`}
			categories={CATEGORIES}
			style={styles.trip}
			onPress={() => {
				navigation.navigate('TripDetailStack', {
					screen: 'PlaningTripDetail',
					params: {
						id: item.id,
						state: 'sortedTripsList',
					},
				});
			}}
		/>
	};
	const tripsHeader = useCallback(() => (
		<>
			<FilterTripsBar
				style={styles.filter}
				currentValues={tripFilters}
				onFiltersChange={setTripFilters}
				onClear={setDefailtTripsFilter}
				categories={CATEGORIES}
				defaultFilters={defaultTripsFilters}
			/>
			{!isTripsFilterLoading && !tripsList.length && (
				<AppText style={styles.flatList}>
					Пока поездки не запланированы
				</AppText>
			)}
			{isTripsFilterLoading && (
				<ActivityIndicator
					style={{marginBottom: 20}}
					color={'#76A829'}
				/>
			)}
		</>
	), [tripFilters, isTripsFilterLoading, tripsList]);
	const tripsFooter = useCallback(() => {
		return isTripsLoading
			? <ActivityIndicator color={'#76A829'} />
			: <></>
	}, [isTripsLoading]);
	const tripsListView = useCallback(() => {
		return (
			<FlatList
				ref={tripsFlatList}
				data={tripsList}
				renderItem={tripTemplate}
				keyExtractor={keyExtractor}
				style={styles.flatList}
				refreshing={refreshing}
				onEndReached={() => !isTripsGettingBlock && getMoreTrips()}
				onEndReachedThreshold={0.3}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onTripsRefresh}
						colors={['#76A829']}
						tintColor={'#76A829'}
					/>
				}
				ListHeaderComponent={tripsHeader}
				ListFooterComponent={tripsFooter}
			/>
		);
	}, [tripsList, tripsHeader, tripsFooter, refreshing, getMoreTrips, isTripsGettingBlock, onTripsRefresh]);
	// ========== TRIPS ==========

	// ========== ROUTES ==========
	const routeTemplate = ({item, index}) => {
		return <PersonalRout
			{...item}
			testID={`route${index}`}
			categories={CATEGORIES}
			style={styles.trip}
			onPress={() => {
				navigation.navigate('TripDetailStack', {
					// screen: 'PersonalTripDetail',
					screen: 'RouteDetail',
					params: {
						id: item.id,
						state: 'sortedRoutesList',
						carId: item.carId,
					},
				});
			}}
		/>
	};
	const routeHeader = useCallback(() => (
		<>
			<FilterTripsBar
				style={styles.filter}
				currentValues={routeFilters}
				onFiltersChange={setRouteFilters}
				hideDates
				onClear={setDefailtRoutesFilters}
				categories={CATEGORIES}
				defaultFilters={defaultFilters}
			/>
			{!isRoutesFilterLoading && !routesList.length && (
				<AppText style={styles.flatList}>
					Видимо маршруты еще не проложены
				</AppText>
			)}
			{isRoutesFilterLoading && (
				<ActivityIndicator
					style={{marginBottom: 20}}
					color={'#76A829'}
				/>
			)}
		</>
	), [routeFilters, isRoutesFilterLoading, routesList]);
	const routesFooter = useCallback(() => {
		return isRoutesLoading
			? <ActivityIndicator color={'#76A829'} />
			: <></>
	}, [isRoutesLoading]);
	const routesListView = useCallback(() => {
		return (
			<FlatList
				ref={routesFlatList}
				data={routesList}
				renderItem={routeTemplate}
				keyExtractor={keyExtractor}
				style={styles.flatList}
				refreshing={refreshing}
				onEndReached={() => !isRoutesGettingBlock && getMoreRoutes()}
				onEndReachedThreshold={0.3}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRoutesRefresh}
						colors={['#76A829']}
						tintColor={'#76A829'}
					/>
				}
				ListHeaderComponent={routeHeader}
				ListFooterComponent={routesFooter}
			/>
		);
	}, [routesList, routeHeader, routesFooter, refreshing, getMoreRoutes, isRoutesGettingBlock, onRoutesRefresh]);
	// ========== ROUTES ==========

	return (
		<SafeAreaView style={styles.area}>
			<Header city={'Владикавказ'} testID={'MainHeader'} style={styles.header} />
			<RoutesTripsSwitcher
				isRoutes={isRoutes}
				onRoutesPress={() => setIsRoutes(true)}
				onTripsPress={() => setIsRoutes(false)}
				style={{
					marginBottom: 16,
					marginHorizontal: 16,
				}}
			/>
			{
				isRoutes
					? routesListView()
					: tripsListView()
			}
		</SafeAreaView>
	);
};

const mapStateToProps = state => {
	return {
		SORTED_TRIPS_LIST: state.trips.sortedTripsList,
		SORTED_ROUTES_LIST: state.routes.sortedRoutesList,
		USER_TRIPS: state.user.userTrips,
		USER: state.user.data,
		CATEGORIES: state.settings.categories,
		CURRENT_SCREEN: state.settings.currentScreen,
	};
};
const mapDispatchToProps = dispatch => {
	return {
		FETCH_ROUTES: data => dispatch(fetchRoutes(data)),
		FETCH_TRIPS: data => dispatch(fetchTrips(data)),
		FETCH_USER_TRIPS: id => dispatch(fetchUserTrips(id)),
		CREATE_PUSH_TOKEN: (id, token) => dispatch(createPushToken(id, token)),
		FETCH_PUSH_TOKEN: token => dispatch(fetchPushToken(token)),
		UPDATE_PUSH_TOKEN: (token, data) =>
			dispatch(updatePushToken(token, data)),
		PATCH_USER: data => dispatch(patchUser(data)),
		SET_STORE_TRIPS: (state, data) => dispatch(setStoreTrips(state, data)),
		SET_STORE_ROUTES: (state, data) =>
			dispatch(setStoreRoutes(state, data)),
		SET_CURRENT_SCREEN: (screen) => dispatch(setCurrentScreen(screen)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(MainTrips);
