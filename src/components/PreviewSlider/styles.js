import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
	stretchyHeader:
	{
		flex: 1,
	},
	container:
	{
		marginTop: -1000,
		paddingTop: 1000,
		overflow: 'hidden',
		alignItems: 'center',
		position: 'relative',
	},
	stretchyHeaderTop: scrollA => ({
		position: 'absolute',
		width: '100%',
		zIndex: 10,
		transform: [
			{
				translateY: scrollA.interpolate({
					inputRange: [ -250,  0,  200, 250],
					outputRange: [ -200, 20, 210, 200], // 40

				}),
			},
		],
	}),
	slide:
	{
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	slideWr:
	{
		flex: 1,
		width: '100%',
	},
	slideImg:
	{
		flex: 1,
		resizeMode:'cover',
	},
	pagination:
	{
		width: 10,
		height: 10,
		borderRadius: 5,
	},
	paginationWr:
	{
		position: 'absolute',
		bottom: 0,
		height: 30,
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	paginationNumberWr:
	{
		position: 'absolute',
		top: 18,
		right: 15,
		backgroundColor: 'rgba(46, 57, 75, 0.7)',
		borderRadius: 3
	},
	paginationText: {
		color: '#fff',
		fontSize: 10,
		lineHeight: 14,
		padding: 5,
	},
	paginationItemActive:
	{
		backgroundColor: '#76A829',
		borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
		width: 5,
		height: 5,
		marginRight: 5,
	},
	paginationItem:
	{
		backgroundColor: '#F0F0F0',
		borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
		width: 5,
		height: 5,
		marginRight: 5,
	},
	paginationBox:
	{
		backgroundColor: 'transparent',
		justifyContent: 'center',
		height: 'auto',
		padding: 0,
	},
	wr: scrollA => ({
		height: 320, //280
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		transform: [
			{
				translateY: scrollA.interpolate({
					inputRange: [-250, 0, 250, 250 + 1],
					outputRange: [-250 / 2, 0, 250 * 0.75, 250 * 0.75],
				}),
			},
			{
				scale: scrollA.interpolate({
					inputRange: [-100, 0, 250, 250 + 1],
					outputRange: [1.7, 1, 1, 1],
				}),
			},
		],
	}),
});
