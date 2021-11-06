import React, {useState, useEffect} from 'react';
import {SafeAreaView, ScrollView, View, Linking, ActivityIndicator} from 'react-native';
import {styles} from './styles';
import {
	ProfilePreview,
	SmallBtn,
	UserCallBtn,
	SliderModal,
	Description,
} from '../../components';
import {connect} from 'react-redux';
import {BackSvg, PhoneSvg, ChatGreenSvg, InstagramLogo} from '../../svg';
import {callToNumber, onShare} from '../../services';
import {fetchUser} from '../../store/actions/userAction';
import {API_URL} from '@env';
// import {appPrefix, shareDriver} from '../../variables';

const DriverDetail = ({navigation, route, FETCH_USER}) => {
	const [isModal, setIsmodal] = useState(false);
	const [images, setImages] = useState([]);
	const [user, setUser] = useState({
		id: route.params.screen || route.params.user,
		name: '',
		lastname: '',
		instagram: '',
		phone: '',
		image: [],
		aboutme: '',
	});
	const [isLoading, setIsLoading] = useState(true);

	const {
		id: user_id,
		name,
		lastname,
		instagram,
		phone,
		image,
		aboutme,
	} = user;

	const getUserData = async () => {
		return await FETCH_USER(user_id, [
			'id',
			'name',
			'lastname',
			'instagram',
			'image',
			'phone',
			'aboutme',
		])
		.then(data => setUser(data[0]));
	}

	useEffect(async () => {
		await getUserData()
		setIsLoading(false)
	}, []);

	// const shareLink = appPrefix + shareDriver(user?.id);

	const avatar = image[0]?.sizes?.main?.localPath
		? API_URL + image[0]?.sizes?.main?.localPath
		: null;

	if (isLoading) {
		return (
			<SafeAreaView
				style={{
					...styles.areaWrapper,
					justifyContent: 'center',
				}}>
				<ActivityIndicator color={'#76A829'} />
			</SafeAreaView>
		);
	}
	return (
		<>
			<SafeAreaView style={styles.areaWrapper}>
				<ScrollView
					style={styles.container}
					contentContainerStyle={styles.containerContent}>
					<SmallBtn
						style={styles.backBtn}
						onPress={() => navigation.goBack()}>
						<BackSvg height={17} width={17} />
					</SmallBtn>
					<ProfilePreview
						name={name + ' ' + lastname}
						imgUrl={avatar}
						style={styles.preview}
						onPressImg={() => {
							setIsmodal(true);
							setImages([avatar]);
						}}
					/>
					<View style={styles.callBtns}>
						<UserCallBtn
							caption={'вызов'}
							style={styles.phoneBtn}
							onPress={() => callToNumber(phone)}>
							<PhoneSvg width={26} height={26} />
						</UserCallBtn>
						<UserCallBtn
							caption={'написать'}
							style={styles.chatBtn}
							onPress={() => Linking.openURL(`sms:${phone}`)}>
							<ChatGreenSvg width={26} height={26} />
						</UserCallBtn>
						{!!instagram && (
							<UserCallBtn
								caption={instagram}
								style={styles.chatBtn}
								textStyle={{textAlign: 'center'}}
								onPress={() =>
									Linking.openURL(
										`https://www.instagram.com/${instagram}`,
									)
								}>
								<InstagramLogo width={26} height={26} />
							</UserCallBtn>
						)}
						{/* <UserCallBtn
							caption={'поделиться'}
							style={styles.chatBtn}
							onPress={() => onShare(shareLink)}>
							<ShareGreen width={26} height={26} />
						</UserCallBtn> */}
					</View>
					{!!aboutme && (
						<Description
							style={styles.roadsDesc}
							title={'О себе'}
							text={aboutme}
						/>
					)}
				</ScrollView>
			</SafeAreaView>
			<SliderModal
				isVisible={isModal}
				slides={images}
				animationIn={'fadeIn'}
				animationOut={'fadeOut'}
				animationType={'fade'}
				animationInTiming={200}
				close={() => setIsmodal(false)}
			/>
		</>
	);
};

const mapDispatchToProps = dispatch => {
	return {
		FETCH_USER: (id, fields) => dispatch(fetchUser(id, fields)),
	};
};

export default connect(null, mapDispatchToProps)(DriverDetail);
