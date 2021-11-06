import { StyleSheet } from 'react-native';

export default StyleSheet.create({
	container:
	{
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		paddingTop: 15,
		paddingBottom: 15,
		borderBottomColor: '#DEDEDE',
		borderBottomWidth: 1,
		width: '100%',
	},
	status: {
		paddingLeft: 25,
		paddingRight: 25,
		borderRadius: 24,
	},
	pendingStatus:
	{
		backgroundColor: '#FFF0E4',
	},
	anotherStatus:
	{
		backgroundColor: '#E4EED4',
	},
	pendingText:
	{
		fontFamily: 'Roboto-Bold',
		fontSize: 12,
		color: '#FEA35D',
		lineHeight: 30,
	},
	anotherText:
	{
		fontFamily: 'Roboto-Bold',
		fontSize: 12,
		color: '#76A829',
		lineHeight: 30,
	},
	bigText:
	{
		fontStyle: 'normal',
		fontWeight: 'normal',
		fontSize: 14,
		color: '#2E394B',
		textAlign: 'right',
	},
	bigTextURL: {
		color: '#76A829',
	},
	smallText:
	{
		fontStyle: 'normal',
		fontWeight: 'normal',
		fontSize: 12,
		color: '#2E394B',
		textAlign: 'right',
	},
	info:
	{
		maxWidth: '60%',
		flex: 1,
	}
});
