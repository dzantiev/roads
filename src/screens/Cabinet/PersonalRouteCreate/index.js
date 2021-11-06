import React, {useCallback, useMemo, useState, useEffect} from 'react';
import {View, SafeAreaView, LogBox} from 'react-native';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import {connect} from 'react-redux';
import styles from './styles';
import {
	SuccessMessage,
	PointsInput,
	BigBtn,
	AppText,
	TopNav,
	TextArea,
	AnimTextInput,
	ImageLoader,
	SplashLoader,
	SelectField,
} from '../../../components';
import {createRoute} from '../../../store/actions/routesAction';
import {uploadImage} from '../../../store/actions/imageAction';
import {fetchDriverRoutes} from '../../../store/actions/driverAction';
import {createImgFormData, saveFieldValue, validator, defaultFieldValue} from '../../../services';
import {loaderMsg, routeMsg, footerCategories} from '../../../variables';
import AppMetrica from 'react-native-appmetrica';
import {RN_SRC_EXT} from '@env';


RN_SRC_EXT && LogBox.ignoreAllLogs();

const PersonalRouteCreate = ({
	navigation,
	route,
	USER,
	CREATE_ROUTE,
	UPLOAD_IMAGE,
	FETCH_DRIVER_ROUTES,
	ROLE_CATEGORIES,
}) => {
	useEffect(() => {
		AppMetrica.reportEvent(route.name);
	}, []);
	const routeTypes = useMemo(() => Object.values(ROLE_CATEGORIES), []);
	const routeTypesKeys = useMemo(() => Object.keys(ROLE_CATEGORIES), []);

	const [title, setTitle] = useState(defaultFieldValue(''));
	const titleRules = [v => !!v || 'Введите название'];

	const [category, setCategory] = useState(defaultFieldValue(''));
	const categoryRules = [v => v !== '' || 'Выберите категорию маршрута',];
	const isFooterRout = () => footerCategories.includes(routeTypesKeys[category.value]);

	const [locations, setLocations] = useState(defaultFieldValue([]));
	const locationsRules = [
		v => v.length > 0 || 'Укажите точки маршрута',
		v => v.length > 2 || 'Мин количество точек от трех',
		v => v.every(el => !!el.value) || 'Введите название точки',
	];

	const [images, setImages] = useState(defaultFieldValue([]));
	const imagesRules = [v => v.length > 0 || 'Прикрепите изображения'];

	const [time, setTime] = useState(defaultFieldValue({hources: '', days: ''}));
	const timeRules = [v => !!+v.hources || !!+v.days || 'Укажите продолжительность поездки'];

	const [price, setPrice] = useState(defaultFieldValue(''));
	const priceRules = [v => !!v || 'Укажите цену'];

	const [description, setDescription] = useState(defaultFieldValue(''));
	const descriptionRules = [
		v => !!v || 'Введите описание',
		v =>
			v.length > 19 ||
			`Минимум 20 символов. Сейчас ${v.length}`,
	];

	const [successModal, setSuccessModal] = useState({
		status: false,
		success: true,
		text: routeMsg,
	});
	const [isLoading, setLoading] = useState(false);

	const fields = [
		{field: {...title, rules: titleRules}, func: setTitle},
		{field: {...category, rules: categoryRules}, func: setCategory},
		{field: {...locations, rules: locationsRules}, func: setLocations},
		{field: {...time, rules: timeRules}, func: setTime},
		{field: {...price, rules: priceRules}, func: setPrice},
		{field: {...description, rules: descriptionRules}, func: setDescription},
		{field: {...images, rules: imagesRules}, func: setImages},
	];

	const uploudImages = async () => {
		const imagesFormData = createImgFormData('routes', 'images', images.value);
		return await UPLOAD_IMAGE(imagesFormData);
	};

	const computeDuration = () => {
		return (time.value.days * 24 + +time.value.hources) * 60 * 60 * 1000;
	};

	const sendData = async () => {
		const errors = validator(fields);
		if (errors.length) return;
		// if (!validator(fields)) return;

		setLoading(true);

		const imgsResp = await uploudImages();

		const routeResp = await CREATE_ROUTE({
			driver_id: USER.id,
			title: title.value.trim(),
			category: [routeTypesKeys[category.value]],
			price: price.value,
			duration: computeDuration(),
			images: imgsResp.value,
			description: description.value.trim(),
			locations: JSON.stringify(
				locations.value.map(el => ({id: el.id, name: el.value.trim()})),
			),
			is_active: true,
		});
		if (!routeResp.success) {
			setSuccessModal({
				...successModal,
				text: routeResp.message,
				success: routeResp.success,
			});
		} else {
			setSuccessModal({
				...successModal,
				text: routeMsg,
				success: routeResp.success,
			});
		}

		setLoading(false);
	};

	const closeSuccess = (success) => {
		if (success) {
			FETCH_DRIVER_ROUTES(USER.id);
			navigation.goBack();
		} else {
			setSuccessModal({
				...successModal,
				status: false,
			});
		}
	};

	const SectionTitle = useCallback(({title, testID}) => {
		return (
			<View style={styles.section} testID={testID}>
				<AppText style={styles.sectionTitle}>{title}</AppText>
			</View>
		);
	}, []);

	const saveTitle = useCallback(v => saveFieldValue(setTitle, {...title, rules: titleRules}, v), [title]);
	const saveCategory = useCallback(v => saveFieldValue(setCategory, {...category, rules: categoryRules}, v), [category]);
	const saveImages = useCallback(v => saveFieldValue(setImages, {...images, rules: imagesRules}, v), [images]);
	const saveLocations = useCallback(v => saveFieldValue(setLocations, {...locations, rules: locationsRules}, v), [locations]);
	const saveDays = useCallback(v => saveFieldValue(setTime, {...time, rules: timeRules}, {...time.value, days: v}), [time]);
	const saveHources = useCallback(v => saveFieldValue(setTime, {...time, rules: timeRules}, {...time.value, hources: v}), [time]);
	const savePrice = useCallback(v => saveFieldValue(setPrice, {...price, rules: priceRules}, v), [price]);
	const saveDescription = useCallback(v => saveFieldValue(setDescription, {...description, rules: descriptionRules}, v), [description]);

	const closeSuccessMessage = useCallback(() => closeSuccess(successModal.success), [successModal]);
	const closeSplashLoader = useCallback(() => setLoading(false), []);
	const hideSplashLoader = useCallback(() => setSuccessModal({
		...successModal,
		status: true,
	}), [successModal]);

	const titleError = useMemo(() => title.status ? title.text : null, [title]);
	const categoryError = useMemo(() => category.status ? category.text : null, [category]);
	const imagesError = useMemo(() => images.status ? images.text : null, [images]);
	const locationsError = useMemo(() => locations.status ? locations.text : null, [locations]);
	const priceError = useMemo(() => price.status ? price.text : null, [price]);
	const descriptionError = useMemo(() => description.status ? description.text : null, [description]);

	const priceWrapperStyle = useMemo(() => ({
		...styles.endSection,
		...(price.status && {
			borderBottomColor: '#FE693A',
		})
	}), [price]);

	const renderMainContent = () => {
		return (
			<View style={{height: '100%'}}>
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
							onChangeFiles={saveImages}
							maxImages={10}
							caption={'Загрузить фото'}
							style={styles.endTextInput}
							error={imagesError}
						/>
					</View>

					<SectionTitle title={'Точки маршрута'} testID={'pontsTitle'} />
					<PointsInput
						onPointsChange={saveLocations}
						style={styles.endSection}
						error={locationsError}
					/>
					<SectionTitle title={'Продолжительность'} />
					<View
						style={{
							...styles.timeGroup,
							...styles.endSection,
							...((time.status) && styles.error),
						}}>
						{(time.status) && (
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
				<BigBtn
					testID={'createRouteBtn'}
					style={styles.addBtn}
					caption={'Добавить маршрут'}
					onPress={sendData}
				/>
			</View>
		);
	};

	return (
		<SafeAreaView style={styles.areaWrapper}>
			<TopNav
				title={'Создание маршрута'}
				style={styles.header}
				onLeftPress={() => navigation.goBack()}
			/>
			<KeyboardAwareFlatList
				testID={'scrollView'}
				keyboardShouldPersistTaps={'handled'}
				extraHeight={120}
				style={styles.container}
				contentContainerStyle={styles.contentContainer}
				data={[0]}
				keyExtractor={item => `createRoute${item}`}
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
		</SafeAreaView>
	);
};

const mapStateToProps = state => {
	return {
		USER: state.user.data,
		ROLE_CATEGORIES: state.settings.roleCategories,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		CREATE_ROUTE: data => dispatch(createRoute(data)),
		UPLOAD_IMAGE: formData => dispatch(uploadImage(formData)),
		FETCH_DRIVER_ROUTES: id => dispatch(fetchDriverRoutes(id)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(PersonalRouteCreate);
