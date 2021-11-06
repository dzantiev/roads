import React, {
	useState,
	useEffect,
	useMemo,
	useCallback,
	useRef,
} from 'react';
import {
	SafeAreaView,
	View,
	ScrollView,
	TouchableOpacity,
	Linking,
	RefreshControl,
	ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import {API_URL} from '@env';
import {
	ProfilePreview,
	GreenBtn,
	AppText,
	AppBoldText,
	Trip,
	DriverStatus,
	RoleSwitherBtn,
	PersonalRout,
	ModalSelect,
	ShareBtn,
} from '../../../components';
import {
	AS_ORGANIZER,
	AS_TOURIST,
	REQUEST_CREATED,
	REQUEST_SUCCESS,
	REQUEST_FAILED,
	ABOUT_LINKS,
	appPrefix,
	shareDriver,
	mail,
	about,
	instagram,
	DRIVER,
} from '../../../variables';
import {styles} from './styles';
import CarPreview from '../../../components/CarPreview';
import {
	fetchUserTrips,
	fetchUserRoutes,
	changeUserStatus,
	updateUserData,
} from '../../../store/actions/userAction';
import {
	fetchDriverTrips,
	fetchDriverRoutes,
} from '../../../store/actions/driverAction';
import {
	fetchCategories,
	setCurrentScreen,
} from '../../../store/actions/settingsAction';
import {
	onPhoneInput,
	smallTripFormatter,
	smallRouteFormatter,
	planingRouteToTripFormatter,
	onShare,
} from '../../../services';
import {BurgerSvg} from '../../../svg';
import AppMetrica from 'react-native-appmetrica';


const PersonalCabinet = ({
	navigation,
	route,
	USER,
	USER_TRIPS,
	USER_ROUTES,
	FETCH_USER_TRIPS,
	FETCH_USER_ROUTES,
	DRIVER_TRIPS,
	DRIVER_ROUTES,
	FETCH_DRIVER_TRIPS,
	FETCH_DRIVER_ROUTES,
	CHANGE_USER_STATUS,
	UPDATE_USER_DATA,
	FETCH_CATEGORIES,
	CATEGORIES,
	CURRENT_SCREEN,
	SET_CURRENT_SCREEN,
}) => {
	// ============== To top scroller ==============

	const mainScrollView = useRef();

	useEffect(() => {
		const unsubscribe = navigation.addListener('tabPress', (e) => {
			if (CURRENT_SCREEN === route.name) {
				mainScrollView.current.scrollTo({y: 0, animated: true});
			}
			else {
				AppMetrica.reportEvent(route.name);
				SET_CURRENT_SCREEN(route.name);
			}
		});
		return unsubscribe;
	}, [CURRENT_SCREEN]);

	// ============== screen work ==============

	const [refreshing, setRefreshing] = useState(false);
	const [aboutVisible, setAboutVisible] = useState(false);
	const userTrips = useMemo(() => {
		return USER_TRIPS.map(smallTripFormatter);
	}, [USER_TRIPS]);
	const userRoutes = useMemo(() => {
		return USER_ROUTES.map(planingRouteToTripFormatter);
	}, [USER_ROUTES]);
	const driverTrips = useMemo(() => {
		return DRIVER_TRIPS.map(el => smallTripFormatter(el));
	}, [DRIVER_TRIPS]);
	const driverRoutes = useMemo(() => {
		return DRIVER_ROUTES.map(el => smallRouteFormatter(el));
	}, [DRIVER_ROUTES]);
	const [isTripsLoading, setIsTripsLoading] = useState(true);
	const [isRoutesLoading, setIsRoutesLoading] = useState(true);
	const [isCarsLoading, setIsCarsLoading] = useState(true);

	const userCarsFormatter = useCallback(user =>
		user.cars.matrixValue.map(car => {
			return {
				id: car.id,
				company: car.company,
				model: car.model,
				year: car.year,
				imgs: car.images.map(el => API_URL + el.localPath),
				isApproved: car.is_approved,
			};
		}), []);
	const [userCars, setUserCars] = useState([]);

	const avatar = USER?.image[0]?.sizes?.main?.localPath
		? API_URL + USER.image[0].sizes.main.localPath
		: null;

	const loadData = async () => {
		if (USER.status[0] === AS_TOURIST) {
			await FETCH_USER_TRIPS(USER.id);
			setIsTripsLoading(false);
			await FETCH_USER_ROUTES(USER.id);
			setIsRoutesLoading(false);
		} else {
			await FETCH_DRIVER_TRIPS(USER.id);
			setIsTripsLoading(false);
			await FETCH_DRIVER_ROUTES(USER.id);
			setIsRoutesLoading(false);
		}
		setUserCars(userCarsFormatter(USER));
		setIsCarsLoading(false);
	};

	useEffect(() => {
		FETCH_CATEGORIES({
			fields: ['key', 'value'],
			role: USER.role[0],
			state: 'roleCategories',
		});
		AppMetrica.reportEvent(route.name);
	}, []);

	useEffect(() => {
		loadData();
	}, [USER]);

	const userStatusSwitcher = useCallback(async () => {
		await CHANGE_USER_STATUS(
			USER.id,
			USER.status[0] === AS_TOURIST ? [AS_ORGANIZER] : [AS_TOURIST],
		);
		setIsTripsLoading(true);
		setIsRoutesLoading(true);
	}, [USER]);

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await UPDATE_USER_DATA(USER.id);
		setRefreshing(false);
	}, [USER]);

	useEffect(() => {
		if (route.params?.reload) onRefresh();
	}, [route]);

	const onUserTripPress = (el, isOld = false) => {
		el.isTrip &&
			navigation.navigate('TripDetailStack', {
				screen: 'PlaningTripDetail',
				params: {
					id: el.id,
					state: 'tripsList',
					isOld,
				},
			});
	};

	const shareLink = useMemo(() => appPrefix + shareDriver(USER.id));

	const statusBtn = (text, style, cb) => (
		<DriverStatus
			style={styles.status}
			status={style}
			text={text}
			onPress={cb}
		/>
	);

	const statusButtons = useCallback(user => {
		if (user.driver.matrixValue.length) {
			const driver = user.driver.matrixValue[0];
			switch (driver.status[0]) {
				case REQUEST_CREATED:
					return statusBtn('Заявка на рассмотрении', 'waiting');
				case REQUEST_FAILED:
					return statusBtn('Заявка отклонена', 'fail');
				default:
					return (
						<RoleSwitherBtn
							testID={'roleSwitherBtn'}
							isDriver={user.status[0] === AS_ORGANIZER}
							style={styles.status}
							onPress={() => userStatusSwitcher()}
						/>
					);
			}
		} else
			return statusBtn('Стать организатором', 'request', () => {
				navigation.navigate('PersonalDevStack', {
					screen: 'RequestOnOrganizer',
				});
			});
	}, [userStatusSwitcher]);

	const addBtn = (text, testID, onPress) => (
		<TouchableOpacity
			testID={testID}
			style={styles.addBtn}
			onPress={onPress}
			activeOpacity={0.7}>
			<AppText style={styles.addBtnText}>{text}</AppText>
		</TouchableOpacity>
	);

	// ========== USER ==========
	const userTripsCached = useMemo(() => [...userTrips, ...userRoutes], [userTrips, userRoutes])
	const userPlaningTripsCached = useMemo(() =>
		userTripsCached.filter(el => el.date > new Date()),
	[userTripsCached]);
	const userHistoryTripsCached = useMemo(() =>
		userTripsCached.filter(el => el.date < new Date()),
	[userTripsCached]);

	const UserPlaningTrips = useCallback(() => {
		return userPlaningTripsCached
			.sort((a, b) => a.date - b.date)
			.map((el, i) => (
				<Trip
					{...el}
					testID={'tripCard' + i}
					key={'trip' + i}
					categories={CATEGORIES}
					style={styles.trip}
					onPress={() => onUserTripPress(el)}
				/>
			));
	}, [userPlaningTripsCached]);

	const UserEmptyContent = useCallback(() => {
		return (
			<>
				<AppBoldText style={styles.emptyContentTitle}>
					Начните с поиска маршрута
				</AppBoldText>
				<AppText style={styles.emptyContentDescription}>
					Наш сервис предоставляет большое количество маршрутов, найдите подходящий.
				</AppText>
				<TouchableOpacity
					style={styles.findBtn}
					activeOpacity={0.7}
					onPress={() => navigation.navigate('MainTrips')}
				>
					<AppText style={styles.findBtnText}>Найти маршрут</AppText>
				</TouchableOpacity>
			</>
		);
	}, [userPlaningTripsCached, userHistoryTripsCached]);

	const userPlaningContent = useCallback(() => {
		return (
			<View style={styles.tripsWrapper}>
				{isTripsLoading || isRoutesLoading
					? <ActivityIndicator color={'#76A829'} />
					: !userPlaningTripsCached.length && !userHistoryTripsCached.length
						? <UserEmptyContent />
						: <>
							<AppBoldText style={styles.tripsTitle}>Путешествия</AppBoldText>
							{!userPlaningTripsCached.length
								? <AppText style={styles.trip}>
									Вы пока ничего не запланировали
								</AppText>
								: <UserPlaningTrips />
							}
						</>
				}
			</View>
		);
	}, [isTripsLoading, isRoutesLoading, UserPlaningTrips, UserEmptyContent]);

	const userHistoryTrips = useMemo(() => {
		return userHistoryTripsCached
			.sort((a, b) => a.date - b.date)
			.map((el, i) => (
				<Trip
					{...el}
					old
					categories={CATEGORIES}
					key={'trip' + i}
					style={styles.trip}
					onPress={() => onUserTripPress(el, true)}
				/>
			));
	}, [userHistoryTripsCached]);
	const userHistoryTripsContent = useCallback(() => {
		return (
			isTripsLoading ||
			isRoutesLoading ||
			(!!userHistoryTripsCached.length && (
				<>
					<AppBoldText
						style={{
							...styles.tripsTitle,
							...styles.tripsHistoryTitle,
						}}>
						История поездок
					</AppBoldText>
					{userHistoryTrips}
				</>
			))
		);
	}, [isTripsLoading, isRoutesLoading, userHistoryTripsCached, userHistoryTrips])

	const userContent = useCallback(() => (
		<View style={styles.wrap}>
			{userPlaningContent()}
			{userHistoryTripsContent()}
		</View>
	), [userPlaningContent, userHistoryTripsContent]);
	// ========== USER ==========

	// ========== DRIVER ==========
	const driverTripsNodes = useMemo(() => {
		return driverTrips
			.sort((a, b) => a.date - b.date)
			.map(el => (
				<Trip
					{...el}
					key={el.id}
					categories={CATEGORIES}
					style={styles.trip}
					onPress={() => {
						navigation.navigate(
							'PersonalDevStack',
							{
								screen: 'PersonalPlaningTripDetail',
								params: {tripId: el.id},
							},
						);
					}}
				/>
			));
	}, [driverTrips]);
	const driverTripsContent = useCallback(() => {
		return (
			(!!driverRoutes.length || !!driverTrips.length) &&
			<View style={styles.tripsWrapper}>
				<AppBoldText style={styles.tripsTitle}>
					Предстоящие
				</AppBoldText>
				{isTripsLoading
					? <ActivityIndicator color={'#76A829'} />
					: driverTripsNodes
				}
				{addBtn('Запланировать', 'addTripBtn', () =>
					navigation.navigate('PersonalDevStack', {
						screen: 'PersonalPlaningTripCreate',
					}),
				)}
			</View>
		);
	}, [driverRoutes, isTripsLoading, driverTripsNodes]);

	const driverRoutesNodes = useMemo(() => {
		return driverRoutes.map(el => (
			<PersonalRout
				{...el}
				key={el.id}
				categories={CATEGORIES}
				style={styles.trip}
				onPress={() => {
					navigation.navigate(
						'PersonalDevStack',
						{
							screen: 'PersonalRouteDetail',
							params: {routeId: el.id},
						},
					);
				}}
			/>
		));
	}, [driverRoutes]);
	const driverRoutesContent = useCallback(() => {
		return (
			<View style={styles.tripsWrapper}>
				<AppBoldText style={styles.tripsTitle}>
					Маршруты
				</AppBoldText>
				{isRoutesLoading
					? <ActivityIndicator color={'#76A829'} />
					: driverRoutesNodes
				}
				{addBtn('Добавить маршрут', 'addRouteBtn', () =>
					navigation.navigate('PersonalDevStack', {
						screen: 'PersonalRouteCreate',
					}),
				)}
			</View>
		);
	}, [isRoutesLoading, driverRoutesNodes]);

	const driverCarsNodes = useMemo(() => {
		return userCars.map(el => (
			<CarPreview
				{...el}
				accessibilityLabel={'carPreview'}
				key={'car' + el.id}
				style={styles.car}
				onPress={() =>
					navigation.navigate(
						'PersonalDevStack',
						{
							screen: 'EditAuto',
							params: {carId: el.id},
						},
					)
				}
			/>
		));
	}, [userCars]);
	const driverCarsContent = useCallback(() => {
		return (
			[DRIVER].includes(USER.role[0]) &&
			<View style={styles.tripsWrapper}>
				<AppBoldText style={styles.tripsTitle}>
					{userCars.length > 1
						? 'Мои автомобили'
						: 'Мой автомобиль'}
				</AppBoldText>
				{isCarsLoading
					? <ActivityIndicator color={'#76A829'} />
					: driverCarsNodes
				}
				{addBtn('Добавить автомобиль', 'addCarBtn', () =>
					navigation.navigate('PersonalDevStack', {
						screen: 'AddAuto',
					}),
				)}
			</View>
		);
	}, [isCarsLoading, driverCarsNodes]);


	const driverContent = useCallback(() => {
		return (
			<>
				<ShareBtn
					style={styles.shareBtn}
					text={'Поделиться страницей'}
					onPress={() => {
						onShare(shareLink);
						AppMetrica.reportEvent('onShare', {
							organizerId: USER.id,
						});
					}}
				/>
				<View style={styles.wrap}>
					{driverTripsContent()}
					{driverRoutesContent()}
					{driverCarsContent()}
				</View>
			</>
		);
	}, [driverTripsContent, driverRoutesContent, driverCarsContent]);
	// ========== DRIVER ==========

	const openLinks = i => {
		switch (i) {
			case 0:
				Linking.openURL(`mailto:${mail}`);
				break;
			case 1:
				Linking.openURL(about);
				break;
			case 2:
				Linking.openURL(instagram);
				break;
		}
	};

	const renderHeader = useCallback(() => (
		<View style={styles.header}>
			<TouchableOpacity
				style={styles.burger}
				activeOpacity={0.7}
				onPress={() => setAboutVisible(true)}>
				<BurgerSvg width={25} height={25} />
			</TouchableOpacity>
			<GreenBtn
				testID={'toSettings'}
				style={styles.greenBtn}
				text={'Изм.'}
				onPress={() =>
					navigation.navigate('PersonalDevStack', {
						screen: 'PersonalSettings',
					})
				}
			/>
		</View>
	), []);

	return (
		<SafeAreaView style={styles.area}>
			<ScrollView
				testID={'scrollView'}
				ref={mainScrollView}
				style={styles.container}
				contentContainerStyle={styles.containerContent}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						colors={['#76A829']}
						tintColor={'#76A829'}
					/>
				}>
				{renderHeader()}
				<ProfilePreview
					name={USER.name + ' ' + USER.lastname}
					imgUrl={avatar}
					style={styles.preview}
				/>
				<AppText style={styles.phone}>
					{onPhoneInput(USER.phone, 10)}
				</AppText>
				{statusButtons(USER)}
				{USER.status[0] === AS_TOURIST ||
				USER.driver?.matrixValue[0]?.status[0] !== REQUEST_SUCCESS ||
				USER.driver.matrixValue.length === 0
					? userContent()
					: driverContent()}
				<ModalSelect
					data={ABOUT_LINKS}
					isVisible={aboutVisible}
					close={() => setAboutVisible(false)}
					onSelect={openLinks}
					icons={'about'}
				/>
			</ScrollView>
		</SafeAreaView>
	);
};

const mapStateToProps = state => {
	return {
		USER: state.user.data,
		USER_TRIPS: state.user.userTrips,
		USER_ROUTES: state.user.userRoutes,
		DRIVER_TRIPS: state.user.driverTrips,
		DRIVER_ROUTES: state.user.driverRoutes,
		CATEGORIES: state.settings.categories,
		CURRENT_SCREEN: state.settings.currentScreen,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		FETCH_USER_TRIPS: id => dispatch(fetchUserTrips(id)),
		FETCH_USER_ROUTES: id => dispatch(fetchUserRoutes(id)),
		FETCH_DRIVER_TRIPS: id => dispatch(fetchDriverTrips(id)),
		FETCH_DRIVER_ROUTES: id => dispatch(fetchDriverRoutes(id)),
		CHANGE_USER_STATUS: (id, status) =>
			dispatch(changeUserStatus(id, status)),
		UPDATE_USER_DATA: id => dispatch(updateUserData(id)),
		FETCH_CATEGORIES: data => dispatch(fetchCategories(data)),
		SET_CURRENT_SCREEN: (screen) => dispatch(setCurrentScreen(screen)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(PersonalCabinet);
