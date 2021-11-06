import { StyleSheet } from 'react-native';


export default StyleSheet.create({
	pointsInputWrapper:
	{
		backgroundColor: '#FFF',
	},
	pointsInputRow:
	{
		borderBottomColor: '#DEDEDE',
		borderBottomWidth: 1,
		flexDirection: 'row',
		marginLeft: 17,
		paddingRight: 17,
		alignItems: 'center',
	},
	pointInput:
	{
		flex: 1,
		paddingHorizontal: 10,
		paddingVertical: 15,
		fontStyle: 'normal',
		fontWeight: 'normal',
		fontSize: 18,
		color: '#2E394B',
		fontFamily: 'Roboto-Regular',
	},
	removePointBtn:
	{
		width: 21,
		height: 21,
		alignItems: 'center',
		justifyContent: 'center',
	},
	addPointBtn:
	{
		justifyContent: 'space-between',
		alignItems: 'center',
		marginHorizontal: 17,
		flexDirection: 'row',
	},
	addPointText:
	{
		paddingVertical: 17,
		fontSize: 14,
		color: '#2E394B',
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
		bottom: -11
	}
});
