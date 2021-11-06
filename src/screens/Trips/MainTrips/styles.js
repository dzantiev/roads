import { StyleSheet } from 'react-native';


export default StyleSheet.create({
	area:
	{
		flex: 1,
		backgroundColor: '#ffffff',
		paddingTop: 6
	},
	wrapper:
	{
		paddingHorizontal: 16,
	},
	header:
	{
		marginBottom: 28,
		paddingHorizontal: 16,
	},
	tripsHeader:
	{
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 11,
	},
	planing:
	{
		marginBottom: 11,
		paddingHorizontal: 16,
	},
	trip: {
		marginBottom: 20,
		shadowColor: '#000000',
		shadowRadius: 2,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.06,
		elevation: 1,
	},
	title:
	{
		color: '#81858C',
	},
	filter: {
		marginBottom: 23,
		// marginHorizontal: 16
	},
	flatList: {
		paddingHorizontal: 16
	}
});
