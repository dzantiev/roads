import {StyleSheet} from 'react-native';


export default StyleSheet.create({
	area:
	{
		flex: 1,
		backgroundColor: '#fff',
	},
	wrapper:
	{

	},
	navBar:
	{
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		width: '100%',
		zIndex: 1000,
	},
	container:
	{
		marginTop: -15,
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
		backgroundColor: '#fff',
		paddingBottom: 32,
	},
	wrapper:
	{
		paddingHorizontal: 16,
		paddingTop: 15,
		backgroundColor: 'white',
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
	},
	infoLine:
	{
		borderBottomWidth: 1,
		borderColor: '#DEDEDE',
	},
	desc:
	{
		marginBottom: 6,
		marginTop: 10
	},
	bigBtn:
	{
		marginTop: 28,
	},
	shareBtn:
	{
		marginTop: 45,
	},
	greenBtn:
	{
		backgroundColor: '#F4F6F6',
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderRadius: 5,
	},
	driverAndDuration: {
	},
	durationChips: {
		height: '100%',
		marginLeft: 10,
	},
	categoryChipsList: {
		flexDirection: 'row'
	},
	categoryChips: {
		backgroundColor: 'rgba(137, 137, 137, 0.7)',
		borderRadius: 30,
		justifyContent: 'center',
		paddingHorizontal: 10,
		height: 23,
		marginRight: 10,
	},
	infoData: {
		position: 'absolute',
		justifyContent: 'flex-end',
		zIndex: -1,
		top: 0,
		left: 0,
		width: '100%',
		height: 165,
		transform: [
			{translateY: -150}
		]
	},
	infoDataWrapper: {
		paddingBottom: 35,
		paddingHorizontal: 16,
	},
	titleWrap: {
		marginTop: 10
	},
	title: {
		color: '#fff',
		fontSize: 16,
		lineHeight: 19
	},
	descriptionWrap: {
		marginTop: 4
	},
	description: {
		color: '#fff',
		fontSize: 10,
		lineHeight: 14
	},
	linearGradient: {
		flex: 1,
		justifyContent: 'flex-end',
		zIndex: 10
	},
	categoryChipsText: {
		color: '#fff',
		fontSize: 11,
		lineHeight: 13,
		fontFamily: 'Roboto-Medium'
	},
	pagination: {
		top: 22,
		right: 80
	},
	driverPreview: {
	},
});
