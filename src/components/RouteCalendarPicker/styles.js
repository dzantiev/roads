import {StyleSheet} from 'react-native';

export default StyleSheet.create({
	container: {
		borderRadius: 5,
		backgroundColor: '#fff',
		padding: 16,
	},
	nav: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingTop: 15,
	},
	greenBtn: {
		fontSize: 18,
		lineHeight: 20,
	},
	headerWr:
	{
		padding: 17,
		paddingHorizontal: 25,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	arrowImage:
	{
		tintColor: '#76A829',
	},
	headerText:
	{
		fontSize: 18,
		lineHeight: 18,
		// fontFamily: 'Roboto-Light',
		color: '#2d4150',
		margin: 10,
	},
	yearsListWr:
	{
		position: 'absolute',
		backgroundColor: '#fff',
		height: '89%',
		width: '100%',
		left: 16,
		top: 70,
		zIndex: 1,
	},
	yearsListItemActive:
	{
		padding: 10,
		borderBottomWidth: 1,
		borderColor: '#92c932',
	},
	yearsListItem:
	{
		padding: 10,
		borderBottomWidth: 1,
		borderColor: '#33333350',
	},
	yearsListItemText:
	{
		textAlign: 'center',
		fontSize: 22,
		color: '#33333380',
	},
	yearsListItemTextActive:
	{
		textAlign: 'center',
		fontSize: 26,
		fontFamily: 'Roboto-Bold',
		color: '#92c932',
	},
});
