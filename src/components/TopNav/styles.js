import { StyleSheet } from 'react-native';

export default StyleSheet.create({
	container:
	{
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderBottomColor: '#DEDEDE',
	},
	button:
	{
		flex: 5,
	},
	leftBtn:
	{
		alignItems: 'flex-end',
	},
	leftText:
	{
		fontSize: 14,
		color: '#76A829',
		paddingLeft: 17,
		paddingRight: 10,
	},
	rightText:
	{
		fontSize: 14,
		fontFamily: 'Roboto-Medium',
		color: '#76A829',
		paddingRight: 17,
		paddingLeft: 10,
	},
	titleText:
	{
		flex: 8,
		fontSize: 15,
		color: '#2E394B',
		fontFamily: 'Roboto-Medium',
		textAlign: 'center',
	},
});
