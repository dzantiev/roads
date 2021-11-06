export const AS_TOURIST = 'at';
export const AS_ORGANIZER = 'ao';
export const REQUEST_CREATED = 'rc';
export const REQUEST_SUCCESS = 'rs';
export const REQUEST_FAILED = 'rf';
export const TOURIST = 'tourist';
export const DRIVER = 'driver';
export const FOOTER = 'footer';

export const months = [
	'Январь',
	'Февраль',
	'Март',
	'Апрель',
	'Май',
	'Июнь',
	'Июль',
	'Август',
	'Сентябрь',
	'Октябрь',
	'Ноябрь',
	'Декабрь',
];

export const peopleCounters = [
	// 'Сбросить',
	'1 пассажир',
	'2 пассажира',
	'3 пассажира',
	'4 пасажира',
	'5 пассажиров',
	'6 пассажиров',
	'7 и более',
	// '8 пассажиров',
	// '9 пассажиров',
	// '10 пассажиров',
];

export const footerCategories = ['foot', 'bus'];

export const sortList = {
	priceD: 'Дороже',
	priceA: 'Дешевле',
	rating: 'Рейтинг',
};

export const itemsLimit = 10;
export const defaultSortedField = 'rating';

export const dates = {
	start: new Date().toISOString().slice(0, 10),
	end: new Date(new Date().setDate(new Date().getDate() + 120))
		.toISOString()
		.slice(0, 10),
};
export const sortFields = {
	priceD: {
		field: 'price',
		order: 'DESC',
	},
	priceA: {
		field: 'price',
		order: 'ASC',
	},
	rating: { // По умолчанию
		field: 'rating',
		order: 'DESC',
	},
};

export const defaultRouteParams = {
	seats: 0,
	sort: sortFields[defaultSortedField],
	limit: itemsLimit,
	page: 1,
};
export const defaultTripsParams = {
	...defaultRouteParams,
	dates: {
		...dates,
		start: dates.start + (new Date()).toISOString().slice(10)
	},
};

export const yaURL = 'https://yandex.ru/maps';

export const mail = 'roads@odva.pro';
export const about = 'https://odva.pro/about';
// export const instagram = 'https://instagram.com/roadsgo';
export const instagram = 'https://instagram.com/roads_go';

export const ABOUT_LINKS = ['Сообщить о проблеме', 'О нас', 'Мы в Instagram'];

export const PYMENT_TYPES = {
	ch: 'Наличные',
	sb: 'Сбербанк онлайн',
	eb: 'Другой банк',
};

export const errorResponse = (message = 'Что то пошло не так...') => {
	return {
		status: 404,
		success: false,
		message,
	};
};

export const minCarYear = 1970;

export const requestMsg = 'Ваша заявка принята!';
export const routeMsg = 'Маршрут создан!';
export const tripMsg = 'Поездка создана!';
export const changesMsg = 'Изменения приняты';
export const changesWaiting = 'Ожидается подтверждение';
export const delTripMsg = 'Поездка удалена!';
export const delRouteMsg = 'Маршрут удален!';

export const delTripTitle = 'Хотите удалить поездку?';
export const delRouteTitle = 'Хотите удалить маршрут?';
export const delCarTitle = 'Хотите удалить автомобиль?';
export const carDeleted = 'Автомобиль удален';
export const delTextMsg = 'Вы уверены?';

export const leaveTripMsg = 'Бронь отменена';

export const bookedRouteMsg = 'Вы успешно забронировали маршрут!';
export const bookedTripMsg = 'Вы успешно забронировали место!';

// export const carAddMsg = 'Ваша заявка успешно отправлена\nрассмотрим ее в течении\nодного рабочего дня';
export const carAddMsg = 'Автомобиль добавлен';
export const requestOnOrganizerMsg =
	'Ваша заявка успешно отправлена\nрассмотрим ее в течении\nодного рабочего дня';

export const loaderMsg = 'Отправка данных';

export const personTripEmptySeats = '; (';

// export const appPrefix = 'roads-go://';
export const appPrefix = 'https://roads-go.ru';
export const useTerms = appPrefix + '/terms-and-conditions/';
export const privacyPolicy = appPrefix + '/policy/';

export const shareRoute = id => `/route/${id}`;
export const shareTrip = id => `/trip/${id}`;
export const shareDriver = id => `/org/${id}`;

export const screens = {
	driver: 'DriverDetail',
	user: 'UserDetail',
	// route: 'PersonalTripDetail',
	route: 'RouteDetail',
	personalRoute: 'PersonalRouteDetail',
	trip: 'PlaningTripDetail',
	personaltrip: 'PersonalPlaningTripDetail',
	personalroute: 'PersonalRouteDetail',
	cabinet: 'PersonalCabinet',

	detail: 'TripDetailStack',
	personal: 'PersonalDevStack',
	main: 'MainScreen',
};

export const screensLinks = {
	org: {stack: screens.detail, screen: screens.driver},
	user: {stack: screens.detail, screen: screens.user},
	trip: {stack: screens.detail, screen: screens.trip},
	route: {stack: screens.detail, screen: screens.route},

	personaltrip: {stack: screens.personal, screen: screens.personaltrip},
	personalroute: {stack: screens.personal, screen: screens.personalroute},
}

export const SUPPORTED_ORIENTATIONS = [
	'portrait',
	'portrait-upside-down',
	'landscape',
	'landscape-left',
	'landscape-right',
];
