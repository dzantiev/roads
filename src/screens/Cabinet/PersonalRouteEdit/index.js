import React, {useCallback, useMemo, useState, useEffect} from 'react';
import {View, SafeAreaView, LogBox} from 'react-native';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import {connect} from 'react-redux';
import {API_URL} from '@env';
import styles from './styles';
import {
	AppText,
	TopNav,
	TextArea,
	AnimTextInput,
	PointsInput,
	ImageLoader,
	SuccessMessage,
	SplashLoader,
	Confirm,
	DeadBtn,
	SelectField,
} from '../../../components';
import {
	getDaysFromDuration,
	getHourseFromDuration,
	saveFieldValue,
	imgDecrement,
	imgIncrement,
	createImgFormData,
	validator,
	defaultFieldValue,
} from '../../../services';
import {uploadImage} from '../../../store/actions/imageAction';
import {fetchDriverRoutes} from '../../../store/actions/driverAction';
import {patchRoute, deleteRoute} from '../../../store/actions/routesAction';
import {
	changesMsg,
	delRouteTitle,
	delRouteMsg,
	loaderMsg,
	footerCategories,
} from '../../../variables';
import { CommonActions } from '@react-navigation/routers';
import AppMetrica from 'react-native-appmetrica';
import {RN_SRC_EXT} from '@env';


RN_SRC_EXT && LogBox.ignoreAllLogs();

