import { API_URL } from '@env';

export const toTripDetailScreenTripFormatter = ctrip =>
{
	if (!ctrip) return {};

	const curRoute = ctrip.route.matrixValue[0];
	const curRouteLocations = curRoute.locations.matrixValue || [];
	const car = ctrip?.car.matrixValue[0] || null;
	const user = ctrip?.driver.matrixValue[0];
	const driver = user?.driver.matrixValue[0];
	const avatar = user?.image[0]?.sizes?.small?.localPath;

	return {
		id: ctrip.id,
		title: curRoute.title,
		userId: user.id,
		driver: {
			name: `${user?.name} ${user?.lastname}`,
			// experience:
			// 	new Date().getFullYear() -
			// 	new Date(driver.driver_license_date).getFullYear(),
			imgUrl: avatar ? API_URL + avatar : null,
		},
		images: curRoute.images.map(el => API_URL + el.localPath),
		status: {
			status: ctrip.full ? 'success' : 'pending',
			meetPlace: ctrip.place,
			seats: ctrip.empty_seats - ctrip.users_count,
		},
		tripDate: new Date(ctrip.date.replace(' ', 'T') + '.000Z'),
		price: ctrip.price,
		duration: curRoute.duration,
		description: ctrip.description,
		routeDescription: curRoute.description,
		places: curRouteLocations.map(el => el.name),
		category: curRoute.category,
		...(
			car &&
			{
				car: {
					title: `${car.company} ${car.model} ${car.year}`,
					images: car.images.map(el => API_URL + el.localPath),
				},
			}
		),
	};
};

export const smallTripFormatter = el =>
{
	const driver = el.driver.matrixValue[0];
	const date = el.date.replace(' ', 'T') + '.000Z';
	const trip = {
		id: el.id,
		date: new Date(date),
		emptySeats: el.empty_seats - el.users_count,
		price: el.price,
		duration: +el.route.matrixValue[0].duration,
		tripImage: API_URL + el.route.matrixValue[0].images[0].sizes.main.localPath,
		isTrip: true,

		description: el?.route.matrixValue[0].description,
		title: el?.route?.matrixValue[0]?.title || '',
		category: el?.route?.matrixValue[0]?.category || 'jeep',
		seats: el.empty_seats,
		driver: `${driver?.name} ${driver?.lastname}`,
		driverFace: driver?.image.length
			? API_URL + driver.image[0]?.localPath
			: null,
	};
	return trip;
};
