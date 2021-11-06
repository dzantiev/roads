import {StyleSheet} from 'react-native';


export default StyleSheet.create({
	area: {
		flex: 1,
		backgroundColor: '#fff',
	},
	wrapper:
	{
		flex: 1,
	},
	navBar: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		// alignItems: 'center',
		paddingHorizontal: 16,
		width: '100%',
		zIndex: 1000,
	},
	container: {
		paddingHorizontal: 16,
		paddingBottom: 32,
	},
	infoLine: {
		borderBottomWidth: 1,
		borderColor: '#DEDEDE',
	},
	desc: {
		marginTop: 10,
		marginBottom: 6,
	},
	descTitleStyle: {
		fontFamily: 'Roboto-Bold',
		fontSize: 18,
		color: '#2E394B',
	},
	bigBtn: {
		marginTop: 28,
	},
	touristsCount:
	{
		fontStyle: 'normal',
		fontSize: 14,
		color: '#81858C',
	},
	touristsBold:
	{
		fontSize: 18,
		color: '#2E394B',
		marginRight: 3,
	},
	touristsWr:
	{
		paddingTop: 12,
		flexDirection: 'row',
		alignItems: 'flex-end',
	},
	toursitsEmptySeats:
	{
		fontSize: 14,
		color: '#81858C',
	},
	touristsSeatsWr:
	{
		paddingBottom: 12,
		borderBottomWidth: 1,
		borderColor: '#DEDEDE',
	},
	shareBtn: {
		marginTop: 45
	},
	greenBtn: {
		backgroundColor: '#F4F6F6',
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderRadius: 5
	}
});
