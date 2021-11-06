import React, {useState, memo, useRef, useCallback} from 'react';
import {TouchableOpacity, Modal, Pressable, Animated, ScrollView} from 'react-native';
import styles from './styles';
import {CloseSvg} from '../../svg';
import AppText from '../AppText';
import DateRangePicker from '../DateRangePicker';
import ModalSelect from '../ModalSelect';
import {dateFormatter, FullDateFormatter} from '../../services';
import {SUPPORTED_ORIENTATIONS, peopleCounters, sortList} from '../../variables';
import AppMetrica from 'react-native-appmetrica';

const FilterTripsBar = ({
	style,
	currentValues,
	defaultFilters,
	onClear,
	closeOnBgPress, //закрывать модалку даты на click outside
	hideDates,
	categories = [],
	onFiltersChange,
}) => {
	const springValue = useRef(new Animated.Value(0)).current;
	const [isModal, setIsModal] = useState(false);
	const [modalData, setModalData] = useState([]);
	const [currentField, setCurrentField] = useState('');

	const datesIsChanged = (curDate, defDate) => {
		return FullDateFormatter(curDate.start) !== FullDateFormatter(defDate.start) &&
		FullDateFormatter(curDate.end) !== FullDateFormatter(defDate.end);
	};

	const filterIsChanged = () => {
		return Object.keys(currentValues).some(key => {
			if (key === 'date') {
				return datesIsChanged(currentValues[key], defaultFilters[key]);
			}
			return currentValues[key] !== defaultFilters[key];
		});
	};

	const filterTitles = {
		category: 'Категория',
		seats: 'Мест',
		sort: 'Сортировка',

	};

	const setDefaultFilterParams = useCallback((key, list) => ({
		caption: currentValues[key] !== defaultFilters[key]
			? list[currentValues[key]]
			: filterTitles[key],
		isActive: currentValues[key] !== defaultFilters[key],
		func: () => {
			setModalData(list);
			setCurrentField(key);
			setIsModal(true);
		},
	}), [currentValues]);

	const [filters, setFilters] = useState({
		category: setDefaultFilterParams('category', categories),
		...(
			defaultFilters.seats &&
			{seats: setDefaultFilterParams('seats', peopleCounters)}
		),
		...(
			!hideDates &&
			{
				date:
				{
					caption: !datesIsChanged(currentValues.date, defaultFilters.date)
						? 'Дата'
						: currentValues.date.start === currentValues.date.end
							? dateFormatter(currentValues.date.start)
							: `${dateFormatter(currentValues.date.start)} - ${dateFormatter(currentValues.date.end)}`,
					isActive: datesIsChanged(currentValues.date, defaultFilters.date),
					isVisible: false,
					func: () => {
						modalToggle(true, 'date');
						Animated.spring(springValue, {
							toValue: 1,
							speed: 12,
							bounciness: 5,
							velocity: 15,
							useNativeDriver: false,
						}).start();
					},
				},
			}
		),
		sort: setDefaultFilterParams('sort', sortList),
	});

	const onFilterPress = (v) =>
	{
		onFiltersChange({
			...currentValues,
			[currentField]: v,
		});
		setIsModal(false);
		AppMetrica.reportEvent('filter', hideDates
			? {'routeFilter': {[currentField]: v}} // Статистика для маршрутов
			: {'tripFilter': {[currentField]: v}}, // Статистика для предстоящих поездок
		);
	};

	const dateModalSelect = date =>
	{
		onFiltersChange({
			...currentValues,
			date,
		});
		modalToggle(false, 'date');
		AppMetrica.reportEvent('filter', {'tripFilter': {
			'date': `start=${date.start} end=${date.end}`, // Статистика для предстоящих поездок
		}});
	};

	const modalToggle = (visible = false, key) =>
	{
		setFilters({
			...filters,
			[key]: {
				...filters[key],
				isVisible: visible,
			},
		});
	};

	const renderItem = (item, key) =>
	{
		if (!hideDates || key !== 'date') {
			return (
				<TouchableOpacity
					testID={`filter-${key}`}
					key={key}
					style={item.isActive ? styles.activeItem : styles.inactiveItem}
					activeOpacity={0.7}
					onPress={item.func}>
					<AppText
						style={item.isActive
							? styles.activeFilterText
							: styles.inactiveFilterText}
						numberOfLines={1}>
						{item.caption}
					</AppText>
				</TouchableOpacity>
			);
		} else {
			return null;
		}
	};

	const renderClearBtn = () =>
	{
		return (
			<TouchableOpacity
				testID={'clearBtn'}
				style={{...styles.inactiveItem, ...styles.clearBtn}}
				activeOpacity={0.7}
				onPress={onClear}>
				<CloseSvg style={styles.closeSvg} width={10} height={10}/>
				<AppText style={styles.inactiveFilterText} numberOfLines={1}>
					Сбросить
				</AppText>
			</TouchableOpacity>
		);
	};

	const renderFilters = useCallback(() => {
		return Object
			.keys(filters)
			.map(key => renderItem(filters[key], key))
			.filter(_ => _);
	}, [filters]);

	return (
		<>
			<ScrollView
				testID={'scrollView'}
				style={{...styles.container, ...style}}
				horizontal={true}
				showsHorizontalScrollIndicator={false}
			>
				{filterIsChanged() && renderClearBtn()}
				{renderFilters()}
			</ScrollView>
			{
				!hideDates &&
				<Modal
					visible={filters.date.isVisible}
					onRequestClose={() => modalToggle(false, 'date')}
					transparent={true}
					supportedOrientations={SUPPORTED_ORIENTATIONS}
					animationType={'none'}
				>
					<Pressable
						onPress={() => closeOnBgPress && modalToggle(false, 'date')}
						style={styles.clickOutSide}
					>
						<Animated.View
							style={{
								transform: [{scale: springValue}],
							}}>
							<DateRangePicker
								cancelTestID={'closeDatePicker'}
								successTestID={'successDatePicker'}
								isRange
								onDateSelect={date => dateModalSelect(date)}
								cansel={() => modalToggle(false, 'date')}
								minDate={new Date()}
							/>
						</Animated.View>
					</Pressable>
				</Modal>
			}
			<ModalSelect
				isVisible={isModal}
				data={modalData}
				close={() => setIsModal(false)}
				onSelect={onFilterPress}
				textStyle={styles.textStyle}
			/>
		</>
	);
};

export default memo(FilterTripsBar);
