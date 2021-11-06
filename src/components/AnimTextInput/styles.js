import {StyleSheet} from 'react-native';

export default StyleSheet.create({
	container: {
		flexDirection: 'row',
	},
	textInput: {
		flex: 1,
		paddingVertical: 15,
		paddingLeft: 0,
		fontStyle: 'normal',
		fontWeight: 'normal',
		fontSize: 18,
		color: '#2E394B',
		fontFamily: 'Roboto-Regular',
	},
	placeholder: {
		fontSize: 14,
		color: '#81858C',
	},
	placeholderContainer: {
		width: '100%',
		height: '100%',
		position: 'absolute',
	},
	placeholderWrapper: {
		height: '100%',
		position: 'absolute',
		justifyContent: 'center',
	},
	error: {
		borderBottomColor: '#FE693A',
	},
	errorMsg: {
		backgroundColor: '#FE693A',
		color: '#fff',
		paddingHorizontal: 7,
		borderBottomLeftRadius: 5,
		position: 'absolute',
		fontSize: 9,
		lineHeight: 11,
		right: 0,
		bottom: -12,
		zIndex: 100
	},
});
