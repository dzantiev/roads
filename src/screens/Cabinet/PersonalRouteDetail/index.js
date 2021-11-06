import React, {useMemo, useState, useEffect, useCallback} from 'react';
import {View, SafeAreaView, ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import {API_URL} from '@env';
import styles from './styles';
import {
	SmallBtn,
	PreviewSlider,
	InfoLine,
	DriverPreview,
	SliderModal,
	Description,
	TripPoints,
	GreenBtn,
	ShareBtn,
	DurationChips,
	AppBoldText,
	AppText,
	RouteCalendar
} from '../../../components';
import { CaretLeft } from '../../../svg';
import { localNumeric, onShare } from '../../../services';
import { appPrefix, footerCategories, shareRoute } from '../../../variables';
import { fetchTripsByRouteID } from '../../../store/actions/tripsAction';
import { patchDriverRoutes } from '../../../store/actions/routesAction';
import AppMetrica from 'react-native-appmetrica';


const PersonalTripDetail = ({
	navigation,
	route,
	DRIVER_ROUTES,
	CATEGORIES,
	FETCH_TRIPS_BY_ROUTE_ID,
	PATCH_DRIVER_ROUTES,
	DRIVER_TRIPS
}) =>
{
	const getAndSetRouteTrips = async id => {
		const tripsList = await FETCH_TRIPS_BY_ROUTE_ID(id);
		PATCH_DRIVER_ROUTES(id, tripsList);
	}
	useEffect(() => {
		AppMetrica.reportEvent(route.name);
	}, []);

	const cRoute = useMemo(
		() => DRIVER_ROUTES.find(el => el.id === route.params.routeId) || {},
		[DRIVER_ROUTES]
	);

	const currentRoute = useMemo(() => {
		const user = cRoute?.driver?.matrixValue[0];
		const avatar = user?.image[0]?.sizes?.small?.localPath;
		return {
			id: cRoute.id,
			driver: {
				id: user?.id,
				name: `${user?.name} ${user?.lastname}`,
				imgUrl: avatar ? API_URL + avatar : null,
				phone: user?.phone,
			},
			images: cRoute.images.map(el => API_URL + el.localPath) || [],
			price: cRoute.price || '',
			title: cRoute.title || '',
			description: cRoute.description || '',
			places: cRoute.locations?.matrixValue.map(el => el.name) || [],
			duration: +cRoute?.duration || 0,
			category: cRoute.category || '',
			trips: cRoute.trips,
		}
	}, [DRIVER_ROUTES]);

	useEffect(() => {
		if (currentRoute.id) {
			getAndSetRouteTrips(currentRoute.id);
		}
	}, [DRIVER_TRIPS])

	const [isModal, setIsmodal] = useState(false);
	const [images, setImages] = useState([]);

	const [currentSlide, setCurrentSlide] = useState(0);

	const shareLink = appPrefix + shareRoute(route.params.routeId || route?.params?.screen);

	const routeTripsStrDates = useMemo(() => {
		if (!currentRoute.trips) return [];

		return currentRoute.trips?.map(el => el.date.slice(0, 10))
	}, [currentRoute])

	const routeTripsObjDates = useMemo(() =>
		routeTripsStrDates.map(el => new Date(el))
	, [routeTripsStrDates])

	const CategoryChips = useCallback(({children}) => {
		return (
			<View style={styles.categoryChips}>
				<AppText style={styles.categoryChipsText}>{ children }</AppText>
			</View>
		)
	}, [])

	const onCalendarDayPress = useCallback(data => {
		if (!data.isMarked) {
			navigation.navigate('PersonalDevStack', {
				screen: 'PersonalPlaningTripCreate',
				params: {
					date: data.date,
					routeID: currentRoute.id
				}
			})
		} else {
			const tripIndex = routeTripsStrDates.indexOf(data.date)
			navigation.navigate('PersonalDevStack', {
				screen: 'PersonalPlaningTripDetail',
				params: {
					tripData: cRoute.trips[tripIndex]
				}
			})
		}
	}, [routeTripsStrDates])

	return (
		<>
			<SafeAreaView style={styles.area}>
				<View style={{flex: 1}}>
					<PreviewSlider
						slides={currentRoute.images}
						isNumberPagination
						paginationNumStyle={styles.pagination}
						onPress={idx => {
							setIsmodal(true);
							setImages(currentRoute.images);
							setCurrentSlide(idx);
						}}>
						<View style={styles.navBar}>
							<SmallBtn onPress={() => navigation.goBack()}>
								<CaretLeft />
							</SmallBtn>
							<GreenBtn
								testID={'toSettings'}
								text={'Изм.'}
								onPress={() => navigation.navigate(
									'PersonalRouteEdit',
									{routeId: route.params.routeId},
								)}
								style={styles.greenBtn}
							/>
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
									/>
									<DurationChips
										duration={currentRoute.duration}
										style={styles.durationChips}
									/>
								</ScrollView>
								<RouteCalendar
									onDayPress={onCalendarDayPress}
									// activeDates={mockTripsData.map(el => el.date)}
									activeDates={routeTripsObjDates}

								/>
								<InfoLine
									style={styles.infoLine}
									smallText={
										// 'цена поездки'
										footerCategories.includes(currentRoute.category[0])
											? 'цена с человека'
											: 'цена поездки'
									}
									boldText={localNumeric(currentRoute.price)}
								/>
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
											routeId: route.params.routeId || route?.params?.screen,
										});
									}}
								/>
							</View>
						</View>
					</PreviewSlider>
				</View>
			</SafeAreaView>
			<SliderModal
				animationType={'fade'}
				animationIn={'fadeIn'}
				animationOut={'fadeOut'}
				isVisible={isModal}
				slides={images}
				close={() => setIsmodal(false)}
				currentSlide={currentSlide}
			/>
		</>
	);
};

const mapStateToProps = state =>
{
	return {
		DRIVER_ROUTES: state.user.driverRoutes,
		DRIVER_TRIPS: state.user.driverTrips,
		CATEGORIES: state.settings.categories,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		FETCH_TRIPS_BY_ROUTE_ID: id => dispatch(fetchTripsByRouteID(id)),
		PATCH_DRIVER_ROUTES: (id, data) => dispatch(patchDriverRoutes(id, data)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(PersonalTripDetail);
