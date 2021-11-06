import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, SafeAreaView} from 'react-native';
import {
	DeadBtn,
	TopNav,
	AppText,
	SelectField,
	AnimTextInput,
	TextArea,
	SuccessMessage,
	DateField,
	SplashLoader,
	Confirm,
} from '../../../components/';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {patchTrip, deleteTrip} from '../../../store/actions/tripsAction.js';
import {fetchDriverTrips} from '../../../store/actions/driverAction';
import {
	checkTimeValue,
	defaultFieldValue,
	saveFieldValue,
	twoDigitTime,
	validator,
} from '../../../services';
import styles from '../PersonalPlaningTripCreate/styles';
import {
	changesMsg,
	delTripTitle,
	delTripMsg,
	loaderMsg,
	footerCategories,
} from '../../../variables';
import { CommonActions } from '@react-navigation/routers';
import AppMetrica from 'react-native-appmetrica';

const PersonalPlaningTripEdit = ({
	navigation,
	route,
	USER,
	DRIVER_ROUTES,
	DRIVER_TRIPS,
	PATCH_TRIP,
	FETCH_DRIVER_TRIPS,
	DELETE_TRIP,
}) => {
	useEffect(() => {
		AppMetrica.reportEvent(route.name);
	}, []);

	const trip = useMemo(() =>
		DRIVER_TRIPS.find(el => el.id === route.params.tripId),
	[DRIVER_TRIPS]);
	// Object.keys(trip).forEach(key => console.log(key, trip[key]))
	const cRoute = useMemo(() => trip?.route.matrixValue[0], [trip]);
	const cDate = useMemo(
		() => new Date(trip?.date.replace(' ', 'T') + '.000Z'),
		[]
	);

	const cars = useMemo(() =>
		USER.cars.matrixValue.map(el => {
			return `${el.company} ${el.model}`;
		}),
	[]);

	const defaultValues = useMemo(() => ({
		curRoute: DRIVER_ROUTES.reduce(
			(acc, el, i) => el.id === cRoute?.id ? i : acc, 0
		),
		meetDate: cDate,
		meetTime: twoDigitTime(cDate),
		meetPlace: trip?.place,
		car: trip?.car.matrixValue.length
			? USER.cars.matrixValue.findIndex(
				(el, i) => el.id === trip.car.matrixValue[0].id,
			)
			: '',
		emptySeats: trip?.empty_seats,
		cost: trip?.price,
		discription: trip?.description,
	}), [cRoute]);

	const curRoute = useMemo(() => defaultFieldValue(defaultValues.curRoute), [])
	// const [curRoute, setCurRoute] = useState(defaultFieldValue(defaultValues.curRoute));
	const isFooterRout = useCallback(() => {
		return footerCategories.includes(
			DRIVER_ROUTES[curRoute.value]?.category[0],
		);
	}, [curRoute]);
	// const curRouteRules = [v => v !== '' || 'Укажите маршрут'];

	const [meetDate, setMeetDate] = useState(defaultFieldValue(defaultValues.meetDate));
	const meetDateRules = [v => !!v || 'Укажите дату'];

	const [meetTime, setMeetTime] = useState(defaultFieldValue(defaultValues.meetTime));
	const meetTimeRules = [v => v.length > 3 || 'Укажите время'];

	const [meetPlace, setMeetPlace] = useState(defaultFieldValue(defaultValues.meetPlace));
	const meetPlaceRules = [v => !!v || 'Укажите место сбора'];

	const [car, setCar] = useState(defaultFieldValue(defaultValues.car));
	const carRules = [v => (!isFooterRout() ? v !== '' || 'Выберите авто' : true)];

	const [emptySeats, setEmptySeats] = useState(defaultFieldValue(defaultValues.emptySeats));
	const emptySeatsRules = [v => !!+v || 'Укажите колличество свободных мест'];

	const [cost, setCost] = useState(defaultFieldValue(defaultValues.cost));
	const costRules = [];

	const [discription, setDiscription] = useState(defaultFieldValue(defaultValues.discription));
	const discriptionRules = [
		v => !!v || 'Введите описание',
		v => v.length > 9 || `Минимум 10 символов. Сейчас ${v.length}`,
	];

	useEffect(() => {
		car.value !== '' &&
			car.value !== defaultValues.car &&
			setEmptySeats(old => ({
				...old,
				value: USER.cars.matrixValue[car.value].seats,
			}));
	}, [car]);

	const valuesIsChanged = () => {
		let res = false;
		Object.keys(defaultValues).forEach(key => {
			if (key === 'meetDate') {
				if (
					new Date(defaultValues[key]).toISOString().slice(0, 10) !==
					new Date(eval(key).value).toISOString().slice(0, 10)
				) {
					res = true;
				}
			} else {
				if (defaultValues[key] !== eval(key).value) {
					res = true;
				}
			}
		});
		return res;
	};

	const fields = [
		// {field: {...curRoute, rules: curRouteRules}, func: setCurRoute},
		{field: {...meetDate, rules: meetDateRules}, func: setMeetDate},
		{field: {...meetTime, rules: meetTimeRules}, func: setMeetTime},
		{field: {...meetPlace, rules: meetPlaceRules}, func: setMeetPlace},
		{field: {...car, rules: carRules}, func: setCar},
		{field: {...emptySeats, rules: emptySeatsRules}, func: setEmptySeats},
		{field: {...cost, rules: costRules}, func: setCost},
		{field: {...discription, rules: discriptionRules}, func: setDiscription},
	];

	const [successModal, setSuccessModal] = useState({
		status: false,
		success: true,
		text: changesMsg,
	});
	const [isLoading, setLoading] = useState(false);
	const [isConfirm, setIsConfirm] = useState(false);

	const createChangesData = () => {
		const cahnges = {};
		const date = new Date(meetDate.value);
		date.setHours(+meetTime.value.substr(0, 2));
		date.setMinutes(+meetTime.value.substr(3, 2));

		cDate.toISOString() !== date.toISOString() && (cahnges.date = date);
		defaultValues.car !== car.value && (cahnges.car_id = USER.cars.matrixValue[car.value].id);
		defaultValues.emptySeats !== emptySeats.value && (cahnges.empty_seats = emptySeats.value);
		defaultValues.discription !== discription.value && (cahnges.description = discription.value.trim());
		defaultValues.meetPlace !== meetPlace.value && (cahnges.place = meetPlace.value.trim());
		defaultValues.cost !== cost.value && (cahnges.price = +cost.value);
		trip.empty_seats < emptySeats.value && (cahnges.full = 0)
		return cahnges;
	};

	const validation = () => {
		if (trip.users_count > +emptySeats.value) {
			setSuccessModal({
				...successModal,
				text: `Свободных мест - ${emptySeats.value}\nУчастников - ${trip.users_count}`,
				success: false,
				status: true,
			});
			return false;
		}

		const errors = validator(fields);
		if (errors.length) return false;
		return true;
	};

	const pathPersonalPlaningTrip = async () => {
		if (!validation()) return;

		setLoading(true);

		const data = createChangesData();
		const tripResp = await PATCH_TRIP(trip.id, data);

		if (!tripResp.success) {
			setSuccessModal({
				...successModal,
				text: tripResp.message,
				success: tripResp.success,
			});
		} else {
			setSuccessModal({
				...successModal,
				text: changesMsg,
				success: tripResp.success,
				type: 'edit',
			});
		}

		setLoading(false);
	};

	const deletePersonalPlaningTrip = useCallback(async () => {
		setIsConfirm(false);
		setLoading(true);
		const deleteTripResp = await DELETE_TRIP(trip.id);
		setLoading(false);

		if (!deleteTripResp.success) {
			setSuccessModal({
				...successModal,
				text: deleteTripResp.message,
				success: deleteTripResp.success,
			});
		} else {
			setSuccessModal({
				...successModal,
				text: delTripMsg,
				success: deleteTripResp.success,
			});
		}
	}, [successModal]);

	const closeSuccess = useCallback(() => {
		if (successModal.success) {
			FETCH_DRIVER_TRIPS(USER.id);
			successModal.type === 'edit'
				? navigation.goBack()
				: navigation.dispatch(
					CommonActions.navigate({
						name: 'PersonalCabinet',
						params: {},
					})
				);
		} else {
			setSuccessModal({
				...successModal,
				status: false,
			});
		}
	}, [successModal]);

	const SectionTitle = useCallback(({title, testID}) => {
		return (
			<View style={styles.section} testID={testID}>
				<AppText style={styles.sectionTitle}>{title}</AppText>
			</View>
		);
	}, []);

	const saveMeetDate = useCallback(v => {
		const [day, month, year] = v.split('.');
		const date = `${year}-${month}-${day}`;
		saveFieldValue(setMeetDate, {...meetDate, rules: meetDateRules}, date);
	}, [meetDate]);
	const saveMeetTime = useCallback(v => saveFieldValue(setMeetTime, {...meetTime, rules: meetTimeRules}, checkTimeValue(v)), [meetTime]);
	const saveMeetPlace = useCallback(v => saveFieldValue(setMeetPlace, {...meetPlace, rules: meetPlaceRules}, v), [meetPlace]);
	const saveCar = useCallback(v => saveFieldValue(setCar, {...car, rules: carRules},v), [car]);
	const saveEmptySeats = useCallback(v => saveFieldValue(setEmptySeats, {...emptySeats, rules: emptySeatsRules}, v), [emptySeats]);
	const saveCost = useCallback(v => saveFieldValue(setCost, {...cost, rules: costRules}, v), [cost]);
	const saveDiscription = useCallback(v => saveFieldValue(setDiscription, {...discription, rules: discriptionRules}, v), [discription]);

	const closeSplashLoader = useCallback(() => setLoading(false), []);
	const hideSplashLoader = useCallback(() => setSuccessModal({...successModal, status: true}), [successModal]);

	const minDate = useMemo(() => new Date(), []);
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
				сompleteTestID={'successBtn'}
				ready={valuesIsChanged()}
				title={'Редактирование поездки'}
				style={styles.header}
				onLeftPress={() => navigation.goBack()}
				onRightPress={() => pathPersonalPlaningTrip()}
			/>
			<KeyboardAwareScrollView
				testID={'scrollView'}
				style={styles.container}
				contentContainerStyle={styles.contentContainer}
				extraHeight={120}>
				<View style={styles.inputsWr}>
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
						!isFooterRout() &&
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
				<DeadBtn
					testID={'deleteTripBtn'}
					style={styles.deleteBtn}
					text={'Удалить'}
					onPress={() => {
						setIsConfirm(true);
					}}
				/>
			</KeyboardAwareScrollView>
			<SplashLoader
				isVisible={isLoading}
				close={closeSplashLoader}
				onModalHide={hideSplashLoader}
				text={loaderMsg}
			/>
			<SuccessMessage
				closeTestId={'closeSuccessBtn'}
				isVisible={successModal.status}
				success={successModal.success}
				message={successModal.text}
				close={closeSuccess}
			/>
			<Confirm
				isOpen={isConfirm}
				onCancel={() => setIsConfirm(false)}
				onConfirm={deletePersonalPlaningTrip}
				title={delTripTitle}
				textConfirm={'Да'}
			/>
		</SafeAreaView>
	);
};

const mapStateToProps = state => {
	return {
		USER: state.user.data,
		DRIVER_ROUTES: state.user.driverRoutes,
		DRIVER_TRIPS: state.user.driverTrips,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		PATCH_TRIP: (id, data) => dispatch(patchTrip(id, data)),
		FETCH_DRIVER_TRIPS: id => dispatch(fetchDriverTrips(id)),
		DELETE_TRIP: id => dispatch(deleteTrip(id)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(PersonalPlaningTripEdit);
