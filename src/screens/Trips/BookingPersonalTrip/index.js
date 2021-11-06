import React, {useState} from 'react';
import {View, ScrollView, SafeAreaView, TextInput} from 'react-native';
import Modal from 'react-native-modal';
import {connect} from 'react-redux';
import {API_URL} from '@env';
import {
	AppText,
	BigBtn,
	DateRangePicker,
	ModalSelect,
	SmallBtn,
	PersonalRout,
	InfoLine,
	SuccessMessage,
	TimePicker,
} from '../../../components';
import {BackSvg} from '../../../svg';
import {localNumeric, twoDigitTime, longDate} from '../../../services';
import styles from './styles.js';
import {PYMENT_TYPES, bookedRouteMsg} from '../../../variables';
import {bookedRoute} from '../../../store/actions/routesAction';

const BookingPersonalTrip = ({navigation, route, USER, BOOKED_ROUTE, CATEGORIES}) => {
	const routeFormatter = croute => {
		const user = croute.driver.matrixValue[0];
		const cars = user.cars.matrixValue;
		const mainCar = cars.find(el => el.id === croute.carId);
		const curRouteLocations = croute?.locations.matrixValue || [];
		return {
			emptySeats: mainCar.seats,
			duration: +croute.duration,
			route: curRouteLocations.map(el => el.name),
			price: croute.price,
			image: mainCar.images.map(el => API_URL + el.localPath)[0],
		};
	};

	const [curRoute, setCurRoute] = useState(() =>
		routeFormatter(route.params.curRoute),
	);
	const defaultDate = new Date();
	const [calendarVisible, setCalendarVisible] = useState(false);
	const [selectVisible, setSelectVisible] = useState(false);
	const [paymentType, setPaymentType] = useState(
		Object.keys(PYMENT_TYPES)[0],
	);
	const [selectedTime, setSelectedTime] = useState(defaultDate);
	const [selectedDate, setSelectedDate] = useState(defaultDate);
	const [startPoint, setStartPoint] = useState('ТЦ Столица');
	const [successVisible, setSuccessVisible] = useState({
		visible: false,
		success: true,
	});

	const onSelectPymentType = val => {
		setPaymentType(val);
		setSelectVisible(false);
	};

	const toBooked = async () => {
		const date = selectedDate.toISOString().substring(0, 10);
		const time = twoDigitTime(selectedTime);
		const routeData = {
			route_id: route.params.curRoute.id,
			user_id: USER.id,
			car_id: route.params.curRoute.carId,
			date: new Date(`${date}T${time}`),
			start_point: startPoint,
			payment_type: [paymentType],
		};

		const response = await BOOKED_ROUTE(routeData);

		response.success === true
			? setSuccessVisible({
				visible: true,
				success: true,
				msg: bookedRouteMsg,
			})
			: setSuccessVisible({
				visible: true,
				success: false,
				msg: response.message,
			});
	};

	const dateSelect = () => {
		return (
			<Modal
				isVisible={calendarVisible}
				onRequestClose={() => setCalendarVisible(false)}
				onBackdropPress={() => setCalendarVisible(false)}>
				<DateRangePicker
					onDateSelect={date => {
						setSelectedDate(new Date(date));
						setCalendarVisible(false);
					}}
					cansel={() => setCalendarVisible(false)}
				/>
			</Modal>
		);
	};

	return (
		<SafeAreaView style={styles.areaWrapper}>
			<ScrollView
				style={styles.container}
				contentContainerStyle={{flexGrow: 1}}>
				<View style={styles.contentWrapper}>
					<SmallBtn
						style={styles.backBtn}
						onPress={() => navigation.goBack()}>
						<BackSvg height={17} width={17} />
					</SmallBtn>
					<PersonalRout
						emptySeats={curRoute.emptySeats}
						price={curRoute.price}
						duration={curRoute.duration}
						route={curRoute.route}
						image={curRoute.image}
						categories={CATEGORIES}
					/>
					<InfoLine
						style={styles.borderBottom}
						boldText={localNumeric(curRoute.price)}
						smallText={'цена поездки'}
					/>
					<InfoLine
						style={styles.borderBottom}
						boldText={longDate(selectedDate)}
						smallText={'дата поездки'}
						onPress={() => setCalendarVisible(true)}
					/>
					{dateSelect()}
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
					<View style={styles.inputWrapper}>
						<View style={styles.column}>
							<TextInput
								placeholder={'Введите место сбора'}
								autoCorrect={false}
								style={styles.boldText}
								value={startPoint}
								onChangeText={setStartPoint}
							/>
							<AppText style={styles.smallText}>
								место сбора
							</AppText>
						</View>
						<TimePicker
							selectedTime={selectedTime}
							setSelectedTime={setSelectedTime}
						/>
					</View>
					<InfoLine boldText={'Итого'}>
						<AppText style={styles.boldText}>
							{localNumeric(curRoute.price)}
						</AppText>
					</InfoLine>
				</View>
				<BigBtn
					style={styles.bigBtn}
					caption={'Отправить заявку'}
					onPress={toBooked}
				/>
			</ScrollView>
			<SuccessMessage
				message={successVisible.msg}
				isVisible={successVisible.visible}
				success={successVisible.success}
				close={() => {
					setSuccessVisible({
						visible: false,
					});
					successVisible.success && navigation.navigate('TripsStack');
				}}
			/>
		</SafeAreaView>
	);
};

const mapStateToProps = state =>
{
	return {
		USER: state.user.data,
		CATEGORIES: state.settings.categories,
	};
};

const mapDispatchToProps = dispatch =>
{
	return {
		BOOKED_ROUTE: data => dispatch(bookedRoute(data)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingPersonalTrip);
