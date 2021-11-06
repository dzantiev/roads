import React, {useEffect, useMemo, useState, useCallback} from 'react';
import {View, SafeAreaView, ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import {API_URL} from '@env';
import styles from './styles';
import {
	SmallBtn,
	DriverPreview,
	PreviewSlider,
	InfoLine,
	CircleAvatar,
	SliderModal,
	Description,
	TripPoints,
	BigBtn,
	ShareBtn,
	LoadPage,
	DurationChips,
	AppText,
	AppBoldText,
	RouteCalendar
} from '../../../components';
import {CaretLeft} from '../../../svg';
import {
	localNumeric,
	// convertDuration,
	callToNumber,
	onShare,
	declOfNum,
} from '../../../services';
import {fetchRoute} from '../../../store/actions/routesAction';
import {appPrefix, footerCategories, shareRoute} from '../../../variables';
import { fetchTripsByRouteID } from '../../../store/actions/tripsAction';
import { patchSortedRoutes } from '../../../store/actions/routesAction';
import AppMetrica from 'react-native-appmetrica';

const routeFormatter = croute => {
		if (!croute) return {}

		const user = croute?.driver?.matrixValue[0];
		const avatar = user?.image[0]?.sizes?.small?.localPath;
		const cars = croute?.cars?.matrixValue.filter(car => car.is_approved);
		const curRouteLocations = croute?.locations?.matrixValue || [];

		return {
			id: croute.id,
			title: croute.title,
			driver: {
				id: user?.id,
				name: `${user?.name} ${user?.lastname}`,
				imgUrl: avatar ? API_URL + avatar : null,
				phone: user?.phone,
			},
			images: croute?.images?.map(el => API_URL + el?.localPath),
			price: croute?.price,
			cars: cars?.map(car => ({
				id: car.id,
				title: `${car?.company} ${car?.model} ${car?.year}`,
				images: car?.images?.map(el => API_URL + el?.localPath),
				seats: car?.seats || '0',
			})),
			duration: +croute?.duration || 0,
			description: croute?.description,
			places: curRouteLocations?.map(el => el?.name),
			category: croute.category,
			trips: croute.trips
		};
	};

const RouteDetail = ({
	navigation,
	route,
	ROUTES_LISTS,
	FETCH_ROUTE,
	CATEGORIES,
	FETCH_TRIPS_BY_ROUTE_ID,
	PATCH_SORTED_ROUTES
}) => {
	const routesList = useMemo(() => ROUTES_LISTS[route.params.state] || [], [ROUTES_LISTS]);
	const curRoute = useMemo(() => routesList.find(el => el.id === route.params.id) || null, [routesList]);

	const [currentRoute, setCurrentRoute] = useState(routeFormatter(curRoute));

	const [currentSlide, setCurrentSlide] = useState(0);
	const [isModal, setIsmodal] = useState(false);
	const [images, setImages] = useState([]);

	const getAndSetRouteTrips = async (id) => {
		const tripsList = await FETCH_TRIPS_BY_ROUTE_ID(id);
		PATCH_SORTED_ROUTES(id, tripsList)
	}

	useEffect(() => {
		if (curRoute?.id && !curRoute.trips) {
			getAndSetRouteTrips(curRoute.id);
		}
		curRoute?.trips && setCurrentRoute(routeFormatter(curRoute));
	}, [ROUTES_LISTS])

	const getRoute = async id => {
		const resp = await FETCH_ROUTE(id);
		const trips = await FETCH_TRIPS_BY_ROUTE_ID(id);
		setCurrentRoute(routeFormatter({...resp, trips}));
	};

	useEffect(() => {
		if (route.params.screen && !curRoute) {
			getRoute(route.params.screen);
			AppMetrica.reportEvent(route.name, {routeId: route.params.screen});
		}
		else {
			AppMetrica.reportEvent(route.name, {routeId: curRoute.id});
		}
	}, []);

	const seatsVariantes = ['место', 'места', 'мест']

	const carSmallText = (seats) => `транспорт (${seats} ${declOfNum(seats, seatsVariantes)})`

	const shareLink = appPrefix + shareRoute(currentRoute?.id ||route?.params?.screen);

	const onSlidePress = useCallback(idx => {
		setIsmodal(true);
		setImages(currentRoute.images);
		setCurrentSlide(idx);
	}, [currentRoute])
	const onCarPress = useCallback((images) => {
		setImages(images);
		setIsmodal(true);
	}, [])

	const Cars = useCallback(() => {
		return (
			<View>
				{currentRoute.cars?.map((car, i) =>
					<InfoLine
						testID={`carInfoLine${i}`}
						key={'car' + car.id}
						style={styles.infoLine}
						smallText={carSmallText(car.seats)}
						boldText={car.title}
						sideStyle={styles.carSideStyle}
						data={car.images}
						onPress={() => onCarPress(car.images)}
					>
						<CircleAvatar
							images={car.images}
							onPress={() => onCarPress(car.images)}
						/>
					</InfoLine>
				)}
			</View>
		)
	}, [currentRoute.cars])
	const closeModal = useCallback(() => setIsmodal(false), [])

	const CategoryChips = useCallback(({children}) => {
		return (
			<View style={styles.categoryChips}>
				<AppText style={styles.categoryChipsText}>{ children }</AppText>
			</View>
		)
	}, [])

	const routeTripsDates = useMemo(() => {
		if (!currentRoute.trips) return [];

		return currentRoute.trips?.map(el => new Date(el.date.slice(0, 10)))
	}, [currentRoute])

	const onCalendarDayPress = useCallback(data => {
		const currentTrip = currentRoute.trips.find(el => {
			return data.date === el.date.slice(0, 10);
		})

		currentTrip &&
		navigation.navigate('TripDetailStack', {
			screen: 'PlaningTripDetail',
			params: {
				tripData: currentTrip
			},
		});
	}, [currentRoute])

	return (
		<>
			<SafeAreaView style={styles.area}>
			{!currentRoute.id
				? <LoadPage />
				: <View style={{flex: 1}}>
					<PreviewSlider
						scrollViewTestID={'scrollView'}
						slides={currentRoute.images}
						isNumberPagination
						onPress={onSlidePress}>
						<View style={styles.navBar}>
							<SmallBtn onPress={() => navigation.goBack()}>
								<CaretLeft />
							</SmallBtn>
						</View>
						<View style={styles.container}>
							<View style={styles.infoData}>
								<LinearGradient
									colors={['#3E3E3E00', '#3E3E3E']}
									style={styles.linearGradient}
								>
									<View style={styles.infoDataWrapper}>
											<View style={styles.categoryChipsList}>
												<CategoryChips>
													{CATEGORIES[currentRoute.category]}
												</CategoryChips>
											</View>
											<View style={styles.titleWrap}>
												<AppBoldText numberOfLines={2} style={styles.title}>
													{currentRoute.title}
												</AppBoldText>
											</View>
											<View style={styles.descriptionWrap}>
												<AppText numberOfLines={2} style={styles.description}>
													{currentRoute.description}
												</AppText>
											</View>
									</View>
								</LinearGradient>
							</View>
							<View style={styles.wrapper}>
								<ScrollView
									style={styles.driverAndDuration}
									horizontal={true}
									showsHorizontalScrollIndicator={false}
								>
									<DriverPreview
										{...currentRoute.driver}
										style={styles.driverPreview}
										testID={'toDriverScreen'}
										onPress={() =>
											navigation.navigate('DriverDetail', {
												driver: currentRoute.driver.id,
											})
										}
									/>
									<DurationChips
										duration={currentRoute.duration}
										style={styles.durationChips}
									/>
								</ScrollView>
								<RouteCalendar
									onDayPress={onCalendarDayPress}
									activeDates={routeTripsDates}
									onlyActiveDates
									style={styles.routeCalendar}
								/>
								<InfoLine
									style={styles.infoLine}
									smallText={
										footerCategories.includes(currentRoute.category[0])
											? 'Цена с человека'
											: 'Цена'
									}
									boldText={localNumeric(currentRoute.price)}
								/>
								<Cars />
								<Description
									style={styles.desc}
									title={'О маршруте'}
									text={currentRoute.description}
								/>
								<TripPoints places={currentRoute.places} />
								<ShareBtn
									style={styles.shareBtn}
									text={'Поделиться маршрутом'}
									onPress={() => {
										onShare(shareLink);
										AppMetrica.reportEvent('onShare', {
											routeId: currentRoute?.id || route?.params?.screen,
										});
									}}
								/>
								<BigBtn
									style={styles.bigBtn}
									caption={'Позвонить'}
									onPress={() => callToNumber(currentRoute?.driver?.phone)}
								/>
							</View>
						</View>
					</PreviewSlider>
				</View>}
			</SafeAreaView>
			<SliderModal
				coseBtnTestID={'closeSliderModal'}
				isVisible={isModal}
				slides={images}
				animationType={'fade'}
				animationIn={'fadeIn'}
				animationOut={'fadeOut'}
				animationInTiming={200}
				close={closeModal}
				currentSlide={currentSlide}
			/>
		</>
	);
};

const mapStateToProps = state => {
	return {
		ROUTES_LISTS: {
			routesList: state.routes.routesList,
			sortedRoutesList: state.routes.sortedRoutesList,
			driverDetailRoutesList: state.routes.driverDetailRoutesList,
		},
		CATEGORIES: state.settings.categories,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		FETCH_ROUTE: id => dispatch(fetchRoute(id)),
		FETCH_TRIPS_BY_ROUTE_ID: id => dispatch(fetchTripsByRouteID(id)),
		PATCH_SORTED_ROUTES: (id, data) => dispatch(patchSortedRoutes(id, data)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(RouteDetail);
