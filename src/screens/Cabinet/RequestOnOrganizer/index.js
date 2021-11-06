import React, {useState} from 'react';
import {SafeAreaView, View, ScrollView} from 'react-native';
import {
	BigBtn,
	AppText,
	ImageLoader,
	SuccessMessage,
	SplashLoader,
	TopNav,
	SwitchField,
} from '../../../components/';
import {connect} from 'react-redux';
import {styles} from './styles.js';
import {uploadImage} from '../../../store/actions/imageAction';
import {createDriver} from '../../../store/actions/driverAction';
import {updateUserData} from '../../../store/actions/userAction';
import {createImgFormData, saveFieldValue, validator, defaultFieldValue} from '../../../services';
import {DRIVER, FOOTER, requestOnOrganizerMsg, REQUEST_CREATED} from '../../../variables';

const RequestOnOrganizer = ({
	navigation,
	USER,
	UPLOAD_IMAGE,
	CREATE_DRIVER,
	UPDATE_USER_DATA,
}) => {
	const [passportImgs, setPassportImgs] = useState({
		...defaultFieldValue([]),
		rules: [v => v.length > 0 || 'Приложите фото пасспорта'],
	});
	const [driverLicenseImgs, setDriverLicenseImgs] = useState({
		...defaultFieldValue([]),
		rules: [v => v.length > 1 || 'Приложите фото ВУ (с обеих сторон)'],
	});

	const [isLoading, setLoading] = useState(false);
	const [successModal, setSuccessModal] = useState({
		status: false,
		success: true,
		text: requestOnOrganizerMsg,
	});
	const [error, setError] = useState({
		text: 'Выберите вашу роль',
		status: false,
	});
	const [isFoot, setIsFoot] = useState(false);
	const [isJeep, setIsJepp] = useState(false);

	const saveRole = (value, setter) => {
		setError({...error, status: false});
		setter(value);
	};

	const validate = () => {
		if (!isJeep && !isFoot) {
			return !setError({...error, status: true});
		}
		const errors = isJeep
			? validator([{field: driverLicenseImgs, func: setDriverLicenseImgs}])
			: validator([{field: passportImgs, func: setPassportImgs}]);
		return errors.length;
	};

	const sendRequestOnOrganizer = async () => {
		if (validate()) return;

		setLoading(true);

		const userData = {
			created_date: new Date(),
			status: [REQUEST_CREATED],
			user_id: USER.id,
			role: isJeep ? [DRIVER] : [FOOTER],
		};

		if (passportImgs.value.length) {
			const passportImgsFormData = createImgFormData(
				'drivers_data',
				'passport_images',
				passportImgs.value,
			);
			const responsePassportImgs = await UPLOAD_IMAGE(passportImgsFormData);
			userData.passport_images = responsePassportImgs.value;
		}
		if (driverLicenseImgs.value.length) {
			const driverLicenseImgsFormData = createImgFormData(
				'drivers_data',
				'driver_license_images',
				driverLicenseImgs.value,
			);
			const responseDriverLicenseImgs = await UPLOAD_IMAGE(
				driverLicenseImgsFormData,
			);
			userData.driver_license_images = responseDriverLicenseImgs.value;
		}

		const response = await CREATE_DRIVER(userData);

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

	const SectionTitle = ({title, subtitle}) => {
		return (
			<View style={styles.sectionWr}>
				<AppText style={styles.sectionTitle}>{title}</AppText>
				{
					!!subtitle &&
					<AppText style={styles.sectionSubtitle}>{title}</AppText>
				}
			</View>
		);
	};
	const InfoText = ({title}) => {
		return (
			<View style={styles.info}>
				<AppText style={styles.sectionTitle}>{title}</AppText>
			</View>
		);
	};

	return (
		<SafeAreaView style={styles.container}>
			<TopNav
				style={styles.header}
				title={'Стать организатором'}
				onLeftPress={navigation.goBack}
			/>
			<ScrollView
				style={styles.wr}
				contentContainerStyle={styles.wrContent}
			>
				<View style={styles.inputsWr}>
					<SectionTitle title={'Типы экскурсий'} />
					<SwitchField
						text={'Пешие экскурсии'}
						style={styles.largeInputEndSection}
						value={isFoot}
						onPress={v => saveRole(v, setIsFoot)}
					/>
					<SwitchField
						text={'Автомобильные поездки'}
						style={styles.largeInputEndSection}
						value={isJeep}
						onPress={v => saveRole(v, setIsJepp)}
						{...(error.status && {
							error: error.text,
						})}
					/>
					{
						isFoot && !isJeep &&
						<>
							<SectionTitle title={'Паспорт'} />
							<ImageLoader
								maxImages={2}
								onChangeFiles={value =>
									saveFieldValue(setPassportImgs, passportImgs, value)
								}
								filesArray={passportImgs.value}
								caption={'Загрузить фото паспорта'}
								style={styles.largeInputEndSection}
								{...(passportImgs.status && {
									error: passportImgs.text,
								})}
							/>
						</>
					}
					{
						isJeep &&
						<>
							<SectionTitle title={'Удостоверение водителя'} subtitle={'Обе стороны документа'} />
							<ImageLoader
								maxImages={2}
								onChangeFiles={value =>
									saveFieldValue(
										setDriverLicenseImgs,
										driverLicenseImgs,
										value,
									)
								}
								caption={'Загрузить фото удостоверения'}
								style={styles.largeInputEndSection}
								filesArray={driverLicenseImgs.value}
								{...(driverLicenseImgs.status && {
									error: driverLicenseImgs.text,
								})}
							/>
						</>
					}
					{
						!isFoot && !isJeep &&
						<InfoText title={'Каким организатором вы будете?'} />
					}
				</View>
				<BigBtn
					style={styles.submit}
					caption={'Отправить заявку'}
					onPress={sendRequestOnOrganizer}
				/>
			</ScrollView>
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
