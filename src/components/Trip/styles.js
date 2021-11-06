import { StyleSheet } from 'react-native';

export default StyleSheet.create({
	container:
	{
		width: '100%',
		backgroundColor: '#F4F6F6',
		borderRadius: 10,
		overflow: 'hidden',
		flexDirection: 'row',
		height: 163,
	},
	wrapper:
	{
		paddingVertical: 8,
		paddingHorizontal: 10,
		flex: 1,
	},
	tripImgWrap:
	{
		height: '100%',
		width: 100,
	},
	tripImg:
	{
		height: '100%',
		width: '100%',
		resizeMode: 'cover',
	},
	calendarWrapper:
	{
		position: 'absolute',
		left: 8,
		top: 10,
		flexDirection: 'row',
		width: 85,
		paddingVertical: 6,
		backgroundColor: '#2E394B',
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center',
	},
	calendarWrapperOld:
	{
		backgroundColor: '#81858C',
	},
	calendar:
	{
		fontSize: 9,
		lineHeight: 11,
		color: '#FFF',
		marginTop: 1,
	},
	row:
	{
		flexDirection: 'row',
		alignItems: 'center',
	},
	firstRow:
	{
		marginBottom: 5,
	},
	grayText:
	{
		fontSize: 10,
		lineHeight: 12,
		color: '#81858C',
	},
	grayTextUpper:
	{
		fontSize: 11,
		lineHeight: 13,
		color: '#81858C',
		textTransform: 'uppercase',
		fontFamily: 'Roboto-Medium',
	},
	usersSvg:
	{
		marginRight: 6,
		marginLeft: 2,
	},
	title:
	{
		fontSize: 14,
		lineHeight: 16,
		marginBottom: 4,
		color: '#2E394B',
	},
	description:
	{
		fontSize: 10,
		lineHeight: 12,
		color: '#81858C',
		marginBottom: 6,
	},
	driverFace:
	{
		width: 14,
		height: 14,
		borderRadius: 7,
		marginRight: 5,
	},
	driverName:
	{
		fontSize: 10,
		lineHeight: 12,
		fontFamily: 'Roboto-Medium',
		color: '#2E394B',
	},
	footer:
	{
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
	},
	price:
	{
		color: '#2E394B',
		fontSize: 12,
		lineHeight: 14,
		alignSelf: 'flex-end',
		marginBottom: 3,
	},
	seats:
	{
		fontSize: 10,
		lineHeight: 12,
	},
});
