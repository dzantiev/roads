import 'react-native-gesture-handler';
import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Provider} from 'react-redux';
import store from './src/store';
import {
	GlassMenuSvg,
	UserMenuSvg,
	UsersMenuSvg,
	ChatMenuSvg,
} from './src/svg';
import {
	AuthPhone,
	AuthCode,
	AuthName,
	MainTrips,
	// PlaningTrips,
	PlaningTripDetail,
	BookingPlaningTrip,
	// PersonalTrips,
	// PersonalTripDetail,
	BookingPersonalTrip,
	DriverDetail,
	PersonalCabinet,
	PersonalSettings,
	RequestOnOrganizer,
	EditAuto,
	AddAuto,
	PersonalPlaningTripCreate,
	PersonalPlaningTripDetail,
	PersonalPlaningTripEdit,
	PersonalRouteCreate,
	PersonalRouteDetail,
	PersonalRouteEdit,
	DriversList,
	UserDetail,
	Chat,
	RouteDetail,
	// TouristTripDetail,
} from './src/screens';
import * as Sentry from '@sentry/react-native';

Sentry.init({
	dsn: 'https://29084de059b341e2ac5decf8387ac544@o880260.ingest.sentry.io/5872027',
});

export default () => {

	const Stack = createStackNavigator();
	const Tab = createBottomTabNavigator();

	const linking = {
		prefixes: ['https://roads-go.ru', 'roads-go://'],
	};

	const TripDetailStack = () => {
		return (
			<Stack.Navigator headerMode={'none'}>
				<Stack.Screen name={'DriverDetail'} component={DriverDetail} />
				<Stack.Screen name={'UserDetail'} component={UserDetail} />
				<Stack.Screen
					name={'PlaningTripDetail'}
					component={PlaningTripDetail}
				/>
				<Stack.Screen
					name={'BookingPlaningTrip'}
					component={BookingPlaningTrip}
				/>
				{/* <Stack.Screen
					name={'PersonalTripDetail'}
					component={PersonalTripDetail}
				/> */}
				<Stack.Screen
					name={'BookingPersonalTrip'}
					component={BookingPersonalTrip}
				/>
				<Stack.Screen
					name={'RouteDetail'}
					component={RouteDetail}
				/>
			</Stack.Navigator>
		);
	};

	const PersonalDevStack = () => {
		return (
			<Stack.Navigator headerMode={'none'}>
				<Tab.Screen
					name={'PersonalSettings'}
					component={PersonalSettings}
				/>
				<Tab.Screen
					name={'RequestOnOrganizer'}
					component={RequestOnOrganizer}
				/>
				<Tab.Screen name={'EditAuto'} component={EditAuto} />
				<Tab.Screen name={'AddAuto'} component={AddAuto} />
				<Tab.Screen
					name={'PersonalPlaningTripCreate'}
					component={PersonalPlaningTripCreate}
				/>
				<Tab.Screen
					name={'PersonalPlaningTripDetail'}
					component={PersonalPlaningTripDetail}
				/>
				<Tab.Screen
					name={'PersonalPlaningTripEdit'}
					component={PersonalPlaningTripEdit}
				/>
				<Tab.Screen
					name={'PersonalRouteCreate'}
					component={PersonalRouteCreate}
				/>
				<Tab.Screen
					name={'PersonalRouteDetail'}
					component={PersonalRouteDetail}
				/>
				<Tab.Screen
					name={'PersonalRouteEdit'}
					component={PersonalRouteEdit}
				/>
				{/* <Tab.Screen
					name={'TouristTripDetail'}
					component={TouristTripDetail}
				/> */}
			</Stack.Navigator>
		);
	};

	const MainScreensStack = () => {
		return (
			<Tab.Navigator
				initialRouteName={'MainTrips'}
				tabBarOptions={{
					activeTintColor: '#76A829',
					inactiveTintColor: '#C8DCA9',
					showLabel: false,
				}}>
				<Tab.Screen
					name={'DriversList'}
					component={DriversList}
					options={{
						tabBarTestID: 'TabDriversList',
						tabBarIcon: ({color, size}) => (
							<UsersMenuSvg
								color={color}
								width={25}
								height={25}
							/>
						),
					}}
				/>

				<Tab.Screen
					name={'MainTrips'}
					component={MainTrips}
					options={{
						tabBarTestID: 'TabMainTrips',
						tabBarIcon: ({color, size}) => (
							<GlassMenuSvg
								color={color}
								width={25}
								height={25}
							/>
						),
					}}
				/>
				{/*<Tab.Screen
					name={'Chat'}
					component={Chat}
					options={{
						tabBarTestID: 'TabChat',
						tabBarIcon: ({color, size}) => (
							<ChatMenuSvg
								color={color}
								width={25}
								height={25}
							/>
						),
					}}
				/>*/}
				<Stack.Screen
					name={'PersonalCabinet'}
					component={PersonalCabinet}
					options={{
						tabBarTestID: 'TabPersonalCabinet',
						tabBarIcon: ({color, size}) => (
							<UserMenuSvg
								color={color}
								width={25}
								height={25}
							/>
						),
					}}
				/>
			</Tab.Navigator>
		);
	};

	return (
		<Provider store={store}>
			<StatusBar backgroundColor={'#FFF'} barStyle={'dark-content'} />
			<NavigationContainer linking={linking}>
				<Stack.Navigator headerMode={'none'} initialRouteName={'AuthPhone'}>
					<Stack.Screen name={'AuthPhone'} component={AuthPhone} />
					<Stack.Screen name={'AuthCode'} component={AuthCode} />
					<Stack.Screen name={'AuthName'} component={AuthName} />
					<Stack.Screen
						name={'MainScreen'}
						component={MainScreensStack}
					/>
					<Stack.Screen
						name={'TripDetailStack'}
						component={TripDetailStack}
					/>
					<Stack.Screen
						name={'PersonalDevStack'}
						component={PersonalDevStack}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</Provider>
	);
};
