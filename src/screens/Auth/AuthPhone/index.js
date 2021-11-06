import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {CommonActions} from '@react-navigation/native';
import styles from './styles.js';
import {
	View,
	ScrollView,
	SafeAreaView,
	KeyboardAvoidingView,
	Platform,
	StatusBar,
	Linking,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
// import {Logo} from '../../../svg/';
import {AppText, BigBtn, MainLogo, PhoneInput} from '../../../components/';
import {signUp, isLogged, setUser} from '../../../store/actions/authAction';
import {fetchCategories} from '../../../store/actions/settingsAction';
import {privacyPolicy, TOURIST, useTerms} from '../../../variables.js';
import {validator, saveFieldValue, aborter} from '../../../services';
import AppMetrica from 'react-native-appmetrica';

const AuthPhone = ({navigation, route, SIGNUP, IS_LOGGED, SET_USER, FETCH_CATEGORIES}) => {
	// const [isLoading, setIsLoading] = useState(true);
	// const [errorMsg, setErrorMsg] = useState('');

	const getSettings = async () => {
		await FETCH_CATEGORIES({fields: ['key', 'value'], role: TOURIST});
	};

	const checkLoggedAsync = async () => {
		const {signal, timeout} = aborter('IS_LOGGED');

		const response = await IS_LOGGED(signal);
		clearTimeout(timeout);

		if (response.success && response.user) {
			await SET_USER(response.user);
			navigation.dispatch(
				CommonActions.reset({
					index: 1,
					routes: [{name: 'MainScreen'}],
				}),
			);
		}
		setTimeout(() => SplashScreen.hide(), 300);
		// setIsLoading(false);
	};

	useEffect(() => {
		getSettings();
		checkLoggedAsync();

		AppMetrica.reportEvent(route.name);
	}, []);

	const [phone, setPhone] = useState({
		value: '',
		status: false,
		text: '',
		rules: [
			v => !!v || 'Введите телефон',
			v => !v.startsWith('8') || 'Введите телефон с кодом страны (+7)',
		],
	});

	const fields = [
		{
			field: {
				...phone,
				rules: [
					...phone.rules,
					v => v.replace(/\D/g, '').length > 10 || 'Короткий номер',
				],
			},
			func: setPhone,
		},
	];

	const success = async () => {
		const errors = validator(fields);
		if (errors.length) return;

		const {signal, timeout} = aborter('SIGNUP');

		const res = await SIGNUP(phone.value.replace(/\D/g, signal, ''), signal);
		clearTimeout(timeout);

		if (res.success) navigation.navigate('AuthCode', {phone: phone.value});
		else
			setPhone({
				...phone,
				status: true,
				text: res.message,
			});
	};

	// const LoadingScreen = () => {
	// 	return (
	// 		<View style={styles.loading}>
	// 			<Logo />
	// 		</View>
	// 	);
	// };

	const policyCard = () => {
		return (
			<View style={styles.policyCard}>
				<AppText style={styles.policyCardText}>
					Регистрируясь, вы принимаете{' '}
					<AppText
						style={styles.policyCardGreen}
						onPress={() => Linking.openURL(useTerms)}>
						Условия использования
					</AppText>{' '}
					и{' '}
					<AppText
						style={styles.policyCardGreen}
						onPress={() => Linking.openURL(privacyPolicy)}>
						Политику конфиденциальности
					</AppText>
					.
				</AppText>
			</View>
		);
	};

	return (
		<>
			<StatusBar backgroundColor={'#F4F6F6'} barStyle={'dark-content'} />
			<SafeAreaView style={styles.areaWrapper}>
				<ScrollView
					style={styles.container}
					contentContainerStyle={styles.scrollContainer}
					keyboardShouldPersistTaps={'handled'}>
					<KeyboardAvoidingView
						style={styles.keyboardContainer}
						behavior={
							Platform.OS === 'ios' ? 'padding' : 'height'
						}>
						<MainLogo />
						<PhoneInput
							testID={'phoneNumber'}
							style={
								phone.status
									? {
										...styles.phoneInput,
										...styles.error,
									}
									: styles.phoneInput
							}
							onChange={v =>
								saveFieldValue(setPhone, phone, v)
							}
						/>
						{phone.status && (
							<AppText style={styles.errorMsg}>
								{phone.text}
							</AppText>
						)}
						<BigBtn
							testID={'phoneBtn'}
							style={styles.entryBtn}
							caption={'Вход'}
							onPress={success}
						/>
						{policyCard()}
					</KeyboardAvoidingView>
				</ScrollView>
			</SafeAreaView>
		</>
	);
};

const mapDispatchToProps = dispatch => {
	return {
		SIGNUP: (phone, signal) => dispatch(signUp(phone, signal)),
		IS_LOGGED: (signal) => dispatch(isLogged(signal)),
		SET_USER: data => dispatch(setUser(data)),
		FETCH_CATEGORIES: data => dispatch(fetchCategories(data)),
	};
};

export default connect(null, mapDispatchToProps)(AuthPhone);
