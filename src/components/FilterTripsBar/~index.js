import React, {useState, useRef} from 'react';
import {View, TouchableOpacity, Modal, Pressable, Animated} from 'react-native';
import styles from './styles';
import {CalendarBlank, UsersSvg, ArrowsDownUp} from '../../svg';
import AppText from '../AppText';
import DateRangePicker from '../DateRangePicker';
import ModalSelect from '../ModalSelect';
import {dateFormatter} from '../../services';
import { SUPPORTED_ORIENTATIONS } from '../../variables';

const FilterTripsBar = ({
	style,
	initDates,
	initFilter,
	filters,
	onDateChange,
	peopleCounters,
	currentCounter = 3,
	onPeopleChange,
	onRateChange,
	hideDates,
	onClear,
	filterIsChanged,
	closeOnBgPress,
}) => {
	const filtersKeys = Object.keys(filters);

	const [isModal, setIsModal] = useState(false);
	const [isPeopleModal, setIsPeopleModal] = useState(false);
	const springValue = useRef(new Animated.Value(0)).current;

	const dateSelect = date => {
		setIsModal(false);
		onDateChange(date);
	};

	const changeFilter = () => {
		initFilter === filtersKeys[0]
			? onRateChange(filtersKeys[1])
			: onRateChange(filtersKeys[0]);
	};

	const peoplesSelect = i => {
		onPeopleChange(i);
		setIsPeopleModal(false);
	};

	const openCalendar = async () => {
		await setIsModal(true);
		Animated.spring(springValue, {
			toValue: 1,
			speed: 12,
			bounciness: 5,
			velocity: 15,
			useNativeDriver: false,
		}).start();
	};

	const closeCalendar = async () => {
		await setIsModal(false);
		springValue.setValue(0);
	};

	return (
		<>
			<View style={{...styles.container, ...style}}>
				<View style={styles.firstLine}>
					{!hideDates && (
						<TouchableOpacity
							style={styles.item}
							activeOpacity={0.7}
							onPress={openCalendar}>
							<CalendarBlank style={styles.svg} />
							<AppText style={styles.text}>
								{`${dateFormatter(
									initDates.start,
								)} - ${dateFormatter(initDates.end)}`}
							</AppText>
						</TouchableOpacity>
					)}
					<TouchableOpacity
						style={styles.item}
						activeOpacity={0.7}
						onPress={() => setIsPeopleModal(true)}>
						<UsersSvg style={styles.svg} />
						<AppText style={styles.text}>
							{currentCounter === 0 ? 'Все' : currentCounter}
						</AppText>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.item, styles.rate]}
						activeOpacity={0.7}
						onPress={changeFilter}>
						<ArrowsDownUp style={styles.svg} />
						<AppText style={styles.text}>{filters[initFilter]}</AppText>
					</TouchableOpacity>
				</View>
				{
					filterIsChanged &&
					<TouchableOpacity activeOpacity={0.7} onPress={onClear}>
						<View style={styles.clearBtn}>
							<AppText style={styles.clearBtnText}>
								Сбросить фильтр
							</AppText>
						</View>
					</TouchableOpacity>
				}
			</View>
			<Modal
				visible={isModal}
				onRequestClose={closeCalendar}
				transparent={true}
				supportedOrientations={SUPPORTED_ORIENTATIONS}
				animationType={'none'}
			>
				<Pressable
					onPress={() => closeOnBgPress && closeCalendar()}
					style={styles.clickOutSide}
				>
					<Animated.View
						style={{
							transform: [{scale: springValue}],
						}}>
						<DateRangePicker
							isRange
							onDateSelect={date => dateSelect(date)}
							cansel={closeCalendar}
							minDate={new Date()}
						/>
					</Animated.View>
				</Pressable>
			</Modal>
			<ModalSelect
				isVisible={isPeopleModal}
				data={peopleCounters}
				close={() => setIsPeopleModal(false)}
				onSelect={peoplesSelect}
				textStyle={styles.textStyle}
			/>
		</>
	);
};

export default FilterTripsBar;
