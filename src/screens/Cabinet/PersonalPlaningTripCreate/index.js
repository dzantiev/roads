import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {View, SafeAreaView} from 'react-native';
import {
	BigBtn,
	TopNav,
	AppText,
	SelectField,
	AnimTextInput,
	TextArea,
	SuccessMessage,
	DateField,
	SplashLoader,
} from '../../../components/';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {connect} from 'react-redux';
import styles from './styles.js';
import {createTrip} from '../../../store/actions/tripsAction.js';
import {fetchDriverTrips} from '../../../store/actions/driverAction';
import {
	stringToDate,
	saveFieldValue,
	validator,
	checkTimeValue,
	defaultFieldValue,
} from '../../../services';
import {footerCategories, tripMsg} from '../../../variables';
import AppMetrica from 'react-native-appmetrica';

const PersonalPlaningTripCreate = ({
	navigation,
	route,
	USER,
	DRIVER_ROUTES,
	CREATE_TRIP,
	FETCH_DRIVER_TRIPS,
}) => {
	useEffect(() => {
		AppMetrica.reportEvent(route.name);
	}, []);

	const getRoutesList = useCallback(() => {
		return DRIVER_ROUTES.map(el => {
			return el.locations.matrixValue.reduce((acc, r) => {
				return (acc += r.name + ' ');
			}, '');
		});
	}, [DRIVER_ROUTES]);

	const getCarsList = useCallback(() => {
		return USER.cars.matrixValue
			.filter(car => car.is_approved)
			.map(car => {
				return `${car.company} ${car.model}`;
			});
	}, [USER.cars]);

	const routes = useMemo(() => getRoutesList(), []);
	const cars = useMemo(() => getCarsList(), []);

	const [curRoute, setCurRoute] = useState(
		() => {
			if (route.params?.routeID) {
				let routeIndex = -1;
				DRIVER_ROUTES.forEach((el, i) => {
					console.log(el.id, route.params.routeID, el.id === route.params.routeID)
					if (el.id === route.params.routeID) {
						routeIndex = i;
					}
				})

				return defaultFieldValue(routeIndex);
			}

			return defaultFieldValue(routes.length === 1 ? 0 : '');
		}
	);
	const isFooterRout = useCallback(() => {
		return footerCategories.includes(
			DRIVER_ROUTES[curRoute.value]?.category[0],
		);
	}, [curRoute]);
	const routeRules = useMemo(() => [
		v => v !== '' || 'Укажите маршрут',
		() => isFooterRout()
			? true
			: cars.length || 'У вас нет автомобиля'
	], [isFooterRout]);

	const [meetDate, setMeetDate] = useState(defaultFieldValue(
		route.params?.date.split('-').reverse().join('.') || ''
	));
	const meetDateRules = [v => !!v || 'Укажите дату'];

	const [meetTime, setMeetTime] = useState(defaultFieldValue(''));
	const meetTimeRules = [v => v.length > 4 || 'Укажите время'];

	const [meetPlace, setMeetPlace] = useState(defaultFieldValue(''));
	const meetPlaceRules = [v => !!v || 'Укажите место сбора'];

	const [car, setCar] = useState(
		defaultFieldValue(cars.length === 1 ? 0 : ''),
	);
	const carRules = [
		v => (!isFooterRout() ? v !== '' || 'Выберите авто' : true),
	];

	const [emptySeats, setEmptySeats] = useState(defaultFieldValue(''));
	const emptySeatsRules = [v => !!+v || 'Укажите колличество свободных мест'];

	const [cost, setCost] = useState(defaultFieldValue(''));
	const costRules = [];

	const [discription, setDiscription] = useState(defaultFieldValue(''));
	const discriptionRules = [
		v => !!v || 'Введите описание',
		v => v.length > 9 || `Минимум 10 символов. Сейчас ${v.length}`,
	];

	useEffect(() => {
		car.value !== '' &&
			setEmptySeats(old => ({
				...old,
				value: USER.cars.matrixValue[car.value].seats,
			}));
	}, [car]);

	const fields = [
		{field: {...curRoute, rules: routeRules}, func: setCurRoute},
		{field: {...meetDate, rules: meetDateRules}, func: setMeetDate},
		{field: {...meetTime, rules: meetTimeRules}, func: setMeetTime},
		{field: {...meetPlace, rules: meetPlaceRules}, func: setMeetPlace},
		{field: {...car, rules: carRules}, func: setCar},
		{field: {...emptySeats, rules: emptySeatsRules}, func: setEmptySeats},
		{field: {...cost, rules: costRules}, func: setCost},
		{
			field: {...discription, rules: discriptionRules},
			func: setDiscription,
		},
	];

	const [successModal, setSuccessModal] = useState({
		status: false,
		success: true,
		text: tripMsg,
	});
	const [isLoading, setLoading] = useState(false);

	const createPersonalPlaningTrip = async () => {
		const errors = validator(fields);
		if (errors.length) return;

		let date = stringToDate(meetDate.value);

		date.setHours(meetTime.value.substr(0, 2));
		date.setMinutes(meetTime.value.substr(3, 2));

		setLoading(true);

		const tripData = {
			date: date,
			description: discription.value.trim(),
			place: meetPlace.value.trim(),
			route_id: DRIVER_ROUTES[curRoute.value].id,
			price: +cost.value,
			empty_seats: emptySeats.value,
			free_seats: emptySeats.value,
		};
		!isFooterRout() &&
			(tripData.car_id = USER.cars.matrixValue[car.value].id);

		const tripResp = await CREATE_TRIP(tripData);

		if (!tripResp.success) {
			setSuccessModal({
				...successModal,
				text: tripResp.message,
				success: tripResp.success,
			});
		} else {
			setSuccessModal({
				...successModal,
				text: tripMsg,
				success: tripResp.success,
			});
			FETCH_DRIVER_TRIPS(USER.id);
		}

		setLoading(false);
	};

	const SectionTitle = useCallback(({title, testID}) => {
		return (
			<View style={styles.section} testID={testID}>
				<AppText style={styles.sectionTitle}>{title}</AppText>
			</View>
		);
	}, []);

	const saveRoute = useCallback(v => saveFieldValue(setCurRoute, {...curRoute, rules: routeRules}, v), [curRoute]);
	const saveMeetDate = useCallback(v => saveFieldValue(setMeetDate, {...meetDate, rules: meetDateRules}, v), [meetDate]);
	const saveMeetTime = useCallback(v => saveFieldValue(setMeetTime, {...meetTime, rules: meetTimeRules}, checkTimeValue(v)), [meetTime]);
	const saveMeetPlace = useCallback(v => saveFieldValue(setMeetPlace, {...meetPlace, rules: meetPlaceRules}, v), [meetPlace]);
	const saveCar = useCallback(v => saveFieldValue(setCar, {...car, rules: carRules},v), [car]);
	const saveEmptySeats = useCallback(v => saveFieldValue(setEmptySeats, {...emptySeats, rules: emptySeatsRules}, v), [emptySeats]);
	const saveCost = useCallback(v => saveFieldValue(setCost, {...cost, rules: costRules}, v), [cost]);
	const saveDiscription = useCallback(v => saveFieldValue(setDiscription, {...discription, rules: discriptionRules}, v), [discription]);

	const closeSplashLoader = useCallback(() => setLoading(false), []);
	const hideSplashLoader = useCallback(() => setSuccessModal({...successModal, status: true}), [successModal]);
	const closeSuccessMessage = useCallback(() => {
		successModal.success
			? navigation.goBack()
			: setSuccessModal({
				...successModal,
				status: false,
			});
	}, [successModal]);

	const minDate = useMemo(() => new Date(), []);
	const routeError = useMemo(() => curRoute.status ? curRoute.text : null, [curRoute]);
	const meetDateError = useMemo(() => meetDate.status ? meetDate.text : null, [meetDate]);
	const meetTimeError = useMemo(() => meetTime.status ? meetTime.text : null, [meetTime]);
	const meetPlaceError = useMemo(() => meetPlace.status ? meetPlace.text : null, [meetPlace]);
	const carError = useMemo(() => car.status ? car.text : null, [car]);
	const emptySeatsError = useMemo(() => emptySeats.status ? emptySeats.text : null, [emptySeats]);
	const costError = useMemo(() => cost.status ? cost.text : null, [cost]);
	const discriptionError = useMemo(() => discription.status ? discription.text : null, [discription]);

	const meetPlaceWrapperStyle = useMemo(() => ({...styles.inputBorderWrZ1, ...(meetPlace.status && {borderBottomColor: '#FE693A'})}), [meetPlace]);
	const emptySeatsWrapperStyle = useMemo(() => ({...styles.inputBorderWrZ1, ...(emptySeats.status && {borderBottomColor: '#FE693A'})}), [emptySeats]);
	const costPlaceholder = useMemo(() => isFooterRout() ? 'Цена с человека, ₽' : 'Цена за одно место, ₽', [isFooterRout]);

	return (
		<SafeAreaView style={styles.areaWrapper}>
			<TopNav
				title={'Планирование маршрута'}
				style={styles.header}
				onLeftPress={() => navigation.goBack()}
			/>
			<KeyboardAwareScrollView
				testID={'scrollView'}
				style={styles.container}
				contentContainerStyle={styles.contentContainer}
				extraHeight={120}>
				<View style={styles.inputsWr}>
					<SectionTitle title={'Выбор маршрута'} />
					<SelectField
						testID={'routeField'}
						data={routes}
						wrapperStyle={styles.textInputEndSection}
						placeholder={'Маршрут'}
						onChange={saveRoute}
						value={curRoute.value}
						error={routeError}
					/>
					<SectionTitle title={'Время и место сбора'} />
					<DateField
						testID={'dateField'}
						successBtnTestID={'dateSuccessBtn'}
						// prop={'DateOfIssue'}
						placeholder={'Дата'}
						minDate={minDate}
						wrapperStyle={styles.smallInputWr}
						style={styles.smallInputBorder}
						onChangeText={saveMeetDate}
						value={meetDate.value}
						error={meetDateError}
					/>
					<AnimTextInput
						fieldTestID={'meetTimeField'}
						wrapperStyle={styles.smallInputWr}
						style={styles.smallInputBorder}
						placeholder={'Время'}
						keyboardType={'numeric'}
						mask={'99:99'}
						onChangeAI={saveMeetTime}
						value={meetTime.value}
						error={meetTimeError}
					/>
					<AnimTextInput
						fieldTestID={'meetPlaceField'}
						wrapperStyle={meetPlaceWrapperStyle}
						style={styles.defaultInput}
						placeholder={'Место сбора'}
						onChangeAI={saveMeetPlace}
						value={meetPlace.value}
						errorStyle={styles.bn13}
						error={meetPlaceError}
					/>
					{
						!!cars.length && !isFooterRout() &&
						<>
							<SectionTitle title={'Автомобиль'} />
							<SelectField
								testID={'carField'}
								data={cars}
								wrapperStyle={styles.textInputEnd}
								placeholder={'Автомобиль'}
								onChange={saveCar}
								value={car.value}
								error={carError}
							/>
						</>
					}
					{
						(car.value !== '' || isFooterRout()) &&
						<AnimTextInput
							fieldTestID={'emptySeatsField'}
							wrapperStyle={emptySeatsWrapperStyle}
							style={styles.defaultInput}
							placeholder={'Свободных мест'}
							onChangeAI={saveEmptySeats}
							keyboardType={'numeric'}
							mask={'999'}
							value={emptySeats.value}
							errorStyle={styles.bn13}
							error={emptySeatsError}
						/>
					}
					<SectionTitle title={'Цена'} />
					<AnimTextInput
						fieldTestID={'costField'}
						wrapperStyle={styles.inputBorderWr}
						style={styles.defaultInput}
						keyboardType={'numeric'}
						mask={'999999999'}
						placeholder={costPlaceholder}
						onChangeAI={saveCost}
						value={cost.value}
						error={costError}
					/>
					<SectionTitle
						title={'Доп информация'}
						testID={'descriptionTitle'} />
					<TextArea
						testID={'discriptionField'}
						style={styles.discription}
						inputStyle={styles.textAreaStyle}
						placeholder={''}
						onChangeText={saveDiscription}
						value={discription.value}
						error={discriptionError}
					/>
				</View>
				<BigBtn
					testID={'createTripBtn'}
					style={styles.submitBtn}
					caption={'Добавить поездку'}
					onPress={createPersonalPlaningTrip}
				/>
			</KeyboardAwareScrollView>
			<SplashLoader
				isVisible={isLoading}
				close={closeSplashLoader}
				onModalHide={hideSplashLoader}
			/>
			<SuccessMessage
				closeTestId={'closeSuccessBtn'}
				isVisible={successModal.status}
				success={successModal.success}
				message={successModal.text}
				close={closeSuccessMessage}
			/>
		</SafeAreaView>
	);
};

const mapStateToProps = state => {
	return {
		USER: state.user.data,
		DRIVER_ROUTES: state.user.driverRoutes,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		CREATE_TRIP: data => dispatch(createTrip(data)),
		FETCH_DRIVER_TRIPS: id => dispatch(fetchDriverTrips(id)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(PersonalPlaningTripCreate);