const PersonalRouteEdit = ({
	navigation,
	route,
	USER,
	DRIVER_ROUTES,
	UPDATE_ROUTE,
	UPLOAD_IMAGE,
	FETCH_DRIVER_ROUTES,
	DELETE_ROUTE,
	CATEGORIES,
}) => {
	useEffect(() => {
		AppMetrica.reportEvent(route.name);
	}, []);

	const cRoute = useMemo(() => DRIVER_ROUTES.find(el => el.id === route.params.routeId), [DRIVER_ROUTES]);
	const routeTypes = useMemo(() => Object.values(CATEGORIES), []);
	const routeTypesKeys = useMemo(() => Object.keys(CATEGORIES), []);

	const defaultValues = useMemo(() => ({
		title: cRoute?.title || '',
		category: routeTypesKeys.findIndex(el => el === cRoute?.category[0]),
		locations: cRoute?.locations.matrixValue.map(el => ({
			id: el.id,
			value: el.name,
		})) || [],
		time: {
			hources: getHourseFromDuration(cRoute?.duration || 0),
			days: getDaysFromDuration(cRoute?.duration || 0),
		},
		price: cRoute?.price || '',
		description: cRoute?.description || '',
		images: cRoute?.images.map((el, index) => {
			return {
				id: index + 1,
				name: el.upName,
				uri: API_URL + el.localPath,
			};
		}) || [],
	}), [cRoute]);

	const [title, setTitle] = useState(defaultFieldValue(defaultValues.title));
	const titleRules = [v => !!v || 'Введите название'];

	const [category, setCategory] = useState(defaultFieldValue(defaultValues.category));
	const categoryRules = [
		v => v !== '' || 'Выберите категорию маршрута',
	];
	const isFooterRout = () => footerCategories.includes(routeTypesKeys[category.value]);

	const [locations, setLocations] = useState(defaultFieldValue(defaultValues.locations));
	const locationsRules = [
		v => v.length > 0 || 'Укажите точки маршрута',
		v => v.length > 2 || 'Мин количество точек от трех',
		v => v.every(el => !!el.value) || 'Введите название точки',
	];

	const [time, setTime] = useState(defaultFieldValue(defaultValues.time));
	const timeRules = [
		v =>
			!!+v.hources ||
			!!+v.days ||
			'Укажите продолжительность поездки',
	];

	const [price, setPrice] = useState(defaultFieldValue(defaultValues.price));
	const priceRules = [v => !!v || 'Укажите цену'];

	// Изображения для поля изображений
	const [images, setImages] = useState(() => defaultValues.images);
	const [routeImages, setRouteImages] = useState(cRoute?.images || []); // Изображения с сервера
	const [newImages, setNewImages] = useState([]); // новые изображения для дозагрузки
	const [imagesStatus, setImagesStatus] = useState({
		// отображение ошибки
		status: false,
		text: '',
	});
	const imageRules = {
		// отслеживание изменений в images
		value: images,
		rules: [v => v.length || 'Укажите изображение'],
	};

	const [description, setDescription] = useState(() => ({
		value: defaultValues.description,
		status: false,
		text: '',
	}));
	const descriptionRules = [
		v => !!v || 'Введите описание',
		v => v.length > 19 || `Минимум 20 символов. Сейчас ${v.length}`,
	];

	const [successModal, setSuccessModal] = useState({
		status: false,
		success: true,
		text: changesMsg,
	});
	const [isLoading, setLoading] = useState(false);
	const [isConfirm, setIsConfirm] = useState(false);

	const fields = [
		{field: {...title, rules: titleRules}, func: setTitle},
		{field: {...category, rules: categoryRules}, func: setCategory},
		{field: {...locations, rules: locationsRules}, func: setLocations},
		{field: {...time, rules: timeRules}, func: setTime},
		{field: {...price, rules: priceRules}, func: setPrice},
		{field: {...description, rules: descriptionRules}, func: setDescription},
		{field: imageRules, func: setImagesStatus},
	];

	const checkImagesIsChanged = useCallback(() => {
		if (defaultValues.images.length !== images.length) return true;
		let res = false;
		defaultValues.images.every((el, i) => {
			if (el.name !== images[i].name) {
				res = true;
				return false;
			}
			return true;
		});
		return res;
	}, [defaultValues, images]);
	const checkLocationsIsChanged = useCallback(() => {
		if (defaultValues.locations.length !== locations.value.length) return true;
		let res = false;
		defaultValues.locations.every((el, i) => {
			if (el.value !== locations.value[i].value) {
				res = true;
				return false;
			}
			return true;
		});
		return res;
	}, [defaultValues, locations]);

	const valuesIsChanged = () => {
		let res = false;
		Object.keys(defaultValues).forEach(key => {
			if (key === 'images') {
				const isImgsChanged = checkImagesIsChanged();
				isImgsChanged && (res = isImgsChanged);
			} else if (key === 'locations') {
				const isLocationsChanged = checkLocationsIsChanged();
				isLocationsChanged && (res = isLocationsChanged);
			} else if (key === 'time') {
				if (
					defaultValues[key].days !== +time.value.days ||
					defaultValues[key].hources !== +time.value.hources
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

	const imagesManager = useCallback(imgsList => {
		if (imgsList.length < images.length) {
			const [newRouteImages, filterImages] = imgDecrement(
				imgsList,
				routeImages,
				newImages,
			);
			newRouteImages.length && setRouteImages(newRouteImages);
			filterImages.length && setNewImages(filterImages);
		} else {
			setNewImages([...newImages, ...imgIncrement(imgsList, images)]);
			setImagesStatus({status: false, text: ''});
		}

		setImages(imgsList);
	}, [images, routeImages, newImages]);

	const uploudImages = async () => {
		const imagesFormData = createImgFormData('routes', 'images', newImages);
		return await UPLOAD_IMAGE(imagesFormData);
	};

	const computeDuration = () => {
		return (time.value.days * 24 + +time.value.hources) * 60 * 60 * 1000;
	};

	const createChangesData = async () => {
		const cahnges = {
			is_active: true,
		};
		if (checkImagesIsChanged()) {
			let uploadImgsResp = null;
			let newImsForUpload = null;

			if (newImages.length) {
				uploadImgsResp = await uploudImages();
				newImsForUpload = uploadImgsResp.value.map(el => ({
					...el,
					new: true,
				}));
			}
			cahnges.images = newImsForUpload ? [...routeImages, ...newImsForUpload] : routeImages
		}
		if (checkLocationsIsChanged()) {
			cahnges.locations = JSON.stringify(
				locations.value.map(el => ({id: el.id, name: el.value.trim()})),
			);
		}
		if (
			defaultValues.time.days !== +time.value.days ||
			defaultValues.time.hources !== +time.value.hources
		) cahnges.duration = computeDuration();

		title.value !== defaultValues.title && (cahnges.title = title.value.trim());
		category.value !== defaultValues.category && (cahnges.category = [Object.keys(CATEGORIES)[category.value]]);
		price.value !== defaultValues.price && (cahnges.price = price.value);
		description.value !== defaultValues.description && (cahnges.description = description.value.trim());
		return cahnges;
	};

	const saveChanges = async () => {
		const errors = validator(fields);
		if (errors.length) return;

		setLoading(true);

		const data = await createChangesData();
		const routeResp = await UPDATE_ROUTE(cRoute.id, data);

		if (!routeResp.success) {
			setSuccessModal({
				...successModal,
				text: routeResp.message,
				success: routeResp.success,
			});
		} else {
			setSuccessModal({
				...successModal,
				text: changesMsg,
				success: routeResp.success,
				type: 'edit',
			});
		}

		setLoading(false);
	};

	const deletePersonalTrip = useCallback(async () => {
		setIsConfirm(false);
		setLoading(true);
		const deleteRouteResp = await DELETE_ROUTE(cRoute.id);

		if (!deleteRouteResp.success) {
			setSuccessModal({
				...successModal,
				text: deleteRouteResp.message,
				success: deleteRouteResp.success,
			});
		} else {
			setSuccessModal({
				...successModal,
				text: delRouteMsg,
				success: deleteRouteResp.success,
			});
		}

		setLoading(false);
	}, [cRoute, successModal]);

	const closeSuccess = useCallback((success, type) => {
		if (success) {
			type === 'edit'
				? navigation.goBack()
				: navigation.dispatch(
					CommonActions.navigate({
						name: 'PersonalCabinet',
						params: {},
					})
				);
			FETCH_DRIVER_ROUTES(USER.id);
		}
		else setSuccessModal({
			...successModal,
			status: false,
		});
	}, [successModal]);

	const SectionTitle = useCallback(({title, testID}) => {
		return (
			<View style={styles.section} testID={testID}>
				<AppText style={styles.sectionTitle}>{title}</AppText>
			</View>
		);
	}, []);

	const saveTitle = useCallback(v => saveFieldValue(setTitle, {...title, rules: titleRules}, v), [title]);
	const saveCategory = useCallback(v => saveFieldValue(setCategory, {...category, rules: categoryRules}, v), [category]);
	const saveLocations = useCallback(v => saveFieldValue(setLocations, {...locations, rules: locationsRules}, v), [locations]);
	const saveDays = useCallback(v => saveFieldValue(setTime, {...time, rules: timeRules}, {...time.value, days: v}), [time]);
	const saveHources = useCallback(v => saveFieldValue(setTime, {...time, rules: timeRules}, {...time.value, hources: v}), [time]);
	const savePrice = useCallback(v => saveFieldValue(setPrice, {...price, rules: priceRules}, v), [price]);
	const saveDescription = useCallback(v => saveFieldValue(setDescription, {...description, rules: descriptionRules}, v), [description]);

	const closeSuccessMessage = useCallback(() => closeSuccess(successModal.success, successModal.type), [successModal]);
	const closeSplashLoader = useCallback(() => setLoading(false), []);
	const hideSplashLoader = useCallback(() => setSuccessModal({
		...successModal,
		status: true,
	}), [successModal]);
	const closeConfirm = useCallback(() => setIsConfirm(false), []);

	const titleError = useMemo(() => title.status ? title.text : null, [title]);
	const categoryError = useMemo(() => category.status ? category.text : null, [category]);
	const imagesError = useMemo(() => imagesStatus.status ? imagesStatus.text : null, [imagesStatus]);
	const locationsError = useMemo(() => locations.status ? locations.text : null, [locations]);
	const priceError = useMemo(() => price.status ? price.text : null, [price]);
	const descriptionError = useMemo(() => description.status ? description.text : null, [description]);

	const priceWrapperStyle = useMemo(() => ({
		...styles.endSection,
		...(price.status && {
			borderBottomColor: '#FE693A',
		}),
	}), [price]);

	const renderMainContent = () => {
		return (
			<>
				<View style={styles.contentGroup}>
					<SectionTitle title={'Основное'} />
					<View>
						<AnimTextInput
							fieldTestID={'titleField'}
							wrapperStyle={styles.z2}
							style={styles.endTextInputRow}
							placeholderStyle={styles.pl17}
							placeholder={'Название'}
							value={title.value}
							onChangeAI={saveTitle}
							error={titleError}
						/>
						<SelectField
							testID={'categoryField'}
							data={routeTypes}
							wrapperStyle={styles.endTextInputZ1}
							placeholder={'Категория'}
							onChange={saveCategory}
							value={category.value}
							error={categoryError}
						/>
						<ImageLoader
							testID={'imageField'}
							filesArray={images}
							onChangeFiles={imagesManager}
							maxImages={10}
							caption={'Загрузить фото'}
							style={styles.endTextInput}
							error={imagesError}
						/>
					</View>

					<SectionTitle title={'Точки маршрута'} testID={'pontsTitle'} />
					<PointsInput
						pointsArray={locations.value}
						onPointsChange={saveLocations}
						style={styles.endSection}
						error={locationsError}
					/>
					<SectionTitle title={'Продолжительность'} />
					<View
						style={{
							...styles.timeGroup,
							...styles.endSection,
							...(time.status && styles.error),
						}}>
						{time.status && (
							<AppText style={styles.errorMsg}>
								{time.text}
							</AppText>
						)}
						<AnimTextInput
							fieldTestID={'daysField'}
							wrapperStyle={styles.textInputRow}
							keyboardType={'numeric'}
							placeholder={'Дней'}
							mask={'99999'}
							anim={false}
							value={time.value.days.toString()}
							onChangeAI={saveDays}
						/>
						<AnimTextInput
							fieldTestID={'hourcesField'}
							wrapperStyle={styles.textInputRow}
							keyboardType={'numeric'}
							placeholder={'Часов'}
							mask={'99999'}
							anim={false}
							value={time.value.hources.toString()}
							onChangeAI={saveHources}
						/>
					</View>

					<SectionTitle
						title={isFooterRout() ? 'Цена с человека' : 'Цена за весь маршрут'}
						testID={'priceTitle'} />
					<AnimTextInput
						fieldTestID={'priceField'}
						style={styles.defaultInput}
						wrapperStyle={priceWrapperStyle}
						keyboardType={'numeric'}
						placeholder={'Цена, ₽'}
						mask={'9999999999'}
						value={price.value}
						onChangeAI={savePrice}
						errorStyle={styles.bn13}
						error={priceError}
					/>

					<SectionTitle
						title={'О маршруте'}
						testID={'descriptionTitle'} />
					<TextArea
						testID={'descriptionField'}
						style={styles.discription}
						inputStyle={styles.textAreaStyle}
						value={description.value}
						onChangeText={saveDescription}
						error={descriptionError}
					/>
				</View>
				<DeadBtn
					testID={'deleteRouteBtn'}
					style={styles.deleteBtn}
					text={'Удалить'}
					onPress={() => {
						setIsConfirm(true);
					}}
				/>
			</>
		);
	};

	return (
		<SafeAreaView style={styles.areaWrapper}>
			<TopNav
				сompleteTestID={'successBtn'}
				title={'Редактирование маршрута'}
				style={styles.header}
				onLeftPress={() => navigation.goBack()}
				ready={valuesIsChanged()}
				onRightPress={saveChanges}
				// rightCaption={'Готово'}
			/>
			<KeyboardAwareFlatList
				testID={'scrollView'}
				keyboardShouldPersistTaps={'handled'}
				extraHeight={120}
				style={styles.container}
				contentContainerStyle={styles.contentContainer}
				data={['_']}
				keyExtractor={item => `editRoute${item}`}
				renderItem={() => renderMainContent()}
			/>
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
				text={loaderMsg}
			/>
			<Confirm
				isOpen={isConfirm}
				onCancel={closeConfirm}
				onClose={closeConfirm}
				onConfirm={deletePersonalTrip}
				title={delRouteTitle}
			/>
		</SafeAreaView>
	);
};

const mapStateToProps = state => {
	return {
		USER: state.user.data,
		DRIVER_ROUTES: state.user.driverRoutes,
		CATEGORIES: state.settings.categories,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		UPDATE_ROUTE: (id, data) => dispatch(patchRoute(id, data)),
		UPLOAD_IMAGE: formData => dispatch(uploadImage(formData)),
		FETCH_DRIVER_ROUTES: id => dispatch(fetchDriverRoutes(id)),
		DELETE_ROUTE: id => dispatch(deleteRoute(id)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(PersonalRouteEdit);
