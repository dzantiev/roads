import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
	container:
	{
		paddingVertical: 6,
		paddingLeft: 6,
		paddingRight: 10,
		backgroundColor: '#2E394B',
		borderRadius: 50,
	},
	wrap: {
		flexDirection: 'row',
		overflow: 'hidden',
	},
	avatar:
	{
		height: 28,
		width: 28,
		borderRadius: 21,
		marginRight: 12,
	},
	text:
	{
		fontStyle: 'normal',
		fontFamily: 'Roboto-Bold',
		fontSize: 14,
		color: '#fff',
	},
	smallText:
	{
		fontStyle: 'normal',
		fontWeight: 'normal',
		fontSize: 10,
		lineHeight: 12,
		color: '#2E394B',
	},
	texts:
	{
		justifyContent: 'center',
	},
});
