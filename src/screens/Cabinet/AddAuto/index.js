import React, {useMemo, useState, useCallback, useEffect} from 'react';
import {View, SafeAreaView, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {
	AnimTextInput,
	BigBtn,
	AppText,
	ImageLoader,
	SuccessMessage,
	TopNav,
	SplashLoader,
} from '../../../components/';
import {styles} from './styles.js';
import {createCar} from '../../../store/actions/carAction';
import {uploadImage} from '../../../store/actions/imageAction';
import {updateUserData} from '../../../store/actions/userAction';
import {createImgFormData, validator, saveFieldValue, defaultFieldValue} from '../../../services';
import {carAddMsg, minCarYear} from '../../../variables';
import AppMetrica from 'react-native-appmetrica';

const AddAuto = ({
	navigation,
	route,
	USER,
	CREATE_CAR,
	UPLOAD_IMAGE,
	UPDATE_USER_DATA,
}) => {
	useEffect(() => {
		AppMetrica.reportEvent(route.name);
	}, []);

	const [numer, setNumer] = useState({
		...defaultFieldValue(''),
		rules: [
			v => !!v || 'Укажите гос номер код',
			// v => /[а-я][0-9]{3}[а-я]{2}[0-9]{2,3}/.test(v) || 'Хрень'
		],
	});
	const [company, setCompany] = useState({
		value: '',
		status: false,
		text: '',
		rules: [v => !!v || 'Укажите марку'],
	});
	const [model, setModel] = useState({
		...defaultFieldValue(''),
		rules: [v => !!v || 'Укажите модель'],
	});
	const [year, setYear] = useState({
		...defaultFieldValue(''),
		rules: [
			v => !!v || 'Укажите год выпуска',
			v =>
				(minCarYear < +v && +v < +new Date().getFullYear()) ||
				'Укажите корректный год',
		],
	});
	const [seats, setSeats] = useState({
		...defaultFieldValue(''),
		rules: [v => !!+v || 'Укажите количество мест'],
	});
	// const [stsImgs, setStsImgs] = useState({
	// 	...defaultFieldValue([]),
	// 	rules: [
	// 		v => v.length || 'Прикрепите изображения СТС',
	// 		v => v.length > 1 || 'Прикрепите обе стороны СТС',
	// 	],
	// });
	const [carImgs, setCarImgs] = useState({
		...defaultFieldValue([]),
		rules: [v => v.length || 'Прикрепите изображения авто'],
	});

	const [isLoading, setLoading] = useState(false);
	const [successModal, setSuccessModal] = useState({
		status: false,
		success: true,
		text: carAddMsg,
	});

	const fields = [
		{field: numer, func: setNumer},
		{field: company, func: setCompany},
		{field: model, func: setModel},
		{field: year, func: setYear},
		{field: seats, func: setSeats},
		// {field: stsImgs, func: setStsImgs},
		{field: carImgs, func: setCarImgs},
	];

	const sendImages = useCallback(async formData => {
		const response = await UPLOAD_IMAGE(formData);
		if (response.success) {
			return response;
		}
		setLoading(false);
		setSuccessModal({
			...successModal,
			text: response.message,
			success: response.success,
		});
		return undefined;
	}, [successModal]);

	const sendForm = async () => {
		const errors = validator(fields);
		if (errors.length) return;
		// if (!validator(fields)) return;

		setLoading(true);

		// const stsFormData = createImgFormData(
		// 	'cars',
		// 	'sts_images',
		// 	stsImgs.value,
		// );
		// const responseSts = await sendImages(stsFormData);
		// if (!responseSts) return;
		// const stsImages = responseSts.value;

		const imagesFormData = createImgFormData(
			'cars',
			'images',
			carImgs.value,
		);
		const responseImages = await sendImages(imagesFormData);
		if (!responseImages) return;
		const currentImages = responseImages.value;

		const response = await CREATE_CAR({
			user_id: USER.id,
			company: company.value.trim(),
			model: model.value.trim(),
			year: year.value,
			numer: numer.value.trim(),
			seats: seats.value,
			images: currentImages,
			// sts_images: stsImages,
		});

		if (!response.success) {
			setSuccessModal({
				...successModal,
				text: response.message,
				success: response.success,
			});
		} else {
			setSuccessModal({
				...successModal,
				text: carAddMsg,
				success: response.success,
			});
			UPDATE_USER_DATA(USER.id);
		}

		setLoading(false);
	};

	const SectionTitle = useCallback(({title}) => {
		return (
			<View style={styles.section}>
				<AppText style={styles.sectionTitle}>{title}</AppText>
			</View>
		);
	}, []);

	const saveNumer = useCallback((v) => saveFieldValue(setNumer, numer, v), [numer]);
	const saveCompany = useCallback((v) => saveFieldValue(setCompany, company, v), [company]);
	const saveModel = useCallback((v) => saveFieldValue(setModel, model, v), [model]);
	const saveYear = useCallback((v) => saveFieldValue(setYear, year, v), [year]);
	const saveSeats = useCallback((v) => saveFieldValue(setSeats, seats, `${+v}`), [seats]);
	// const saveStsImgs = useCallback((v) => saveFieldValue(setStsImgs, stsImgs, v), [stsImgs]);
	const saveCarImgs = useCallback((v) => saveFieldValue(setCarImgs, carImgs, v), [carImgs]);

	const closeSuccessMessage = useCallback(() => {
		successModal.success
			? navigation.goBack()
			: setSuccessModal({
				...successModal,
				status: false,
			});
	}, [successModal]);
	const closeSplashLoader = useCallback(() => setLoading(false), []);
	const hideSplashLoader = useCallback(() =>
		setSuccessModal({
			...successModal,
			status: true,
		}), [successModal]);

	const numerError = useMemo(() => numer.status ? numer.text : null, [numer]);
	const companyError = useMemo(() => company.status ? company.text : null, [company]);
	const modelError = useMemo(() => model.status ? model.text : null, [model]);
	const yearError = useMemo(() => year.status ? year.text : null, [year]);
	const seatsError = useMemo(() => seats.status ? seats.text : null, [seats]);
	// const stsImgsError = useMemo(() => stsImgs.status ? stsImgs.text : null, [stsImgs]);
	const carImgsError = useMemo(() => carImgs.status ? carImgs.text : null, [carImgs]);

	const seatsWrapperStyle = useMemo(() => ({
		...styles.underlineInpute,
		...(seats.status && {
			borderBottomColor: '#FE693A',
		}),
	}), [seats]);
	const seatsErrorStyle = useMemo(() => ({bottom: -13}), []);

	return (
		<SafeAreaView style={styles.areaWrapper}>
			<TopNav
				style={styles.header}
				title={'Добавление автомобиля'}
				onLeftPress={() => navigation.goBack()}
			/>
			<ScrollView
				style={styles.container}
				contentContainerStyle={styles.contentContainer}>
				<View style={styles.contentGroup}>
					<SectionTitle title={'Автомобиль'}/>
					<AnimTextInput
						fieldTestID={'numerField'}
						placeholder={'Гос номер'}
						placeholderPadding={16}
						onChangeAI={saveNumer}
						value={numer.value}
						style={styles.underlineInpute}
						error={numerError}
					/>
					<AnimTextInput
						fieldTestID={'companyField'}
						style={styles.underlineInpute}
						placeholder={'Марка'}
						placeholderPadding={16}
						onChangeAI={saveCompany}
						value={company.value}
						error={companyError}
					/>
					<AnimTextInput
						fieldTestID={'modelField'}
						style={styles.underlineInpute}
						placeholder={'Модель'}
						placeholderPadding={16}
						onChangeAI={saveModel}
						value={model.value}
						error={modelError}
					/>
					<AnimTextInput
						fieldTestID={'yearField'}
						style={styles.underlineInpute}
						placeholder={'Год выпуска'}
						placeholderPadding={16}
						onChangeAI={saveYear}
						value={year.value}
						mask={'9999'}
						keyboardType={'numeric'}
						error={yearError}
					/>
					<AnimTextInput
						fieldTestID={'seatsField'}
						wrapperStyle={seatsWrapperStyle}
						// style={styles.defaultInput}
						placeholder={'Пассажирских мест'}
						mask={'99'}
						keyboardType={'numeric'}
						placeholderPadding={16}
						onChangeAI={saveSeats}
						value={seats.value}
						errorStyle={seatsErrorStyle}
						error={seatsError}
					/>
					{/* <ImageLoader
						style={styles.imageLoader}
						onChangeFiles={saveStsImgs}
						caption={'Загрузить фото СТС'}
						maxImages={2}
						error={stsImgsError}
					/> */}
					<ImageLoader
						testID={'imageField'}
						style={styles.imageLoader}
						onChangeFiles={saveCarImgs}
						maxImages={10}
						caption={'Загрузить фото'}
						error={carImgsError}
					/>
				</View>
				<BigBtn
					testID={'addAutoBtn'}
					style={styles.submit}
					caption={'Отправить заявку'}
					onPress={() => sendForm()}
				/>
			</ScrollView>
			<SuccessMessage
				closeTestId={'closeSuccessBtn'}
				isVisible={successModal.status}
				success={successModal.success}
				message={successModal.text}
				close={closeSuccessMessage}
			/>
			<SplashLoader
				isVisible={isLoading}
				text={'Добавляем новый авто'}
				close={closeSplashLoader}
				onModalHide={hideSplashLoader}
			/>
		</SafeAreaView>
	);
};

const mapStateToProps = state => {
	return {
		USER: state.user.data,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		CREATE_CAR: data => dispatch(createCar(data)),
		UPLOAD_IMAGE: formData => dispatch(uploadImage(formData)),
		UPDATE_USER_DATA: id => dispatch(updateUserData(id)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(AddAuto);
