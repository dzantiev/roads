import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
	container:
	{
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	wr:
	{
		flexDirection: 'row',
		alignItems: 'center',
	},
	btn:
	{
		height: 30,
		width: 30,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
		backgroundColor: '#F4F6F6',
	},
	counterText:
	{
		fontStyle: 'normal',
		fontWeight: 'normal',
		fontSize: 18,
		lineHeight: 21,
		color: '#000000',
		marginRight: 10,
		marginLeft: 10,
	},
});
