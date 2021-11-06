import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
	background:
	{
		flex: 1,
		backgroundColor: '#00000080',
		justifyContent: 'center',
		alignItems: 'center',
	},
	container:
	{
		maxWidth: 350,
		marginHorizontal: 30,
		backgroundColor: '#F4F6F6',
		width: 330,
		borderRadius: 10,
		paddingVertical: 10,
	},
	content:
	{
		justifyContent: 'center',
		padding: 20,
	},
	title:
	{
		textAlign: 'center',
		color: '#2E394B',
		fontFamily: 'Roboto-Medium',
		lineHeight: 25,
		fontSize: 18,
		marginBottom: 5,
	},
	message:
	{
		textAlign: 'center',
		fontSize: 15,
		color: '#2E394B',
		paddingTop: 10,
	},
	buttonContainer:
	{
		flexDirection: 'row',
		justifyContent: 'center',
		borderRadius: 5,
		flexWrap: 'wrap',
	},
	button:
	{
		marginBottom: 20,
		marginHorizontal: 10,
		alignItems: 'center',
		minWidth: 90,
		backgroundColor: '#76A829',
		borderRadius: 13,
		paddingVertical: 13,
		width: 125,
		marginLeft: 20,
	},
	buttonCancel:
	{
		backgroundColor: '#DEDEDE',
		borderRadius: 13,
		paddingVertical: 13,
		width: 125,
		marginRight: 0,
		color: '#2E394B',
	},
	textButton:
	{
		fontSize: 15,
		textAlign: 'center',
		color: '#FFF',
		fontFamily: 'Roboto-Medium',
	},
	textCancel:
	{
		color: '#2E394B',
	},
	phoneInput:
	{
		paddingBottom: 25,
		marginHorizontal: 15,
	},
});

export default styles;
