import {Linking} from 'react-native';
import {yaURL} from '../variables';

export const meetPlaceURL = text => {
	const q = new URLSearchParams({text}).toString();
	return  `${yaURL}?${q}`;
};
export const goToPlace = URL => {
	Linking.openURL(meetPlaceURL(URL));
};
