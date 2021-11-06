import React, {useState} from 'react';
import {View, TouchableOpacity, ScrollView, SafeAreaView, StatusBar} from 'react-native';
import AppText from '../../components/AppText/index.js';
import styles from './styles.js';
import Modal from 'react-native-modal';
import {InstagramSvg, SmileSvg, ChatSvg} from '../../svg';

const ModalSelect = ({isVisible, close, data, onSelect, textStyle, icons}) => {
	const dataIsArray = Array.isArray(data);
	const curData = dataIsArray ? data : Object.values(data);
	const keys = dataIsArray ? [] : Object.keys(data);

	const onItemPress = i => {
		dataIsArray ? onSelect(i) : onSelect(keys[i]);
	};

	const [scrollOffset, setScrollOffset] = useState(null);
	const scrollViewRef = React.createRef();
	const handleScrollTo = p => {
		if (scrollViewRef.current) {
			scrollViewRef.current.scrollTo(p);
		}
	};
	const handleOnScroll = event => {
		setScrollOffset(event.nativeEvent.contentOffset.y);
	};

	const renderAboutIcons = i => {
		switch (i) {
			case 0:
				return <ChatSvg style={styles.icons} />;
			case 1:
				return <SmileSvg style={styles.icons} />;
			case 2:
				return <InstagramSvg style={styles.icons} />;
		}
	};

	return (
		<Modal
			isVisible={isVisible}
			onRequestClose={close}
			onBackdropPress={close}
			backdropOpacity={0.6}
			animationInTiming={300}
			animationOutTiming={300}
			style={styles.container}
			onSwipeComplete={close}
			swipeDirection={['down']}
			scrollTo={handleScrollTo}
			scrollOffset={scrollOffset}
			scrollOffsetMax={0}
			propagateSwipe={true}>
			<SafeAreaView style={styles.modalView}>
				{isVisible &&
				<StatusBar
					backgroundColor={'#ffffff43'}
					barStyle={'dark-content'}
				/>}
				<ScrollView
					ref={scrollViewRef}
					onScroll={handleOnScroll}
					scrollEventThrottle={16}>
					<View style={styles.rectangleWrap}>
						<View style={styles.rectangle}></View>
					</View>
					<View style={styles.contentWrapper}>
						{curData.map((item, index) => (
							<TouchableOpacity
								testID={`select-${index}`}
								style={styles.item}
								key={'select' + index}
								activeOpacity={0.7}
								onPress={() => onItemPress(index)}>
								{icons === 'about' && renderAboutIcons(index)}
								<AppText
									style={{...styles.itemText, ...textStyle}}>
									{item}
								</AppText>
							</TouchableOpacity>
						))}
					</View>
				</ScrollView>
			</SafeAreaView>
		</Modal>
	);
};

export default ModalSelect;
