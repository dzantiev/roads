import React, {useCallback, useMemo, useState, useEffect} from 'react';
import {View, SafeAreaView, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {API_URL} from '@env';
import {
	DeadBtn,
	AppText,
	AnimTextInput,
	ImageLoader,
	SuccessMessage,
	TopNav,
	SplashLoader,
	Confirm,
} from '../../../components/';
import {updateUserData} from '../../../store/actions/userAction';
import {styles} from './styles.js';
import {patchCar, deleteCar} from '../../../store/actions/carAction';
import {uploadImage} from '../../../store/actions/imageAction';
import {
	createImgFormData,
	imgDecrement,
	imgIncrement,
	validator,
	saveFieldValue,
	defaultFieldValue,
} from '../../../services';
import {changesWaiting, delCarTitle, carDeleted, minCarYear, changesMsg} from '../../../variables';
import AppMetrica from 'react-native-appmetrica';

const EditAuto = ({
	navigation,
	route,
	USER,
	PATCH_CAR,
	UPLOAD_IMAGE,
	DELETE_CAR,
	UPDATE_USER_DATA,
}) => {
	useEffect(() => {
		AppMetrica.reportEvent(route.name);
	}, []);

	const car = useMemo(() =>
		USER.cars.matrixValue.find(el => el.id === route.params.carId),
	[USER]);

	const defaultValues = useMemo(() => ({
		company: car.company,
		model: car.model,
		year: car.year,
		seats: car.seats,
		images: car.images.map((el, i) => ({
			id: i,
			name: el.upName,
			uri: API_URL + el.localPath,
		})),
	}), []);

	const [company, setCompany] = useState({
		...defaultFieldValue(defaultValues.company),
		rules: [v => !!v || 'Укажите марку'],
	});
	const [model, setModel] = useState({
		...defaultFieldValue(defaultValues.model),
		rules: [v => !!v || 'Укажите модель'],
	});
	const [year, setYear] = useState({
		...defaultFieldValue(defaultValues.year),
		rules: [
			v => !!v || 'Укажите год выпуска',
			v =>
				(minCarYear < +v && +v < +new Date().getFullYear()) ||
				'Укажите корректный год',
		],
	});
	const [seats, setSeats] = useState({
		...defaultFieldValue(defaultValues.seats),
		rules: [v => !!v || 'Укажите количество мест'],
	});

	const [images, setImages] = useState(() => defaultValues.images);
	const [carImages, setCarImages] = useState(car?.images);
	const [newImages, setNewImages] = useState([]);
	const [imagesStatus, setImagesStatus] = useState({
		// отображение ошибки
		status: false,
		text: '',
	});
	const imageRules = useMemo(() => ({
		// отслеживание изменений в images
		value: images,
		rules: [v => v.length || 'Укажите изображение'],
	}), [images]);

	const fields = [
		{field: company, func: setCompany},
		{field: model, func: setModel},
		{field: year, func: setYear},
		{field: seats, func: setSeats},
		{field: imageRules, func: setImagesStatus},
	];

	const [isLoading, setIsLoading] = useState(false);
	const [successModal, setSuccessModal] = useState({
		status: false,
		success: true,
		text: changesWaiting,
	});
	const [isConfirm, setIsConfirm] = useState(false);

	const valuesIsChanged = () => {
		let res = false;
		Object.keys(defaultValues).forEach(key => {
			if (key === 'images') {
				if (defaultValues.images.length === images.length) {
					defaultValues.images.forEach((el, i) => {
						if (el.name !== images[i].name) res = true;
					});
				} else {
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
	const impFields = {company, model, year};
	const importentValuesIsChanged = useMemo(() => {
		return Object.keys(impFields)
			.some(key => impFields[key].value !== defaultValues[key]);
	}, Object.values(impFields));

	const uploudImages = useCallback(async () => {
		const imagesFormData = createImgFormData('cars', 'images', newImages);
		return await UPLOAD_IMAGE(imagesFormData);
	}, [newImages]);

	const imagesManager = useCallback(imgsList => {
		if (imgsList.length < images.length) {
			const [newCarImages, filterImages] = imgDecrement(
				imgsList,
				carImages,
				newImages,
			);
			newCarImages.length && setCarImages(newCarImages);
			filterImages.length && setNewImages(filterImages);
		} else {
			setNewImages([...newImages, ...imgIncrement(imgsList, images)]);
			setImagesStatus({status: false, text: ''});
		}

		setImages(imgsList);
	}, [images, carImages, newImages]);

	const editCarComplete = async () => {
		const errors = validator(fields);
		if (errors.length) return;

		setIsLoading(true);

		let uploadImgsResp = null;
		let newImsForUpload = null;

		if (newImages.length) {
			uploadImgsResp = await uploudImages();
			newImsForUpload = uploadImgsResp.value.map(el => ({
				...el,
				new: true,
			}));
		}

		const data = {
			company: company.value.trim(),
			model: model.value.trim(),
			year: year.value,
			seats: seats.value,
			images: newImsForUpload
				? [...carImages, ...newImsForUpload]
				: carImages,
		};

		if (importentValuesIsChanged) data.is_approved = 0;

		const carResp = await PATCH_CAR(car.id, data);

		if (!carResp.success) {
			setSuccessModal({
				...successModal,
				text: carResp.message,
				success: carResp.success,
			});
		} else {
			setSuccessModal({
				...successModal,
				text: importentValuesIsChanged ? changesWaiting : changesMsg,
				success: carResp.success,
			});
			UPDATE_USER_DATA(USER.id);
		}

		setIsLoading(false);
	};

	const deleteCarHandler = useCallback(async () => {
		setIsLoading(true);

		const carResp = await DELETE_CAR(car.id);

		if (!carResp.success) {
			setSuccessModal({
				...successModal,
				text: carResp.message,
				success: carResp.success,
			});
		} else {
			setSuccessModal({
				...successModal,
				text: carDeleted,
				success: carResp.success,
			});
			UPDATE_USER_DATA(USER.id);
		}

		setIsLoading(false);
	}, [successModal, car]);

	const SectionTitle = useCallback(({title}) => {
		return (
			<View style={styles.sectionWr}>
				<AppText style={styles.sectionTitle}>{title}</AppText>
			</View>
		);
	}, []);

	const saveCompany = useCallback((v) => saveFieldValue(setCompany, company, v), [company]);
	const saveModel = useCallback((v) => saveFieldValue(setModel, model, v), [model]);
	const saveYear = useCallback((v) => saveFieldValue(setYear, year, v), [year]);
	const saveSeats = useCallback((v) => saveFieldValue(setSeats, seats, v), [seats]);

	const closeSuccessMessage = useCallback(() => navigation.goBack(), []);
	const closeSplashLoader = useCallback(() => setIsLoading(false), []);
	const hideSplashLoader = useCallback(() => setSuccessModal({
		...successModal,
		status: true,
	}), [successModal]);
	const closeConfirm = useCallback(() => setIsConfirm(false), []);
	const onConfirm = useCallback(() => {
		setIsConfirm(false);
		deleteCarHandler();
	}, [deleteCarHandler]);

	const companyError = useMemo(() => company.status ? company.text : null, [company]);
	const modelError = useMemo(() => model.status ? model.text : null, [model]);
	const yearError = useMemo(() => year.status ? year.text : null, [year]);
	const seatsError = useMemo(() => seats.status ? seats.text : null, [seats]);
	const carImgsError = useMemo(() => imagesStatus.status ? imagesStatus.text : null, [imagesStatus]);

	const seatsWrapperStyle = useMemo(() => ({
		...styles.underlineInpute,
		...(seats.status && {
			borderBottomColor: '#FE693A',
		}),
	}), [seats]);

	return (
		<SafeAreaView style={styles.container}>
			<TopNav
				сompleteTestID={'successBtn'}
				ready={valuesIsChanged()}
				title={`${car?.company} ${car?.model}`}
				onLeftPress={() => navigation.goBack()}
				onRightPress={editCarComplete}
			/>
			<ScrollView style={styles.wr}>
				<View style={styles.inputsWr}>
					<SectionTitle title={'Автомобиль'}/>
					<AnimTextInput
						fieldTestID={'companyField'}
						style={styles.underlineInpute}
						prop={'company'}
						placeholder={'Марка'}
						onChangeAI={saveCompany}
						value={company.value}
						error={companyError}
					/>
					<AnimTextInput
						fieldTestID={'modelField'}
						style={styles.underlineInpute}
						prop={'model'}
						placeholder={'Модель'}
						onChangeAI={saveModel}
						value={model.value}
						error={modelError}
					/>
					<AnimTextInput
						fieldTestID={'yearField'}
						style={styles.underlineInpute}
						placeholder={'Год выпуска'}
						keyboardType={'numeric'}
						mask={'9999'}
						onChangeAI={saveYear}
						value={year.value}
						error={yearError}
					/>
					<AnimTextInput
						fieldTestID={'seatsField'}
						wrapperStyle={seatsWrapperStyle}
						placeholder={'Количество мест'}
						onChangeAI={saveSeats}
						value={seats.value}
						mask={'99'}
						keyboardType={'numeric'}
						error={seatsError}
					/>
					<ImageLoader
						testID={'imageField'}
						onChangeFiles={imagesManager}
						caption={'Загрузить фото'}
						prop={'images'}
						style={styles.largeInput}
						filesArray={images}
						error={carImgsError}
					/>
				</View>
				<DeadBtn
					testID={'autoDelBtn'}
					style={styles.bottomBtn}
					text={'Удалить'}
					onPress={() => {
						setIsConfirm(true);
					}}
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
				close={closeSplashLoader}
				onModalHide={hideSplashLoader}
			/>
			<Confirm
				isOpen={isConfirm}
				onCancel={closeConfirm}
				onConfirm={onConfirm}
				title={delCarTitle}
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
		PATCH_CAR: (id, data) => dispatch(patchCar(id, data)),
		UPLOAD_IMAGE: formData => dispatch(uploadImage(formData)),
		DELETE_CAR: carId => dispatch(deleteCar(carId)),
		UPDATE_USER_DATA: id => dispatch(updateUserData(id)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(EditAuto);
