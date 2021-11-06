import React, {useState, useRef} from 'react';
import {SafeAreaView, View} from 'react-native';
import {
	BigBtn,
	AppText,
	ImageLoader,
	DateField,
	AnimTextInput,
	SuccessMessage,
	SplashLoader,
	TopNav,
} from '../../../components/';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {connect} from 'react-redux';
import {styles} from './styles.js';
import {uploadImage} from '../../../store/actions/imageAction';
import {createDriver} from '../../../store/actions/driverAction';
import {updateUserData} from '../../../store/actions/userAction';
import {createImgFormData, saveFieldValue, stringToDate, validator} from '../../../services';
import {requestOnOrganizerMsg, REQUEST_CREATED} from '../../../variables';

const RequestOnOrganizer = ({
	navigation,
	USER,
	UPLOAD_IMAGE,
	CREATE_DRIVER,
	UPDATE_USER_DATA,
}) => {
	const [wrapper, setWrapper] = useState(null);

	const defaultDateValidators = [
		v => !!v || 'Заполните это поле',
		v => v.length === 10 || 'Введите полную дату',
		v => {
			const [day, month, year] = v.split('.');
			const nowDate = new Date()
			const userDate = new Date(`${year}-${month}-${day}`)
			return nowDate > userDate || 'Несуществующая дата'
		},
	]

	const [passportSeries, setPassportSeries] = useState({
		value: '',
		status: false,
		coords: {},
		rules: [
			v => !!v || 'Заполните это поле',
			v => v.length >= 4 || `Мин длина 4. Сейчас ${v.length}`,
		],
	});
	const [passportNumber, setPassportNumber] = useState({
		value: '',
		status: false,
		coords: {},
		rules: [
			v => !!v || 'Заполните это поле',
			v => v.length >= 6 || `Мин длина 6. Сейчас ${v.length}`,
		],
	});
	const [passportCode, setPassportCode] = useState({
		value: '',
		status: false,
		coords: {},
		rules: [
			v => !!v || 'Заполните это поле',
			v => v.length >= 6 || `Мин длина 6. Сейчас ${v.length}`,
		],
	});
	const [passportCreator, setPassportCreator] = useState({
		value: '',
		status: false,
		coords: {},
		rules: [v => !!v || 'Заполните это поле'],
	});
	const [passportDate, setPassportDate] = useState({
		value: '',
		status: false,
		coords: {},
		rules: defaultDateValidators,
	});
	const [dateOfBirth, setDateOfBirth] = useState({
		value: '',
		status: false,
		coords: {},
		rules: [
			...defaultDateValidators,
			v => {
				const [day, month, year] = v.split('.');
				const curDate = new Date();
				const age = curDate.getFullYear() - +year;
				return age > 17 || 'Вы слишком молоды';
			},
		],
	});
	const [placeOfBirth, setPlaceOfBirth] = useState({
		value: '',
		status: false,
		coords: {},
		rules: [v => !!v || 'Укажите место рождения'],
	});
	const [passportImgs, setPassportImgs] = useState({
		value: [],
		status: false,
		coords: {},
		rules: [v => v.length > 0 || 'Приложите фото пасспорта'],
	});
	const [driverLicenseSeries, setDriverLicenseSeries] = useState({
		value: '',
		status: false,
		coords: {},
		rules: [v => !!v || 'Укажите серию СТС'],
	});
	const [driverLicenseNumber, setDriverLicenseNumber] = useState({
		value: '',
		status: false,
		coords: {},
		rules: [v => !!v || 'Укажите номер СТС'],
	});
	const [driverLicenseCategory, setDriverLicenseCategory] = useState({
		value: '',
		status: false,
		coords: {},
		rules: [v => !!v || 'Укажите категорию(ии) ВУ'],
	});
	const [driverLicenseDate, setDriverLicenseDate] = useState({
		value: '',
		status: false,
		rule: 1,
		coords: {},
		rules: defaultDateValidators,
	});
	const [driverLicenseImgs, setDriverLicenseImgs] = useState({
		value: [],
		status: false,
		coords: {},
		rules: [v => v.length > 0 || 'Приложите фото ВУ'],
	});
	const [isLoading, setLoading] = useState(false);
	const [successModal, setSuccessModal] = useState({
		status: false,
		success: true,
		text: requestOnOrganizerMsg,
	});

	const fields = [
		{field: passportSeries, func: setPassportSeries},
		{field: passportNumber, func: setPassportNumber},
		{field: passportCode, func: setPassportCode},
		{field: passportCreator, func: setPassportCreator},
		{field: passportDate, func: setPassportDate},
		{field: dateOfBirth, func: setDateOfBirth},
		{field: placeOfBirth, func: setPlaceOfBirth},
		{field: passportImgs, func: setPassportImgs},
		{field: driverLicenseSeries, func: setDriverLicenseSeries},
		{field: driverLicenseNumber, func: setDriverLicenseNumber},
		{field: driverLicenseCategory, func: setDriverLicenseCategory},
		{field: driverLicenseDate, func: setDriverLicenseDate},
		{field: driverLicenseImgs, func: setDriverLicenseImgs},
	];

	const sendDriverForm = async () => {
		const passportImgsFormData = createImgFormData(
			'drivers_data',
			'passport_images',
			passportImgs.value,
		);

		const driverLicenseImgsFormData = createImgFormData(
			'drivers_data',
			'driver_license_images',
			driverLicenseImgs.value,
		);

		const responsePassportImgs = await UPLOAD_IMAGE(passportImgsFormData);
		const responseDriverLicenseImgs = await UPLOAD_IMAGE(
			driverLicenseImgsFormData,
		);

		const createDriverResp = await CREATE_DRIVER({
			passport_series: passportSeries.value,
			passport_number: passportNumber.value,
			passport_code: passportCode.value,
			passport_creator: passportCreator.value,
			passport_date: stringToDate(passportDate.value),
			passport_images: responsePassportImgs.value,
			date_of_birth: stringToDate(dateOfBirth.value),
			place_of_birth: placeOfBirth.value,
			driver_license_series: driverLicenseSeries.value,
			driver_license_number: driverLicenseNumber.value,
			driver_license_date: stringToDate(driverLicenseDate.value),
			driver_license_category: driverLicenseCategory.value,
			driver_license_images: responseDriverLicenseImgs.value,
			created_date: new Date(),
			status: [REQUEST_CREATED],
			user_id: USER.id,
		});

		return createDriverResp;
	};

	const sendRequestOnOrganizer = async () => {
		const errors = validator(fields);
		// if (!validator(fields)) {
		if (errors.length) {
			wrapper.scrollTo({y: errors[0].field.coords.y});
			return;
		}

		setLoading(true);

		const response = await sendDriverForm();

		UPDATE_USER_DATA(USER.id);

		if (!response.success) {
			setSuccessModal({
				...successModal,
				text: response.message,
				success: response.success,
			});
		} else {
			setSuccessModal({
				...successModal,
				text: requestOnOrganizerMsg,
				success: response.success,
			});
			UPDATE_USER_DATA(USER.id);
		}

		setLoading(false);
	};

	const SectionTitle = ({title}) => {
		return (
			<View style={styles.sectionWr}>
				<AppText style={styles.sectionTitle}>{title}</AppText>
			</View>
		);
	};

	const dateValidator = v => {
		const [day, month, year] = v.split('.');
		let curDate = ''
		const curDay = +day > 31 ? 31 : day;
		curDate += curDay + '.'
		if (month) {
			const curMonth = +month > 12 ? 12 : month;
			curDate += curMonth + '.'
		}
		if (year) {
			const nowYear = (new Date()).getFullYear();
			const curYear = nowYear > year ? year : nowYear;
			curDate += curYear
		}
		return curDate;
	};

	return (
		<SafeAreaView style={styles.container}>
			<TopNav
				style={styles.header}
				title={'Стать водителем'}
				onLeftPress={() => navigation.goBack()}
			/>
			<KeyboardAwareScrollView
				style={styles.wr}
				innerRef={ref => setWrapper(ref)}>
				<View style={styles.inputsWr}>
					<SectionTitle title={'Паспорт'} />
					<AnimTextInput
						style={{...styles.defaultInput, ...styles.textInputEnd}}
						placeholder={'Серия'}
						mask={'9999'}
						keyboardType={'numeric'}
						getLayoutData={data =>
							setPassportSeries({...passportSeries, coords: data})
						}
						onChangeAI={value =>
							saveFieldValue(
								setPassportSeries,
								passportSeries,
								value,
							)
						}
						value={passportSeries.value}
						{...(passportSeries.status && {
							error: passportSeries.text,
						})}
					/>
					<AnimTextInput
						style={{...styles.defaultInput, ...styles.textInputEnd}}
						placeholder={'Номер'}
						mask={'999999'}
						keyboardType={'numeric'}
						getLayoutData={data =>
							setPassportNumber({...passportNumber, coords: data})
						}
						onChangeAI={value =>
							saveFieldValue(
								setPassportNumber,
								passportNumber,
								value,
							)
						}
						value={passportNumber.value}
						{...(passportNumber.status && {
							error: passportNumber.text,
						})}
					/>
					<AnimTextInput
						style={{...styles.defaultInput, ...styles.textInputEnd}}
						placeholder={'Код подразделения'}
						mask={'999-999'}
						keyboardType={'numeric'}
						getLayoutData={data =>
							setPassportCode({...passportCode, coords: data})
						}
						onChangeAI={value =>
							saveFieldValue(
								setPassportCode,
								passportCode,
								value?.replace('-', ''),
							)
						}
						value={passportCode.value}
						{...(passportCode.status && {
							error: passportCode.text,
						})}
					/>
					<AnimTextInput
						style={{...styles.defaultInput, ...styles.textInputEnd}}
						placeholder={'Кем выдан'}
						getLayoutData={data =>
							setPassportCreator({
								...passportCreator,
								coords: data,
							})
						}
						onChangeAI={value =>
							saveFieldValue(
								setPassportCreator,
								passportCreator,
								value,
							)
						}
						value={passportCreator.value}
						{...(passportCreator.status && {
							error: passportCreator.text,
						})}
					/>
					<AnimTextInput
						placeholder={'Дата выдачи'}
						style={{...styles.defaultInput, ...styles.textInputEnd}}
						mask={'99.99.9999'}
						keyboardType={'numeric'}
						getLayoutData={data =>
							setPassportDate({...passportDate, coords: data})
						}
						onChangeAI={v =>
							saveFieldValue(
								setPassportDate,
								passportDate,
								dateValidator(v),
							)
						}
						value={passportDate.value}
						{...(passportDate.status && {
							error: passportDate.text,
						})}
					/>
					<AnimTextInput
						placeholder={'Дата рождения'}
						style={{...styles.defaultInput, ...styles.textInputEnd}}
						mask={'99.99.9999'}
						keyboardType={'numeric'}
						getLayoutData={data =>
							setDateOfBirth({...dateOfBirth, coords: data})
						}
						onChangeAI={v =>
							saveFieldValue(
								setDateOfBirth,
								dateOfBirth,
								// dateValidator(v),
								dateValidator(v),
							)
						}
						value={dateOfBirth.value}
						{...(dateOfBirth.status && {
							error: dateOfBirth.text,
						})}
					/>
					<AnimTextInput
						wrapperStyle={{
							...styles.textInputEnd,
							...(placeOfBirth.status && {
								borderBottomColor: '#FE693A',
							}),
						}}
						style={styles.defaultInput}
						placeholder={'Место рождения'}
						getLayoutData={data =>
							setPlaceOfBirth({...placeOfBirth, coords: data})
						}
						onChangeAI={value =>
							saveFieldValue(setPlaceOfBirth, placeOfBirth, value)
						}
						value={placeOfBirth.value}
						errorStyle={{bottom: -13}}
						{...(placeOfBirth.status && {
							error: placeOfBirth.text,
						})}
					/>
					<ImageLoader
						maxImages={2}
						getLayoutData={data =>
							setPassportImgs({...passportImgs, coords: data})
						}
						onChangeFiles={value =>
							saveFieldValue(setPassportImgs, passportImgs, value)
						}
						value={passportImgs.value}
						caption={'Загрузить фото паспорта'}
						style={{...styles.largeInput, ...styles.endSection}}
						{...(passportImgs.status && {
							error: passportImgs.text,
						})}
					/>
					<SectionTitle title={'Удостоверение водителя'} />
					<AnimTextInput
						style={{...styles.defaultInput, ...styles.textInputEnd}}
						placeholder={'Серия'}
						mask={'99999'}
						keyboardType={'numeric'}
						getLayoutData={data =>
							setDriverLicenseSeries({
								...driverLicenseSeries,
								coords: data,
							})
						}
						onChangeAI={value =>
							saveFieldValue(
								setDriverLicenseSeries,
								driverLicenseSeries,
								value,
							)
						}
						value={driverLicenseSeries.value}
						{...(driverLicenseSeries.status && {
							error: driverLicenseSeries.text,
						})}
					/>
					<AnimTextInput
						style={{...styles.defaultInput, ...styles.textInputEnd}}
						placeholder={'Номер'}
						mask={'9999999'}
						keyboardType={'numeric'}
						getLayoutData={data =>
							setDriverLicenseNumber({
								...driverLicenseNumber,
								coords: data,
							})
						}
						onChangeAI={value =>
							saveFieldValue(
								setDriverLicenseNumber,
								driverLicenseNumber,
								value,
							)
						}
						value={driverLicenseNumber.value}
						{...(driverLicenseNumber.status && {
							error: driverLicenseNumber.text,
						})}
					/>
					<AnimTextInput
						placeholder={'Дата выдачи'}
						style={{...styles.defaultInput, ...styles.textInputEnd}}
						mask={'99.99.9999'}
						keyboardType={'numeric'}
						getLayoutData={data =>
							setDriverLicenseDate({...driverLicenseDate, coords: data})
						}
						onChangeAI={v =>
							saveFieldValue(
								setDriverLicenseDate,
								driverLicenseDate,
								dateValidator(v),
							)
						}
						value={driverLicenseDate.value}
						{...(driverLicenseDate.status && {
							error: driverLicenseDate.text,
						})}
					/>
					<AnimTextInput
						wrapperStyle={{
							...styles.textInputEnd,
							...(driverLicenseCategory.status && {
								borderBottomColor: '#FE693A',
							}),
						}}
						style={styles.defaultInput}
						placeholder={'Категория'}
						getLayoutData={data =>
							setDriverLicenseCategory({
								...driverLicenseCategory,
								coords: data,
							})
						}
						onChangeAI={value =>
							saveFieldValue(
								setDriverLicenseCategory,
								driverLicenseCategory,
								value.toUpperCase(),
							)
						}
						value={driverLicenseCategory.value}
						errorStyle={{bottom: -13}}
						{...(driverLicenseCategory.status && {
							error: driverLicenseCategory.text,
						})}
					/>
					<ImageLoader
						maxImages={2}
						getLayoutData={data =>
							setDriverLicenseImgs({
								...driverLicenseImgs,
								coords: data,
							})
						}
						onChangeFiles={value =>
							saveFieldValue(
								setDriverLicenseImgs,
								driverLicenseImgs,
								value,
							)
						}
						caption={'Загрузить фото удостоверения'}
						style={{...styles.largeInput, ...styles.endSection}}
						value={driverLicenseImgs.value}
						{...(driverLicenseImgs.status && {
							error: driverLicenseImgs.text,
						})}
					/>
				</View>
				<BigBtn
					style={styles.submit}
					caption={'Отправить заявку'}
					onPress={() => sendRequestOnOrganizer()}
				/>
			</KeyboardAwareScrollView>
			<SuccessMessage
				isVisible={successModal.status}
				success={successModal.success}
				message={successModal.text}
				close={() => {
					successModal.success
						? navigation.goBack()
						: setSuccessModal({
							...successModal,
							status: false,
						});
				}}
			/>
			<SplashLoader
				isVisible={isLoading}
				text={'Заявка отправляется\nэто может занять некоторое время'}
				close={() => setLoading(false)}
				onModalHide={() =>
					setSuccessModal({
						...successModal,
						status: true,
					})
				}
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
		CREATE_DRIVER: data => dispatch(createDriver(data)),
		UPLOAD_IMAGE: formData => dispatch(uploadImage(formData)),
		UPDATE_USER_DATA: id => dispatch(updateUserData(id)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(RequestOnOrganizer);
