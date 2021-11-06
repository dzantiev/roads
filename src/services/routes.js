import { API_URL } from '@env';


export const planingRouteToTripFormatter = el =>
{
	const route = el.route?.matrixValue[0];
	const routeLocations = route.locations?.matrixValue;
	const car = route.cars.matrixValue.find(item => item.id === +el.car_id);
	return {
		id: el.id,
		date: new Date(el.date.replace(' ', 'T')),
		price: route.price,
		duration: +route.duration,
		route: routeLocations ? routeLocations.map(el => el.name) : [],
		image: API_URL + car?.images[0]?.sizes?.small?.localPath,
		isRoute: true,
		isActive: el.is_active,
	};
};

export const smallRouteFormatter = (el, seats) =>
{
	// console.log(el.images[0]);
	const driver = el.driver.matrixValue[0];
	const curCar = seats
		? el.cars.matrixValue.find(el => +el.seats >= seats)
		: el.cars.matrixValue[0];
	const routeLocations = el.locations.matrixValue;
	return {
		id: el.id,
		emptySeats: curCar?.seats,
		price: el.price,
		route: routeLocations ? routeLocations.map(el => el.name) : [],
		duration: +el.duration,
		routeImage: API_URL + el.images[0].sizes.main.localPath,
		carId: curCar?.id,
		isRoute: true,
		isActive: el.is_active,

		description: el?.description || '',
		title: el?.title || '',
		category: el?.category || 'jeep',
		driver: `${driver?.name} ${driver?.lastname}`,
		driverFace: driver?.image.length
			? API_URL + driver.image[0].localPath
			: null,
	};
};
