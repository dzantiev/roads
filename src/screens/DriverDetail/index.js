import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {
	SafeAreaView,
	ScrollView,
	View,
	Linking,
	ActivityIndicator,
} from 'react-native';
import {styles} from './styles';
import {
	ProfilePreview,
	AppBoldText,
	AppText,
	Trip,
	PersonalRout,
	SmallBtn,
	UserCallBtn,
	InfoLine,
	CircleAvatar,
	SliderModal,
	Description,
} from '../../components';
import {connect} from 'react-redux';
import {
	BackSvg,
	PhoneSvg,
	ChatGreenSvg,
	ShareGreen,
	InstagramLogo,
} from '../../svg';
import {
	smallRouteFormatter,
	smallTripFormatter,
	callToNumber,
	onShare,
} from '../../services';
import {routeConverter} from '../../store/actions/routesAction';
import {
	fetchDriver,
	fetchAnyDriverTrips,
	fetchAnyDriverRoutes,
} from '../../store/actions/driverAction';
import {API_URL} from '@env';
import {appPrefix, shareDriver} from '../../variables';
import AppMetrica from 'react-native-appmetrica';

const DriverDetail = ({
	navigation,
	route,
	FETCH_DRIVER,
	FETCH_ANY_DRIVER_TRIPS,
	FETCH_ANY_DRIVER_ROUTES,
	CATEGORIES,
}) => {
	const [isCarsLoading, setIsCarsLoading] = useState(true);
	const [isPersonalLoading, setIsPersonalLoading] = useState(true);
	const [isPlaningLoading, setIsPlaningLoading] = useState(true);
	const [isModal, setIsmodal] = useState(false);
	const [images, setImages] = useState([]);
	const [driver, setDriver] = useState({
		id: route.params.screen || route.params.driver,
		name: '',
		lastname: '',
		instagram: '',
		phone: '',
		image: [],
		cars: {matrixValue: []},
		aboutme: '',
	});

	const {
		id: driver_id,
		name,
		lastname,
		instagram,
		phone,
		image,
		aboutme,
	} = driver;
	const cars = useMemo(
		() => driver?.cars.matrixValue.filter(car => car.is_approved),
		[driver],
	);
	const [planingRoutes, setPlaningRoutes] = useState([]);
	const [personalRoutes, setPersonalRoutes] = useState([]);

	const getPlaningRoutes = useCallback(async () => {
		const trips = await FETCH_ANY_DRIVER_TRIPS(driver_id);
		const formatTrips = trips.map(el => smallTripFormatter(el));
		setPlaningRoutes(formatTrips);
		setIsPlaningLoading(false);
	}, [driver_id]);

	const getPersonalRoutes = useCallback(async () => {
		const routes = await FETCH_ANY_DRIVER_ROUTES(driver_id);
		const formstRoutes = routeConverter(routes).map(el =>
			smallRouteFormatter(el),
		);
		setPersonalRoutes(formstRoutes);
		setIsPersonalLoading(false);
	}, [driver_id]);

	useEffect(() => {
		FETCH_DRIVER(driver_id).then(data => {
			setDriver(data[0]);
			getPersonalRoutes();
			getPlaningRoutes();
			setIsCarsLoading(false);
		});
		AppMetrica.reportEvent(route.name, {organizerId: driver_id});
	}, []);

	const shareLink = useMemo(() => appPrefix + shareDriver(driver_id), [driver_id]);

	const renderCars = useMemo(
		() =>
			!!cars.map.length ? (
				<View style={styles.carsWrapper}>
					{cars.map((item, index) => {
						return (
							<InfoLine
								key={`cars${index}`}
								style={styles.infoLine}
								sideStyle={{maxWidth: '80%'}}
								smallText={'транспорт'}
								boldText={item.company + ' ' + item.model}
								onPress={() => {
									setIsmodal(true);
									setImages(
										item?.images?.map(
											itemVal =>
												API_URL + itemVal?.localPath,
										),
									);
								}}>
								<CircleAvatar
									images={item?.images
										?.slice(0, 3)
										.map(
											itemVal =>
												API_URL +
												itemVal?.sizes?.small
													?.localPath,
										)}
									onPress={() => {
										setIsmodal(true);
										setImages(
											item?.images?.map(
												itemVal =>
													API_URL +
													itemVal?.localPath,
											),
										);
									}}
								/>
							</InfoLine>
						);
					})}
				</View>
			) : (
				<></>
			),
		[isCarsLoading, cars],
	);

	const renderPlaningContent = useMemo(
		() => (
			<>
				<AppBoldText style={styles.roadsSubTitle}>Планируемые</AppBoldText>
				{planingRoutes.map((item, index) => {
					return (
						<Trip
							{...item}
							testID={`trip${index}`}
							style={styles.contentMagin}
							key={`planTrip${index}`}
							categories={CATEGORIES}
							onPress={() => {
								navigation.navigate(
									'TripDetailStack',
									{
										screen: 'PlaningTripDetail',
										params: {
											screen: item.id,
										},
									},
								);
							}}
						/>
					);
				})}
			</>
		),
		[planingRoutes],
	);

	const renderPlaning = useMemo(
		() => (
			<>
				{!isPlaningLoading ? (
					!!planingRoutes.length && renderPlaningContent
				) : (
					<ActivityIndicator style={styles.contentMagin} color={'#76A829'} />
				)}
			</>
		),
		[isPlaningLoading, planingRoutes, renderPlaningContent],
	);

	const renderPersonal = useMemo(
		() => (
			<>
				<AppText style={styles.roadsSubTitle}>Персональные</AppText>
				<View>
					{!isPersonalLoading ? (
						personalRoutes.map((item, index) => (
							<PersonalRout
								{...item}
								testID={`route${index}`}
								style={styles.contentMagin}
								key={`persTrip${index}`}
								categories={CATEGORIES}
								onPress={() =>
									navigation.navigate('TripDetailStack', {
										// screen: 'PersonalTripDetail',
										screen: 'RouteDetail',
										params: {
											screen: item.id,
											carId: item.carId,
										},
									})
								}
							/>
						))
					) : (
						<ActivityIndicator color={'#76A829'} />
					)}
				</View>
			</>
		),
		[isPersonalLoading, personalRoutes],
	);

	const renderCallBtns = useMemo(
		() => (
			<View style={styles.callBtns}>
				<UserCallBtn
					caption={'вызов'}
					onPress={() => callToNumber(phone)}>
					<PhoneSvg width={26} height={26} />
				</UserCallBtn>
				<UserCallBtn
					caption={'написать'}
					style={{marginLeft: instagram ? 10 : 30}}
					onPress={() => Linking.openURL(`sms:${phone}`)}>
					<ChatGreenSvg width={26} height={26} />
				</UserCallBtn>
				{!!instagram && (
					<UserCallBtn
						caption={instagram}
						style={{marginLeft: instagram ? 10 : 30}}
						textStyle={{textAlign: 'center'}}
						onPress={() =>
							Linking.openURL(
								`https://www.instagram.com/${instagram}`,
							)
						}>
						<InstagramLogo width={26} height={26} />
					</UserCallBtn>
				)}
				<UserCallBtn
					caption={'поделиться'}
					style={{marginLeft: instagram ? 10 : 30}}
					onPress={() => {
						onShare(shareLink);
						AppMetrica.reportEvent('onShare', {
							organizerId: driver_id,
						});
					}}>
					<ShareGreen width={26} height={26} />
				</UserCallBtn>
			</View>
		),
		[phone, instagram, shareLink],
	);

	const avatar = image[0]?.sizes?.main?.localPath
		? API_URL + image[0]?.sizes?.main?.localPath
		: null;

	const renderProfilePreview = useMemo(
		() => (
			<ProfilePreview
				name={name + ' ' + lastname}
				imgUrl={avatar}
				style={styles.preview}
				onPressImg={() => {
					setIsmodal(true);
					setImages([avatar]);
				}}
			/>
		),
		[driver],
	);

	const renderAboutMe = useMemo(
		() => (
			!!aboutme &&
			<Description
				style={styles.roadsDesc}
				title={'О себе'}
				text={aboutme}
			/>
		),
		[driver],
	);

	if (isCarsLoading && isPlaningLoading && isPersonalLoading) {
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
					testID={'scrollView'}
					style={styles.container}
					contentContainerStyle={styles.containerContent}>
					<SmallBtn
						testID={'goBack'}
						style={styles.backBtn}
						onPress={() => navigation.goBack()}>
						<BackSvg height={17} width={17} />
					</SmallBtn>
					{renderProfilePreview}
					{renderCallBtns}
					{renderAboutMe}
					{renderCars}
					<AppBoldText style={styles.roadsTitle}>
						Все поездки видителя
					</AppBoldText>
					{renderPlaning}
					{renderPersonal}
				</ScrollView>
			</SafeAreaView>
			<SliderModal
				isVisible={isModal}
				slides={images}
				animationType={'fade'}
				animationIn={'fadeIn'}
				animationOut={'fadeOut'}
				animationInTiming={200}
				close={() => setIsmodal(false)}
			/>
		</>
	);
};

const mapStateToProps = state => {
	return {
		USER_TRIPS: state.user.userTrips,
		CATEGORIES: state.settings.categories,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		FETCH_DRIVER: id => dispatch(fetchDriver(id)),
		FETCH_ANY_DRIVER_TRIPS: id => dispatch(fetchAnyDriverTrips(id)),
		FETCH_ANY_DRIVER_ROUTES: id => dispatch(fetchAnyDriverRoutes(id)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DriverDetail);
