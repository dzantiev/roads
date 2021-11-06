import { StyleSheet } from 'react-native';

export default StyleSheet.create({
	container:
	{
		flexDirection: 'row',
		justifyContent: 'space-between'
		// alignItems: 'center',
	},
	dataWrapper: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	avatar:
	{
		backgroundColor: 'blue',
		width: 31,
		height: 31,
		borderRadius: 31,
	},
	textInfo:
	{
		flex: 1,
		paddingVertical: 9,
		paddingLeft: 9,
	},
	name:
	{
		fontSize: 14,
		color: '#2E394B',
	},
	seats:
	{
		fontSize: 12,
		color: '#81858C',
	},
	callBtn:
	{
		paddingVertical: 13,
		paddingLeft: 13,
		justifyContent: 'center',
	},
});
