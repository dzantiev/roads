import React, {useState, useEffect, useRef, memo} from 'react';
import {Text, View, Animated, Modal, TouchableOpacity} from 'react-native';
import { SUPPORTED_ORIENTATIONS } from '../../variables';
import styles from './style';

const Confirm = ({
	isOpen = false,
	onCancel = null,
	onConfirm = null,
	onClose = null,
	customStyles = {},
	title = 'Do you want to continue?',
	message = '',
	showCancel = true,
	showConfirm = true,
	textCancel = 'Отменить',
	textConfirm = 'Принять',
	useNativeDriver = false,
	closeOnPressMask = true,
	closeOnPressBack = true,
}) => {
	const [visible, setVisible] = useState(false);
	const springValue = useRef(new Animated.Value(0)).current;

	const cancel = () => {
		if (typeof onCancel === 'function') onCancel();
	};

	const prompt = () => {
		if (typeof onConfirm === 'function') onConfirm();
	};

	const open = async () => {
		await setVisible(true);
		Animated.spring(springValue, {
			toValue: 1,
			speed: 35,
			bounciness: 7,
			velocity: 15,
			useNativeDriver,
		}).start();
	};

	const close = async () => {
		await setVisible(false);
		springValue.setValue(0);
		if (typeof onClose === 'function') onClose();
	};

	useEffect(() => {
		isOpen ? open() : close();
	}, [isOpen]);

	return (
		<Modal
			visible={visible}
			transparent
			animationType={'none'}
			supportedOrientations={SUPPORTED_ORIENTATIONS}
			onRequestClose={closeOnPressBack ? close : null}
		>
			<TouchableOpacity
				activeOpacity={0.7}
				onPress={closeOnPressMask ? close : null}
				style={[styles.background, customStyles.mask]}>
				<Animated.View
					style={[
						styles.container,
						{
							transform: [{scale: springValue}],
						},
						customStyles.container,
					]}>
					<TouchableOpacity activeOpacity={0.7}>
						<View style={styles.content}>
							<Text style={[styles.title, customStyles.title]}>
								{title}
							</Text>
							{message ? (
								<Text
									style={[
										styles.message,
										customStyles.message,
									]}>
									{message}
								</Text>
							) : null}
						</View>

						<View style={styles.buttonContainer}>
							{showCancel ? (
								<TouchableOpacity
									testID="buttonCancel"
									onPress={cancel}
									activeOpacity={0.7}
									style={[
										styles.button,
										styles.buttonCancel,
										customStyles.buttonCancel,
									]}>
									<Text
										style={[
											styles.textButton,
											styles.textCancel,
											customStyles.textCancel,
										]}>
										{textCancel}
									</Text>
								</TouchableOpacity>
							) : null}
							{showConfirm ? (
								<TouchableOpacity
									testID="buttonConfirm"
									onPress={prompt}
									activeOpacity={0.7}
									style={[
										styles.button,
										customStyles.buttonPrompt,
									]}>
									<Text
										style={[
											styles.textButton,
											customStyles.textConfirm,
										]}>
										{textConfirm}
									</Text>
								</TouchableOpacity>
							) : null}
						</View>
					</TouchableOpacity>
				</Animated.View>
			</TouchableOpacity>
		</Modal>
	);
};

export default memo(Confirm);
