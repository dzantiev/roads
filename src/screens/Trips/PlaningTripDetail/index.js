import React, {useState, useEffect, useMemo} from 'react';
import {View, SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import styles from './styles';
import {
	SmallBtn,
	DriverPreview,
	PreviewSlider,
	TripStatusBar,
	InfoLine,
	CircleAvatar,
	SliderModal,
	Description,
	TripPoints,
	BigBtn,
	ShareBtn,
	ModalInput,
	SuccessMessage,
	LoadPage,
	SplashLoader,
} from '../../../components';
import {CaretLeft} from '../../../svg';
import {
	longDate,
	localNumeric,
	convertDuration,
	onShare,
	twoDigitTime,
} from '../../../services';
import {toTripDetailScreenTripFormatter} from '../../../services/trips';
import {
	fetchTrip,
	leaveTrip,
	setStoreTrips,
} from '../../../store/actions/tripsAction';
import {fetchUserTrips} from '../../../store/actions/userAction';
import {
	appPrefix,
	defaultTripsParams,
	footerCategories,
	leaveTripMsg,
	loaderMsg,
	shareTrip,
} from '../../../variables';
import {fetchTrips} from '../../../store/actions/tripsAction';
import AppMetrica from 'react-native-appmetrica';

const PlaningTripDetail = ({
	navigation,
	route,
	TRIPS_LIST,
	FETCH_TRIP,
	FETCH_TRIPS,
	SET_STORE_TRIPS,
	USER,
	USER_TRIPS,
	LEAVE_TRIP,
	FETCH_USER_TRIPS,
	CATEGORIES,
}) => {
	const tripsList = useMemo(() => TRIPS_LIST[route.params.state] || [], [TRIPS_LIST]);
	const [currentSlide, setCurrentSlide] = useState(0);
	const [curTrip, setCurTrip] = useState(
		() =>
			route.params.tripData ||
			tripsList.find(el => el.id === route.params.id) ||
			USER_TRIPS.find(el => el.id === route.params.id),
	);
	const [trip, setTrip] = useState(() =>
		toTripDetailScreenTripFormatter(curTrip),
	);
	const [isModal, setIsmodal] = useState(false);
	const [images, setImages] = useState([]);

	const [leaveMsgVisible, setLeaveMsgVisible] = useState({
		visible: false,
		leave: false,
	});
	const [successModal, setSuccessModal] = useState({
		visible: false,
		success: true,
	});
	const [isLoading, setLoading] = useState(false);

	const leaveCurrentTrip = async () => {
		setLoading(true);

		const response = await LEAVE_TRIP(curTrip?.id, USER.id);
		if (response?.success) {
			FETCH_USER_TRIPS(USER.id);
			setSuccessModal({
				success: true,
				msg: leaveTripMsg,
			});
		} else {
			setSuccessModal({
				success: false,
				msg: response.message,
			});
		}
		setLoading(false);
		FETCH_USER_TRIPS(USER.id);
		const tripsList = await FETCH_TRIPS(defaultTripsParams);
		SET_STORE_TRIPS('sortedTripsList', tripsList);
	};

	const closeSuccess = () => {
		setSuccessModal({
			visible: false,
			success: true,
		});
		successModal.success && navigation.popToTop();
	};
	const onHideModalInput = () => {
		if (!leaveMsgVisible.visible && leaveMsgVisible.leave)
			leaveCurrentTrip();
	};

	useEffect(() => {
		const getTrip = async id => {
			const resp = await FETCH_TRIP(id);
			// console.log(JSON.stringify(resp));
			setCurTrip(resp);
			setTrip(toTripDetailScreenTripFormatter(resp));
		};
		if (route.params.screen && !curTrip) {
			getTrip(route.params.screen);
			AppMetrica.reportEvent(route.name, {tripId: route.params.screen});
		}
		else {
			AppMetrica.reportEvent(route.name, {tripId: curTrip.id});
		}
	}, []);

	const shareLink = appPrefix + shareTrip(curTrip?.id || route.params.screen);

	return (
		<>
			<SafeAreaView style={styles.area}>
				{!trip?.id ? (
					<LoadPage />
				) : (
					<View style={{flex: 1}}>
						<PreviewSlider
							slides={trip.images}
							onPress={idx => {
								setIsmodal(true);
								setImages(trip.images);
								setCurrentSlide(idx);
							}}>
							<View style={styles.navBar}>
								<SmallBtn onPress={() => navigation.goBack()}>
									<CaretLeft />
								</SmallBtn>
								<DriverPreview
									{...trip.driver}
									onPress={() => {
										navigation.navigate('TripDetailStack', {
											screen: 'DriverDetail',
											params: {
												driver: curTrip.route
													.matrixValue[0].driver_id,
											},
										});
									}}
								/>
							</View>
							<View style={styles.container}>
								{!route.params.isOld && (
									<TripStatusBar
										{...trip.status}
										// style={{
										// 	borderBottomWidth: 0,
										// }}
									/>
								)}
								<InfoLine
									style={styles.infoLine}
									boldText={trip.title}
									smallText={CATEGORIES[trip.category].toLowerCase()}
									// smallText={'dfbdfb'}
								/>
								<InfoLine
									style={styles.infoLine}
									smallText={'дата поездки'}
									boldText={`${longDate(
										trip.tripDate,
									)} - ${twoDigitTime(trip.tripDate)}`}
								/>
								<InfoLine
									style={styles.infoLine}
									smallText={'продолжительность поездки'}
									boldText={convertDuration(+trip.duration)}
								/>
								<InfoLine
									style={styles.infoLine}
									smallText={
										footerCategories.includes(
											trip.category[0],
										)
											? 'цена с человека'
											: 'цена за место'
									}
									boldText={localNumeric(trip.price)}
								/>
								{trip.car && (
									<InfoLine
										style={styles.infoLine}
										smallText={'транспорт'}
										boldText={trip.car.title}
										sideStyle={{maxWidth: '80%'}}
										onPress={() => {
											setImages(trip.car.images);
											setIsmodal(true);
										}}>
										<CircleAvatar
											images={trip.car.images}
											onPress={() => {
												setImages(trip.car.images);
												setIsmodal(true);
											}}
										/>
									</InfoLine>
								)}
								<Description
									style={{
										...styles.desc,
										marginTop: 10,
									}}
									title={'О маршруте'}
									text={trip.routeDescription}
								/>
								<Description
									style={styles.desc}
									title={'Доп информация'}
									text={trip.description}
								/>
								<TripPoints places={trip.places} />
								{!route.params.isOld && (
									<ShareBtn
										style={styles.shareBtn}
										text={'Поделиться поездкой'}
										onPress={() => {
											onShare(shareLink);
											AppMetrica.reportEvent('onShare', {
												tripId: curTrip?.id || route.params.screen,
											});
										}}
									/>
								)}
								{trip.userId !== USER.id && // запрет бронирования на себя
									!route.params.isOld &&
									(USER_TRIPS.find(
										el => el.id === curTrip?.id,
									) ? (
										<BigBtn
											testID={'toUnBookedBtn'}
											view={'gray'}
											style={styles.bigBtn}
											caption={'Отменить бронь'}
											onPress={() =>
												setLeaveMsgVisible({
													visible: true,
													leave: false,
												})
											}
										/>
									) : (
										<BigBtn
											testID={'toBookedBtn'}
											style={styles.bigBtn}
											caption={'Забронировать'}
											onPress={() => {
												navigation.navigate(
													'BookingPlaningTrip',
													{
														curTrip,
														onGoBack:
															route.params
																.onGoBack,
													},
												);
											}}
										/>
									))}
							</View>
						</PreviewSlider>
					</View>
				)}
			</SafeAreaView>
			<ModalInput
				textTestID={'modalInputText'}
				btnTestID={'modalInputBtn'}
				isVisible={leaveMsgVisible.visible}
				close={() =>
					setLeaveMsgVisible({
						visible: false,
						leave: false,
					})
				}
				onSuccess={() =>
					setLeaveMsgVisible({
						visible: false,
						leave: true,
					})
				}
				title={'Укажите причину отмены'}
				btnTitle={'Отправить'}
				placeholder={'Введите причину'}
				onModalHide={() => onHideModalInput()}
			/>
			<SliderModal
				isVisible={isModal}
				slides={images}
				animationType={'fade'}
				animationIn={'fadeIn'}
				animationOut={'fadeOut'}
				close={() => setIsmodal(false)}
				currentSlide={currentSlide}
			/>
			<SuccessMessage
				message={successModal.msg}
				isVisible={successModal.visible}
				success={successModal.success}
				close={closeSuccess}
				currentSlide={currentSlide}
				closeTestId={'closeTestId'}
			/>
			<SplashLoader
				isVisible={isLoading}
				close={() => setLoading(false)}
				onModalHide={() =>
					setSuccessModal({
						...successModal,
						visible: true,
					})
				}
				text={loaderMsg}
			/>
		</>
	);
};

const mapStateToProps = state => {
	return {
		TRIPS_LIST: {
			tripsList: state.trips.tripsList,
			sortedTripsList: state.trips.sortedTripsList,
			driverDetailTripsList: state.trips.driverDetailTripsList,
		},
		USER: state.user.data,
		USER_TRIPS: state.user.userTrips,
		CATEGORIES: state.settings.categories,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		FETCH_TRIP: id => dispatch(fetchTrip(id)),
		FETCH_TRIPS: data => dispatch(fetchTrips(data)),
		LEAVE_TRIP: (tripId, userId) => dispatch(leaveTrip(tripId, userId)),
		FETCH_USER_TRIPS: id => dispatch(fetchUserTrips(id)),
		SET_STORE_TRIPS: (state, data) => dispatch(setStoreTrips(state, data)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(PlaningTripDetail);
