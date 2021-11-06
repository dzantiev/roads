import React, {useState, useEffect} from 'react';
import {View, Keyboard, TouchableWithoutFeedback, Platform, StatusBar} from 'react-native';
import AppText from '../AppText';
import TextArea from '../FormField/TextArea';
import BigBtn from '../BigBtn';
import styles from './styles.js';
import Modal from 'react-native-modal';

const ModalInput = ({
	isVisible,
	close,
	onSuccess,
	title,
	btnTitle,
	placeholder,
	onModalHide,
	btnTestID,
	textTestID
}) => {
	const [text, setText] = useState('');
	const [keyboardHeight, setKeyboardHeight] = useState(0);

	useEffect(() => {
		Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
		Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
		return () => {
			Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
			Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
		};
	}, []);

	const _keyboardDidShow = (e) =>
	{
		setKeyboardHeight(e.endCoordinates.height);
	};

	const _keyboardDidHide = (e) =>
	{
		setKeyboardHeight(0);
	};

	return (
		<Modal
			isVisible={isVisible}
			onRequestClose={close}
			onBackdropPress={close}
			backdropOpacity={0.6}
			animationInTiming={300}
			animationOutTiming={300}
			style={styles.container}
			onSwipeComplete={close}
			propagateSwipe
			onModalHide={onModalHide && onModalHide}
			swipeDirection={'down'}
		>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View style={{
					...styles.modalView,
					...{paddingBottom: Platform.OS === 'ios' ? 26 + keyboardHeight : 26},
				}}>
					{isVisible &&
					<StatusBar
						backgroundColor={'#ffffff43'}
						barStyle={'dark-content'}
					/>}
					<View style={styles.rectangle}></View>
					<AppText style={styles.title}>{title}</AppText>
					<TextArea
						testID={textTestID}
						textAlignVertical={'top'}
						style={styles.textArea}
						inputStyle={styles.textAreaInput}
						placeholder={placeholder}
						onChangeText={setText}
					/>
					<BigBtn
						testID={btnTestID}
						view={'gray'}
						style={styles.bigBtn}
						caption={btnTitle}
						onPress={() => onSuccess(text)}
					/>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
};

export default ModalInput;
