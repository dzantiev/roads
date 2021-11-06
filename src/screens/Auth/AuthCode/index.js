import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {CommonActions} from '@react-navigation/native';
import styles from './styles.js';
import {
	SafeAreaView,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	StatusBar,
} from 'react-native';
import {
	BigBtn,
	MainLogo,
	SegmentedInput,
	MessageWithTimer,
} from '../../../components/';
import {setUser, signUp, sendCode} from '../../../store/actions/authAction';
import {RN_SRC_EXT} from '@env';

const AuthCode = ({navigation, route, SET_USER, SIGNUP, SEND_CODE}) => {
	const phone = route.params?.phone || '';
	const [code, setCode] = useState('');
	const [errorMsg, setErrorMsg] = useState('');

	const sendSms = () => {
		setErrorMsg('');
		SIGNUP(phone);
	};

	const checkCode = async () => {
		const response = await SEND_CODE(code, phone);
		if (response.success)
		{
			SET_USER(response.user);
			response.user.name
				? navigation.dispatch(
					CommonActions.reset({
						index: 1,
						routes: [{name: 'MainScreen'}],
					}),
				)
				: navigation.navigate('AuthName');
		}
		else setErrorMsg(response.message);
	};

	return (
		<SafeAreaView style={styles.areaWrapper}>
			<StatusBar backgroundColor={'#F4F6F6'} barStyle={'dark-content'}/>
			<ScrollView
				style={styles.container}
				contentContainerStyle={styles.scrollContainer}
				keyboardShouldPersistTaps={'handled'}>
				<KeyboardAvoidingView
					style={styles.keyboardContainer}
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
					<MainLogo testID={'MainLogo'} />
					<SegmentedInput
						testID={'codeNumber'}
						style={styles.codeInput}
						codeChange={v => {
							setCode(v);
							setErrorMsg('');
						}}
						value={code}
						errorMsg={errorMsg}
					/>
					<MessageWithTimer
						style={styles.timerMsg}
						// time={60}
						time={!!RN_SRC_EXT ? 2 : 60}
						sendSms={sendSms}
					/>
					<BigBtn
						testID={'codeBtn'}
						style={styles.sendBtn}
						caption={'Отправить'}
						onPress={checkCode}
					/>
				</KeyboardAvoidingView>
			</ScrollView>
		</SafeAreaView>
	);
};

const mapDispatchToProps = dispatch => {
	return {
		SET_USER: user => dispatch(setUser(user)),
		SIGNUP: phone => dispatch(signUp(phone)),
		SEND_CODE: (code, phone) => dispatch(sendCode(code, phone)),
	};
};

export default connect(null, mapDispatchToProps)(AuthCode);
