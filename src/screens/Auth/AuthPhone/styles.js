import { StyleSheet } from 'react-native';


export default StyleSheet.create({
	areaWrapper:
	{
		flex: 1,
		// justifyContent: 'center',
		backgroundColor: '#F4F6F6',
	},
	container:
	{
		flex: 1,
		// paddingVertical: 20,
		// paddingHorizontal: 26,
		
	},
	keyboardContainer:
	{
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
	},
	scrollContainer:
	{
		// justifyContent: 'center',
		paddingVertical: 20,
		paddingHorizontal: 26,
		// flex: 1,
		flexGrow: 1,
	},
	phoneInput:
	{
		marginTop: 58,
		borderWidth: 1,
		borderColor: 'transparent'
	},
	entryBtn:
	{
		marginTop: 16,
	},
	loading:
	{
		flex: 1,
		backgroundColor: '#F4F6F6',
		justifyContent: 'center',
		alignItems: 'center',
	},
	policyCard: {
		marginTop: 50,
		backgroundColor: 'rgba(222, 222, 222, 0.15)',
		borderRadius: 10,
		paddingVertical: 18,
		paddingHorizontal: 10,
	},
	policyCardText: {
		textAlign: 'center',
		fontSize: 12,
		lineHeight: 19,
		color: '#81858C'
	},
	policyCardGreen: {
		color: '#91B954'
	},
	error: {
		borderColor: '#FE693A'
	},
	errorMsg: {
		textAlign: 'right',
		color: '#FE693A',
		fontSize: 12,
		marginTop: 8
	}
});
