import React, {useState, useEffect, useRef, memo} from 'react';
import {View, Dimensions, StatusBar, Platform} from 'react-native';
import SmallBtn from '../SmallBtn'
import ZoomSlider from '../ZoomSlider'
import AppText from '../AppText'
import {CloseSvg} from '../../svg';
import Modal from 'react-native-modal';
import styles from './styles.js';

const SliderModal = ({
	slides,
	isVisible = false,
	animationIn,
	animationOut,
	animationInTiming,
	close,
	currentSlide,
	animationType,
	coseBtnTestID
}) => {
	const [width, setWidth] = useState(false);
	const slider = useRef(null);

	useEffect(() => {
		Dimensions.addEventListener('change', () => getScreenSizes());
		getScreenSizes();
		return () => Dimensions.removeEventListener('change', () => getScreenSizes());
	}, []);

	useEffect(() =>
	{
		slider.current && slider.current.resetPosition();
	},[isVisible]);

	const getScreenSizes = () => {
		setWidth(Dimensions.get('window').width);
	};

	const renderHeader = idx => {
		return (
			<View style={styles.head}>
				<AppText style={styles.text}>
					{idx + 1}/{slides.length}
				</AppText>
				<SmallBtn
					testID={coseBtnTestID}
					width={28}
					height={28}
					borderRadius={5}
					onPress={close}
					wrapperStyle={styles.closeBtn}
				>
					<CloseSvg height={16} width={16} />
				</SmallBtn>
			</View>
		);
	};

	const renderSlidesList = slides => {
		return slides.map(el => {
			return {url: el};
		});
	};

	return (
		<>
			{isVisible && <StatusBar hidden={(Platform.OS !== 'android') ? true : false} backgroundColor={'#2E394B'}/>}
			{slides && (
				<Modal
					animationType={animationType || 'slide'}
					isVisible={isVisible}
					backdropColor={'#2E394B'}
					onRequestClose={close}
					style={styles.modalWrapper}
					backdropOpacity={1}
					animationIn={animationIn || 'slideInUp'}
					animationOut={animationOut || 'slideOutDown'}
					animationInTiming={animationInTiming || 300}
				>
					<ZoomSlider
						index={currentSlide ? currentSlide : 0}
						ref={slider}
						imageUrls={renderSlidesList(slides)}
						onSwipeDown={close}
						backgroundColor={'#2E394B'}
						enableSwipeDown={true}
						saveToLocalByLongPress={false}
						renderHeader={idx => renderHeader(idx)}
						maxOverflow={width}
						onChange={idx => slider.current.resetImageByIndex(idx)}
					/>
				</Modal>
			)}
		</>
	);
};

export default memo(SliderModal);
