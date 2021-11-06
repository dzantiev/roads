import React, { useState } from 'react';
import styles from './styles.js';
import { connect} from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import { View, Platform, StatusBar, ScrollView, SafeAreaView, TextInput, KeyboardAvoidingView } from 'react-native';
import { AppText, BigBtn, MainLogo } from '../../../components/';
import { patchUser } from '../../../store/actions/authAction';
import { TOURIST } from '../../../variables.js';


const AuthName = ({navigation, user, PATCH_USER}) => {
	const [name, setName] = useState('');

	const success = async () => {
		const response = await PATCH_USER(user.id, {name: name.trim(), role: [TOURIST]});
		response.success
			? navigation.dispatch(
				CommonActions.reset({
					index: 1,
					routes: [
						{ name: 'MainScreen' },
					],
				})
			)
			: alert('Ошибка');
	};

	return (
		<SafeAreaView style={styles.areaWrapper}>
			<StatusBar backgroundColor={'#F4F6F6'} barStyle={'dark-content'}/>
			<ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}
				keyboardShouldPersistTaps={'handled'}>
				<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					style={styles.keyboardContainer}>
					<MainLogo />
					<View>
						<AppText style={styles.title}>Как к Вам обращаться?</AppText>
					</View>
					<TextInput
						style={styles.input}
						placeholder={'Введите имя'}
						value={name}
						onChangeText={setName}
					/>
					<BigBtn
						style={styles.sendBtn}
						caption={'Начать путешествовать'}
						onPress={success}
					/>
				</KeyboardAvoidingView>
			</ScrollView>
		</SafeAreaView>
	);
};

const mapStateToProps = (state) => {
	return {
		user: state.user.data,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		PATCH_USER: (id, data) => dispatch(patchUser(id, data)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthName);
