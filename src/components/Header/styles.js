import { StyleSheet } from 'react-native';

export default StyleSheet.create({
	container:
	{
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	cityContainer:
	{
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
	},
	logoText:
	{
		// fontFamily: 'Redressed',
	},
	cityText:
	{
		fontSize: 14,
		fontFamily: 'Roboto-Medium',
		color: '#81858C',
		marginRight: 5,
	},
});
