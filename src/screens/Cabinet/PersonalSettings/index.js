import React, {useState, useMemo, useCallback, useEffect} from 'react';
import {View, SafeAreaView, ScrollView} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {connect} from 'react-redux';
import {API_URL} from '@env';
import {
	ProfilePreview,
	GreenBtn,
	TopNav,
	DeadBtn,
	SliderModal,
	SplashLoader,
	PromptPhone,
	PromptCode,
	AppText,
	SuccessMessage,
	InputField,
} from '../../../components';
import {styles} from './styles';
import {TextArea, TouchebleField} from '../../../components/FormField';
import {uploadImage} from '../../../store/actions/imageAction';
import {signOut, updateUser} from '../../../store/actions/authAction';
import {deletePushToken} from '../../../store/actions/pushAction';
import {
	updateUserData,
	tryChangePhone,
	changePhone,
} from '../../../store/actions/userAction';
import {launchImageLibrary} from 'react-native-image-picker';
import {
	createImgFormData,
	onPhoneInput,
	saveFieldValue,
	validator,
	defaultFieldValue,
} from '../../../services';
import {loaderMsg} from '../../../variables';
import AppMetrica from 'react-native-appmetrica';


const PersonalSettings = ({
	navigation,
	route,
	USER,
	SIGN_OUT,
	UPDATE_USER,
	UPLOAD_IMAGE,
	UPDATE_USER_DATA,
	TRY_CHANGE_PHONE,
	CHANGE_PHONE,
	DELETE_PUSH_TOKEN,
}) => {
	useEffect(() => {
		AppMetrica.reportEvent(route.name);
	}, []);

	const defaultValues = useMemo(() => ({
		name: USER.name || '',
		avatar: {
			uri: USER?.image[0]?.sizes?.main?.localPath
				? API_URL + USER.image[0].sizes.main.localPath
				: null,
			name: USER?.image.length ? USER.image[0].upName : null,
		},
		lastname: USER?.lastname || '',
		instagram: USER?.instagram || '',
		aboutme: USER.aboutme || '',
	}), []);

	const [name, setName] = useState({
		...defaultFieldValue(defaultValues.name),
		rules: [v => !!v || 'Укажите Ваше имя']
	});
	const [avatar, setAvatar] = useState(defaultValues.avatar);
	const [lastname, setLastname] = useState(defaultValues.lastname);
	const [instagram, setInstagram] = useState(defaultValues.instagram);
	const [aboutme, setAboutme] = useState(defaultValues.aboutme);
	const [newPhone, setNewPhone] = useState(USER.phone);

	const fields = [{field: name, func: setName}];

	const [isLoading, setIsLoading] = useState(false);
	const [sliderModalVisible, setSliderModalVisible] = useState(false);
	const [isPromptPhone, setIsPromptPhone] = useState(false);
	const [isPromptCode, setIsPromptCode] = useState(false);
	const [confirmCode, setConfirmCode] = useState('');
	const [errorMsg, setErrorMsg] = useState('');

	const [successModal, setSuccessModal] = useState({
		status: false,
		success: true,
		text: '',
	});

	const saveInstagramField = useCallback(str => {
		const current = str
			.split('instagram.com')
			.slice(-1, 2)[0]
			.split('&')[0]
			.replace(/\//g, '')
			.trim();
		setInstagram(current);
	}, []);

	const valuesIsChanged = () => {
		return !Object.keys(defaultValues).every(key => {
			if (key === 'avatar') {
				if (defaultValues.avatar.name === avatar.name) {
					return true;
				}
			}
			if (key === 'name') {
				if (defaultValues.name === name.value) {
					return true;
				}
			}
			if (defaultValues[key] === eval(key)) {
				return true;
			}
			return false;
		});
	};

	const updateUserFields = async () => {
		const errors = validator(fields);
		if (errors.length) return;

		setIsLoading(true);

		const updatebleFields = {};

		defaultValues.name.value !== name.value && (updatebleFields.name = name.value.trim());
		defaultValues.lastname !== lastname && (updatebleFields.lastname = lastname.trim());
		defaultValues.aboutme !== aboutme && (updatebleFields.aboutme = aboutme.trim());
		defaultValues.instagram !== instagram &&  (updatebleFields.instagram = instagram);

		if (defaultValues?.avatar?.uri !== avatar?.uri) {
			const imageFormData = createImgFormData('users', 'image', [avatar]);
			const responseImage = await UPLOAD_IMAGE(imageFormData);

			if (responseImage.success)
				updatebleFields.image = responseImage.value;
		}

		const response = await UPDATE_USER(USER.id, updatebleFields);
		UPDATE_USER_DATA(USER.id);

		setIsLoading(false);

		if (response.success)
			navigation.goBack();
		else
			setSuccessModal({
				...successModal,
				text: response.message,
				success: response.success,
				status: true,
			});
	};

	const onChangePhone = useCallback(async () => {
		if (newPhone.startsWith('8')) {
			return setErrorMsg('Введите телефон с кодом страны');
		}
		const resp = await TRY_CHANGE_PHONE(newPhone.replace(/\D/g, ''));
		if (resp.success) {
			setErrorMsg('');
			setIsPromptPhone(false);
			setIsPromptCode(true);
		} else {
			setErrorMsg(resp.message);
		}
	}, [newPhone]);

	const onConfirmCode = useCallback(async () => {
		const response = await CHANGE_PHONE(confirmCode, newPhone);
		if (response.success) {
			setErrorMsg('');
			UPDATE_USER(USER.id, {phone: newPhone});
			UPDATE_USER_DATA(USER.id);
			setIsPromptCode(false);
		} else {
			setErrorMsg(response.message);
		}
	}, [confirmCode, newPhone]);

	const closePhone = () => {
		setIsPromptPhone(false);
		setErrorMsg('');
	};

	const closeCode = () => {
		setIsPromptCode(false);
		setErrorMsg('');
	};

	const sendSms = useCallback(() => {
		setErrorMsg('');
		TRY_CHANGE_PHONE(newPhone);
	}, [newPhone]);

	const logOut = async () => {
		setIsLoading(true);
		await DELETE_PUSH_TOKEN(USER.token);
		await SIGN_OUT();

		navigation.dispatch(
			CommonActions.reset({
				index: 1,
				routes: [{name: 'AuthPhone'}],
			}),
		);
		setIsLoading(false);
	};

	const openImageLoader = () => {
		launchImageLibrary(
			{
				mediaType: 'photo',
				selectionLimit: 1,
				quality: 0.8,
				maxWidth: 1280,
				maxHeight: 1280,
			},
			response => {
				if (response.didCancel) return;
				setAvatar({
					uri: response.assets[0].uri,
					name: response.assets[0].fileName,
				});
			},
		);
	};

	const SectionTitle = useCallback(({title, testID}) => {
		return (
			<View style={styles.section} testID={testID}>
				<AppText style={styles.sectionTitle}>{title}</AppText>
			</View>
		);
	}, []);

	const onPressImg = useCallback(() => setSliderModalVisible(true), []);
	const saveName = useCallback(v => saveFieldValue(setName, name, v), [name]);
	const pressOnPhone = useCallback(() => setIsPromptPhone(true), []);

	const nameError = useMemo(() => name.status ? name.text : null, [name]);

	return (
		<>
			<SafeAreaView style={styles.area}>
				<ScrollView
					testID={'scrollView'}
					style={styles.container}
					contentContainerStyle={{flexGrow: 1}}>
					<View style={styles.content}>
						<View style={styles.wrapper}>
							<TopNav
								сompleteTestID={'successBtn'}
								style={styles.topNav}
								leftCaption={'Отменить'}
								ready={valuesIsChanged()}
								paddingVertical={15}
								onLeftPress={navigation.goBack}
								onRightPress={updateUserFields}
							/>
							<>
								<ProfilePreview
									name={USER.name + ' ' + USER.lastName}
									showName={false}
									imgUrl={avatar.uri}
									style={styles.profPrev}
									onPressImg={onPressImg}
								/>
								<GreenBtn
									text={'Изменить фото'}
									onPress={openImageLoader}
								/>
							</>
							<View style={styles.fieldsWrap}>
								<InputField
									testID={'nameField'}
									style={styles.defaultUnderlineInput}
									value={name.value}
									onChangeText={saveName}
									placeholder={'Имя'}
									error={nameError}
								/>
								<InputField
									testID={'lastnameField'}
									style={styles.defaultUnderlineInputPl}
									value={lastname}
									onChangeText={setLastname}
									placeholder={'Фамилия'}
								/>
								<SectionTitle title={'О себе'} testID={'aboutTitle'} />
								<InputField
									testID={'instagramField'}
									style={styles.defaultUnderlineInputPl}
									value={instagram}
									onChangeText={saveInstagramField}
									placeholder={'Instagram, укажите логин'}
								/>
								<TextArea
									testID={'aboutmeField'}
									style={styles.aboutme}
									inputStyle={styles.textAreaStyle}
									placeholder={'Коротко о себе'}
									onChangeText={setAboutme}
									value={aboutme}
									textAlignVertical={'top'}
								/>
							</View>
						</View>
						<View
							style={{
								...styles.fieldsWrap,
								...styles.fieldsPaddingLeft,
							}}>
							<TouchebleField
								title={'Ваш номер'}
								value={onPhoneInput(USER?.phone, 10)}
								onPress={pressOnPhone}
							/>
						</View>
					</View>
					<DeadBtn
						testID={'logout'}
						text={'Выйти'}
						onPress={logOut}
						style={styles.deadBtn}
					/>
				</ScrollView>
			</SafeAreaView>
			{useMemo(() => {
				return <SliderModal
					animationType={'fade'}
					animationIn={'fadeIn'}
					animationOut={'fadeOut'}
					isVisible={sliderModalVisible}
					slides={[avatar.uri]}
					close={() => setSliderModalVisible(false)}
				/>
			}, [sliderModalVisible, avatar])}
			{useMemo(() => {
				return <SplashLoader
					isVisible={isLoading}
					close={() => setIsLoading(false)}
					text={loaderMsg}
				/>
			}, [isLoading])}
			{useMemo(() => {
				return <PromptPhone
					isOpen={isPromptPhone}
					onCancel={closePhone}
					onClose={closePhone}
					title={'Изменнение телефона'}
					message={'Введите новый номер'}
					onPrompt={onChangePhone}
					errorMsg={errorMsg}
					onInput={v => {
						setNewPhone(v);
						setErrorMsg('');
					}}
				/>
			}, [isPromptPhone, onChangePhone, errorMsg])}
			{useMemo(() => {
				return <PromptCode
					isOpen={isPromptCode}
					onCancel={closeCode}
					onClose={closeCode}
					onSendSms={sendSms}
					title={'Подтверждение СМС'}
					message={'Введите код'}
					onPrompt={onConfirmCode}
					errorMsg={errorMsg}
					value={confirmCode}
					onInput={v => {
						setConfirmCode(v);
						setErrorMsg('');
					}}
				/>
			}, [isPromptCode, sendSms, onConfirmCode, errorMsg, confirmCode])}
			{useMemo(() => {
				return <SuccessMessage
					isVisible={successModal.status}
					success={successModal.success}
					message={successModal.text}
					close={() => {
						setSuccessModal({
							...successModal,
							status: false,
						});
					}}
				/>
			}, [successModal])}
		</>
	);
};

const mapStateToProps = state => {
	return {
		USER: state.user.data,
	};
};
const mapDispatchToProps = dispatch => {
	return {
		TRY_CHANGE_PHONE: phone => dispatch(tryChangePhone(phone)),
		CHANGE_PHONE: (code, phone) => dispatch(changePhone(code, phone)),
		SIGN_OUT: () => dispatch(signOut()),
		UPLOAD_IMAGE: formData => dispatch(uploadImage(formData)),
		UPDATE_USER: (id, updatableFields) =>
			dispatch(updateUser(id, updatableFields)),
		UPDATE_USER_DATA: id => dispatch(updateUserData(id)),
		DELETE_PUSH_TOKEN: token => dispatch(deletePushToken(token)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(PersonalSettings);
