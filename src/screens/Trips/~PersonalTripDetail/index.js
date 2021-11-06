import React, {useEffect, useMemo, useState, useCallback} from 'react';
import {View, SafeAreaView} from 'react-native';
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
} from '../../../components';
import {CaretLeft} from '../../../svg';
import {
	localNumeric,
	convertDuration,
	callToNumber,
	onShare,
	declOfNum,
} from '../../../services';
import {fetchRoute} from '../../../store/actions/routesAction';
import {appPrefix, footerCategories, shareRoute} from '../../../variables';
import AppMetrica from 'react-native-appmetrica';

const PersonalTripDetail = ({navigation, route, ROUTES_LISTS, FETCH_ROUTE, CATEGORIES}) => {
	const [currentSlide, setCurrentSlide] = useState(0);
	const routesList = ROUTES_LISTS[route.params.state] || [];
	const curRoute = useMemo(() => routesList.find(el => el.id === route.params.id), [routesList]);

	const routeFormatter = useCallback(croute => {
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
				experience:
					new Date().getFullYear() -
					new Date(user?.created_date).getFullYear(),
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
			duration: convertDuration(+croute?.duration),
			description: croute?.description,
			places: curRouteLocations?.map(el => el?.name),
			category: croute.category
		};
	}, []);

	const [currentRoute, setCurrentRoute] = useState(() =>
		routeFormatter(curRoute)
	);
	const [isModal, setIsmodal] = useState(false);
	const [images, setImages] = useState([]);

	const getRoute = async id => {
		const resp = await FETCH_ROUTE(id);
		setCurrentRoute(routeFormatter(resp));
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
	const cars = useMemo(() => {
		return currentRoute.cars?.map((car, i) =>
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
		)
	}, [currentRoute.cars])
	const closeModal = useCallback(() => setIsmodal(false), [])

	return (
		<>
			<SafeAreaView style={styles.area}>
			{!currentRoute.id
				? <LoadPage />
				: <View style={{flex: 1}}>
					<PreviewSlider
						scrollViewTestID={'scrollView'}
						slides={currentRoute.images}
						onPress={onSlidePress}>
						<View style={styles.navBar}>
							<SmallBtn onPress={() => navigation.goBack()}>
								<CaretLeft />
							</SmallBtn>
							<DriverPreview
								{...currentRoute.driver}
								testID={'toDriverScreen'}
								onPress={() =>
									navigation.navigate('DriverDetail', {
										// driver: curRoute.driver.matrixValue[0],
										driver: currentRoute.driver.id,
									})
								}
							/>
						</View>
						<View style={styles.container}>
							<InfoLine
								style={styles.infoLine}
								boldText={currentRoute.title}
								smallText={CATEGORIES[currentRoute.category]?.toLowerCase()}
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
							<InfoLine
								style={styles.infoLine}
								smallText={'продолжительность поездки'}
								boldText={currentRoute.duration}
							/>
							{cars}
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
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(PersonalTripDetail);
