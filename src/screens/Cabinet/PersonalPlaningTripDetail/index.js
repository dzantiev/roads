import React, {useState, useEffect} from 'react';
import {View, SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import {API_URL} from '@env';
import styles from './styles';
import {
	SmallBtn,
	PreviewSlider,
	TripStatusBar,
	InfoLine,
	CircleAvatar,
	SliderModal,
	Description,
	TripPoints,
	GreenBtn,
	AppText,
	TripPersonData,
	ShareBtn,
	LoadPage,
} from '../../../components';
import {CaretLeft} from '../../../svg';
import {appPrefix, footerCategories, personTripEmptySeats, shareTrip} from '../../../variables';
import {
	localNumeric,
	twoDigitTime,
	longDate,
	callToNumber,
	onShare,
} from '../../../services';
import {fetchDriverTrips} from '../../../store/actions/driverAction';
import { useMemo } from 'react';
import AppMetrica from 'react-native-appmetrica';

const PersonalPlaningTripDetail = ({
	navigation,
	route,
	DRIVER_TRIPS,
	FETCH_DRIVER_TRIPS,
	USER,
}) => {
	const [sliderModalVisible, setSliderModalVisible] = useState(false);
	const [sliderImgs, setSlidesImgs] = useState([]);
	const [currentSlide, setCurrentSlide] = useState(0);

	useEffect(() => {
		AppMetrica.reportEvent(route.name);
	}, []);

	const trip = useMemo(() => {
		return (
			route.params.tripData ||
			DRIVER_TRIPS.find(
				el => [+route.params.tripId, +route.params.screen].includes(+el.id)
			)
		);
	}, [DRIVER_TRIPS]);

	const currentTrip = useMemo(() => {
		if (!trip) return null;

		const car = trip.car?.matrixValue[0] || {};
		const cRoute = trip.route?.matrixValue[0] || {};
		const users = trip.users?.matrixValue || [];
		const time = twoDigitTime(new Date(trip.date?.replace(' ', 'T') + 'Z'));
		return {
			...(car.id &&
				{
					car: {
						name: `${car.company} ${car.model} ${car.year}`,
						images: car.images?.map(
							el => API_URL + el.localPath,
						) || [],
						smallImgs: car.images?.map(
							el => API_URL + el.sizes.small.localPath,
						) || [],
					},
				}
			),
			dateTime: `${longDate(new Date(trip.date.replace(' ', 'T') + '.000Z'))} - ${time}`,
			route: {
				images: cRoute.images?.map(
					el => API_URL + el.localPath,
				) || [],
				locations: cRoute.locations?.matrixValue.map(
					el => el.name,
				) || [],
			},
			title: cRoute.title || '',
			price: trip.price || '',
			tripStatus: trip.full ? '' : 'pending',
			meetPlace: trip.place || '',
			users:
				users.map(el => {
					let user = el.user.matrixValue[0];
					return {
						id: user.id,
						name: `${user.name} ${user.lastname}`,
						seats: el.count,
						image:
							user.image.length > 0 &&
							API_URL + user.image[0].sizes.small.localPath,
						phone: user.phone,
					};
				}),
			maxSeats: trip.empty_seats || '',
			category: cRoute.category || '',
			currSeats: trip.users_count || '',
		};
	}, [trip]);

	if (!currentTrip) {
		FETCH_DRIVER_TRIPS(USER.id);
		return <LoadPage />;
	}

	const shareLink =
		appPrefix + shareTrip(route.params.tripId || route?.params?.screen);

	const renderToursits = (tourist, i) => {
		return (
			<TripPersonData
				key={i}
				name={tourist.name}
				seats={tourist.seats}
				image={tourist.image}
				onCallPress={() => callToNumber(tourist.phone)}
				onUserPress={() => {
					navigation.navigate('TripDetailStack', {
						screen: 'UserDetail',
						params: {user: tourist.id},
					});
				}}
			/>
		);
	};

	return (
		<>
			<SafeAreaView style={styles.area}>
				<View style={styles.wrapper}>
					<PreviewSlider
						slides={currentTrip.route.images}
						onPress={idx => {
							setSliderModalVisible(true);
							setSlidesImgs(currentTrip.route.images);
							setCurrentSlide(idx);
						}}>
						<View style={styles.navBar}>
							<SmallBtn onPress={() => navigation.goBack()}>
								<CaretLeft />
							</SmallBtn>
							<GreenBtn
								testID={'toSettings'}
								text={'Изм.'}
								onPress={() => {
									navigation.navigate('PersonalDevStack', {
										screen: 'PersonalPlaningTripEdit',
										params: {tripId: trip.id},
									});
								}}
								style={styles.greenBtn}
							/>
						</View>
						<View style={styles.container}>
							<TripStatusBar
								status={currentTrip.tripStatus}
								meetPlace={currentTrip.meetPlace}
								seats={
									currentTrip.maxSeats - currentTrip.currSeats
								}
							/>
							<InfoLine
								style={styles.infoLine}
								boldText={currentTrip.title}
							/>
							<InfoLine
								style={styles.infoLine}
								smallText={'дата поездки'}
								boldText={currentTrip.dateTime}
							/>
							<View style={styles.touristsWr}>
								<AppText style={styles.touristsBold}>
									Туристы
								</AppText>
								<AppText style={styles.touristsCount}>
									{currentTrip.currSeats}/
									{currentTrip.maxSeats}
								</AppText>
							</View>
							<View style={styles.touristsSeatsWr}>
								{currentTrip.users ? (
									currentTrip.users.map((el, i) =>
										renderToursits(el, i),
									)
								) : (
									<AppText style={styles.toursitsEmptySeats}>
										{personTripEmptySeats}
									</AppText>
								)}
							</View>
							<InfoLine
								style={styles.infoLine}
								smallText={
									// 'цена за место'
									footerCategories.includes(currentTrip.category[0])
										? 'цена с человека'
										: 'цена поездки'
								}
								boldText={`${localNumeric(+currentTrip.price)}`}
							/>
							{
								currentTrip.car &&
								<InfoLine
									style={styles.infoLine}
									smallText={'транспорт'}
									sideStyle={{maxWidth: '80%'}}
									boldText={currentTrip.car.name}>
									<CircleAvatar
										images={currentTrip.car.smallImgs}
										onPress={() => {
											setSliderModalVisible(true);
											setSlidesImgs(currentTrip.car.images);
										}}
									/>
								</InfoLine>
							}
							<Description
								style={styles.desc}
								titleStyle={styles.descTitleStyle}
								title={'Доп информация'}
								text={trip.description}
							/>
							<TripPoints places={currentTrip.route.locations} />
							<ShareBtn
								style={styles.shareBtn}
								text={'Поделиться поездкой'}
								onPress={() => {
									onShare(shareLink);
									AppMetrica.reportEvent('onShare', {
										tripId: route.params.tripId || route?.params?.screen,
									});
								}}
							/>
						</View>
					</PreviewSlider>
				</View>
			</SafeAreaView>
			<SliderModal
				animationType={'fade'}
				animationIn={'fadeIn'}
				animationOut={'fadeOut'}
				isVisible={sliderModalVisible}
				slides={sliderImgs}
				close={() => setSliderModalVisible(false)}
				currentSlide={currentSlide}
			/>
		</>
	);
};

const mapStateToProps = state => {
	return {
		USER: state.user.data,
		DRIVER_TRIPS: state.user.driverTrips,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		FETCH_DRIVER_TRIPS: id => dispatch(fetchDriverTrips(id)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(PersonalPlaningTripDetail);
