import React, {useEffect, useState, useRef} from 'react';
import {connect} from 'react-redux';
import {
	SafeAreaView,
	View,
	Image,
	TouchableOpacity,
	RefreshControl,
	ActivityIndicator,
	FlatList,
} from 'react-native';
import {styles} from './styles';
import {AppBoldText} from '../../components';
import {CaretRight} from '../../svg';
import {declOfNum, randomImgFromName} from '../../services';
import {API_URL} from '@env';
import {fetchDrivers} from '../../store/actions/driverAction';
import {setCurrentScreen} from '../../store/actions/settingsAction';
import AppMetrica from 'react-native-appmetrica';

const DriverList = ({
	navigation,
	route,
	FETCH_DRIVERS,
	CURRENT_SCREEN,
	SET_CURRENT_SCREEN,
}) => {
	// console.log(navigation);
	// ============== To top scroller ==============

	const driversFlatList = useRef();

	useEffect(() => {
		const unsubscribe = navigation.addListener('tabPress', (e) => {
			if (CURRENT_SCREEN === route.name) {
				driversFlatList.current.scrollToOffset({offset: 0, animated: true});
			}
			else {
				AppMetrica.reportEvent(route.name);
				SET_CURRENT_SCREEN(route.name);
			}
		});
		return unsubscribe;
	}, [CURRENT_SCREEN]);

	// ============== screen work ==============

	const diversFetchLimit = 20;
	const [page, setPage] = useState(1);
	const [isGettingBlock, setIsGettingBlock] = useState(false);

	const [drivers, setDrivers] = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const routeVariantes = ['маршрут', 'маршрута', 'маршрутов'];

	useEffect(() => {
		getDriversList();
		AppMetrica.reportEvent(route.name);
	}, []);

	const onRefresh = () => {
		setRefreshing(true);
		getDriversList();
	};

	const getDrivers = async cPage => {
		return await FETCH_DRIVERS({
			fields: ['id', 'name', 'lastname', 'image', 'routes_count'],
			isRoutes: true,
			limit: diversFetchLimit,
			page: cPage,
		});
	};

	const getDriversList = async () => {
		const result = await getDrivers(1);
		setDrivers(result);
		page !== 1 && setPage(1);
		setRefreshing(false);
		setIsGettingBlock(false);
	};

	const getImage = name => {
		const imageNumber = randomImgFromName(name);
		switch (imageNumber) {
			case 0:
				return require('../../img/DefaultAvatar1.png');
			case 1:
				return require('../../img/DefaultAvatar2.png');
			case 2:
				return require('../../img/DefaultAvatar3.png');
			case 3:
				return require('../../img/DefaultAvatar4.png');
		}
	};

	const getMoreDrivers = async () => {
		if (isLoading) return;

		setIsLoading(true);
		const curPage = page + 1;
		const result = await getDrivers(curPage);
		setPage(curPage);
		!result.length
			? setIsGettingBlock(true)
			: setDrivers(old => [...old, ...result]);
		setIsLoading(false);
	};

	const Header = () => {
		const driversCount = drivers?.length ? drivers.length : 0;
		return (
			<View style={styles.header}>
				<AppBoldText>
					Найдено {driversCount + ' '}
					{declOfNum(driversCount, [
						'организатор',
						'организатора',
						'организаторов',
					])}
				</AppBoldText>
			</View>
		);
	};

	const renderDriverCard = ({item, index}) => {
		const {
			name = '',
			lastname = '',
			routes_count,
			image,
		} = item;
		const currentImg = image[0]?.sizes?.main?.localPath;
		const img = currentImg ? {uri: API_URL + currentImg} : getImage(name);
		return (
			<TouchableOpacity
				testID={`driver${index}`}
				activeOpacity={0.7}
				style={styles.driverCard}
				onPress={() =>
					navigation.navigate('TripDetailStack', {
						screen: 'DriverDetail',
						params: {
							driver: item.id,
						},
					})
				}>
				<View style={styles.driverCardContent}>
					<Image style={styles.avatar} source={img} />
					<View style={styles.information}>
						<AppBoldText style={styles.name} numberOfLines={1}>
							{name + ' ' + lastname}
						</AppBoldText>
						<AppBoldText style={styles.price}>
							{`${routes_count} ${declOfNum(routes_count, routeVariantes)}`}
						</AppBoldText>
					</View>
				</View>
				<CaretRight width={22} height={22} />
			</TouchableOpacity>
		);
	};

	return (
		<SafeAreaView style={styles.areaWrapper}>
			<Header />
			<FlatList
				ref={driversFlatList}
				data={drivers}
				renderItem={renderDriverCard}
				keyExtractor={el => el.id}
				style={{paddingHorizontal: 16}}
				refreshing={refreshing}
				onEndReached={() => {
					!isGettingBlock && getMoreDrivers();
				}}
				onEndReachedThreshold={0.3}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						colors={['#76A829']}
						tintColor={'#76A829'}
					/>
				}
				ListFooterComponent={
					isLoading
						? <ActivityIndicator color={'#76A829'} />
						: <></>
				}
			/>
		</SafeAreaView>
	);
};

const mapStateToProps = state => {
	return {
		CURRENT_SCREEN: state.settings.currentScreen,
	};
};
const mapDispatchToProps = dispatch => {
	return {
		FETCH_DRIVERS: args => dispatch(fetchDrivers(args)),
		SET_CURRENT_SCREEN: (screen) => dispatch(setCurrentScreen(screen)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DriverList);
