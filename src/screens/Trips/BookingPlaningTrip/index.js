import React, {useMemo, useState, useEffect} from 'react';
import {View, ScrollView, SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import {
	ModalSelect,
	BigBtn,
	AppBoldText,
	SmallBtn,
	Trip,
	InfoLine,
	Counter,
	SuccessMessage,
	SplashLoader,
} from '../../../components';
import {BackSvg} from '../../../svg';
import {localNumeric, smallTripFormatter, twoDigitTime} from '../../../services';
import styles from './styles.js';
import {PYMENT_TYPES, bookedTripMsg, loaderMsg, defaultTripsParams, footerCategories} from '../../../variables';
import {bookedTrip, setStoreTrips} from '../../../store/actions/tripsAction';
import {fetchUserTrips} from '../../../store/actions/userAction';
import {fetchTrips} from '../../../store/actions/tripsAction';
import AppMetrica from 'react-native-appmetrica';

const BookingPlaningTrip = ({
	navigation,
	route,
	USER,
	BOOKED_TRIP,
	FETCH_USER_TRIPS,
	FETCH_TRIPS,
	SET_STORE_TRIPS,
	CATEGORIES,
}) => {
	useEffect(() => {
		AppMetrica.reportEvent(route.name, {tripId: route.params.curTrip.id});
	}, []);

	const curTrip = useMemo(() => ({
		...smallTripFormatter(route.params.curTrip),
		place: route.params.curTrip.place,
	}), [route.params.curTrip]);
	const [usersCount, setUsersCount] = useState(1);
	const [successModal, setSuccessModal] = useState({
		visible: false,
		success: true,
	});
	const [selectVisible, setSelectVisible] = useState(false);
	const [paymentType, setPaymentType] = useState(
		Object.keys(PYMENT_TYPES)[0],
	);
	const [isLoading, setLoading] = useState(false);

	const onSelectPymentType = val => {
		setPaymentType(val);
		setSelectVisible(false);
	};

	const onChangeCounter = isPlus => {
		isPlus ? setUsersCount(usersCount + 1) : setUsersCount(usersCount - 1);
	};

	const toBooked = async () => {
		setLoading(true);
		const tripData = {
			trip_id: route.params.curTrip.id,
			user_id: USER.id,
			payment_type: [paymentType],
			count: usersCount,
			accepted: false,
		};
		const response = await BOOKED_TRIP(tripData);
		response.success === true
			? setSuccessModal({
				// visible: true,
				success: true,
				msg: bookedTripMsg,
			})
			: setSuccessModal({
				// visible: true,
				success: false,
				msg: response.message,
			});
		setLoading(false);
	};

	const closeSuccess = async success => {
		if (success) {
			FETCH_USER_TRIPS(USER.id);
			navigation.navigate('MainScreen');
			const tripsList = await FETCH_TRIPS(defaultTripsParams);
			SET_STORE_TRIPS('sortedTripsList', tripsList);
		} else {
			setSuccessModal({
				...successModal,
				visible: false,
			});
		}
	};

	return (
		<SafeAreaView style={styles.areaWrapper}>
			<ScrollView
				testID={'scrollView'}
				style={styles.container}
				contentContainerStyle={{flexGrow: 1}}>
				<SmallBtn
					style={styles.backBtn}
					onPress={() => navigation.goBack()}>
					<BackSvg height={17} width={17} />
				</SmallBtn>
				<View style={styles.contentWrapper}>
					<Trip
						{...curTrip}
						categories={CATEGORIES}
					/>
					<InfoLine
						style={styles.borderBottom}
						boldText={localNumeric(curTrip.price)}
						smallText={
							// 'Цена за место'
							footerCategories.includes(curTrip.category[0])
								? 'Цена с человека'
								: 'Цена за место'
						}
						onPress={() => setSelectVisible(true)}
					/>
					<InfoLine
						style={styles.borderBottom}
						boldText={
							// 'Количество мест'
							footerCategories.includes(curTrip.category[0])
								? 'Размер группы'
								: 'Количество мест'
						}
						smallText={'с учетом детей'}>
						<Counter
							count={usersCount}
							max={curTrip.emptySeats}
							onChange={onChangeCounter}
						/>
					</InfoLine>
					<InfoLine
						style={styles.borderBottom}
						boldText={PYMENT_TYPES[paymentType]}
						smallText={'способ оплаты'}
						onPress={() => setSelectVisible(true)}
					/>
					<ModalSelect
						data={PYMENT_TYPES}
						isVisible={selectVisible}
						close={() => setSelectVisible(false)}
						onSelect={onSelectPymentType}
					/>
					<InfoLine
						style={styles.borderBottom}
						boldText={curTrip.place}
						smallText={'место сбора'}>
						<AppBoldText style={styles.grayText}>
							{twoDigitTime(curTrip.date)}
						</AppBoldText>
					</InfoLine>
					<InfoLine boldText={'Итого'}>
						<AppBoldText style={styles.boldText}>
							{localNumeric(curTrip.price * usersCount)}
						</AppBoldText>
					</InfoLine>
				</View>
				<BigBtn
					testID={'toBookedBtn'}
					style={styles.bigBtn}
					caption={'Забронировать'}
					onPress={toBooked}
				/>
			</ScrollView>
			<SuccessMessage
				message={successModal.msg}
				isVisible={successModal.visible}
				success={successModal.success}
				close={() => closeSuccess(successModal.success)}
				closeTestId={'closeTestId'}
			/>
			<SplashLoader
				isVisible={isLoading}
				close={() => setLoading(false)}
				onModalHide={() => setSuccessModal({
					...successModal,
					visible: true,
				})}
				text={loaderMsg}
			/>
		</SafeAreaView>
	);
};

const mapStateToProps = state => {
	return {
		USER: state.user.data,
		CATEGORIES: state.settings.categories,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		BOOKED_TRIP: data => dispatch(bookedTrip(data)),
		FETCH_USER_TRIPS: id => dispatch(fetchUserTrips(id)),
		FETCH_TRIPS: data => dispatch(fetchTrips(data)),
		SET_STORE_TRIPS: (state, data) => dispatch(setStoreTrips(state, data)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingPlaningTrip);
