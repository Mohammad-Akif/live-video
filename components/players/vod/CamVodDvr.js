import React, { useState, useEffect, useContext, useRef } from 'react';
import moment from 'moment-timezone';
import dateFormat from 'dateformat';
import {
	ScrollMenu,
	getItemsPos,
	VisibilityContext
} from 'react-horizontal-scrolling-menu'; // Timeline Scroll
import CamVodDvrInterval from './CamVodDvrInterval';
import { LeftArrow, RightArrow } from './CamVodDvrControls';
import getCamClipsStartOnly from '../../hooks/camera/getCamClipsStartOnly';

export default function CamVodDvr(props) {
	const {
		camera,
		allValues,
		setAllValues,
		calendarBoundStart,
		calendarBoundEnd,
		calendarDates,
		setCalendarDates,
		selectedDay,
		setSelectedDay,
		selectedStartDay,
		setSelectedStartDay
	} = props;
	const {
		isFirstItemVisible,
		isLastItemVisible,
		scrollPrev,
		scrollToItem,
		visibleItems,
		getItemById
	} = React.useContext(VisibilityContext);
	const [timelineIntervals, setTimelineIntervals] = useState([]);
	const [timelineIntervalSet, setTimelineIntervalSet] = useState([]);
	const dvrRef = useRef({});
	const [selectedInterval, setSelectedInterval] = useState([]); // Collection of Selected Intervals
	const [fetchClip, setFetchClip] = useState(false);
	const [currentInterval, setCurrentInterval] = useState(new Date());
	let earlyBound = moment.utc(calendarBoundStart).tz(camera.timezone); //Recording Beginning Time Interval + timezone
	let endBound = moment.utc(calendarBoundEnd).tz(camera.timezone); //Recording End Time Interval + timezone

	//  Calculate Intervals Function
	const everyNminutes = (n) => {
		let timeIntervals = [];
		for (let hours = 0; hours < 24; hours++) {
			for (let minutes = 0; minutes < 60; minutes = minutes + n) {
				let h = '';
				let m = '';
				if (hours < 10) {
					h = '0' + hours;
				} else {
					h = hours;
				}

				if (minutes < 10) {
					m = '0' + minutes;
				} else {
					m = minutes;
				}
				timeIntervals.push(h + ':' + m);
			}
		}
		setTimelineIntervalSet(timeIntervals); //create data set to push
		setTimelineIntervals(timeIntervals); // Dvr
	};

	//Calculate Array of Days Between Bounds
	useEffect(() => {
		const daysBetween = () => {
			let dates = []; // Calculate From Start of Recording to end of Current Day
			for (
				var m = moment(moment(calendarBoundStart).format());
				m.isSameOrBefore(
					moment(calendarBoundEnd).endOf('day').format()
				);
				m.add(1, 'days')
			) {
				// timelineIntervals.push(timelineIntervals)
				dates.push(m.format('MM/DD/YYYY'));
			}
			setCalendarDates(dates);
		};
		daysBetween();
		everyNminutes(1); // 1 Min Intervals
	}, []);

	// Center on Recording Start Bound
	const centerOnInitStartBound = ({
		getItemById,
		scrollToItem,
		visibleItems
	}) => {
		// const { center: centerItemKey } = getItemsPos(visibleItems); //Scroll to center Item on Init
		// scrollToItem(getItemById(dateFormat(new Date(allValues?.url?.objects[0]?.start + 'z'), 'HH:MM' )), "auto", "center");
		// setCurrentInterval(dateFormat(new Date(allValues?.url?.objects[0]?.start  + 'z'), 'HH:mm:ss' ))
	};

	// Center on Recording Start Bound
	const centerOnInit = ({ getItemById, scrollToItem, visibleItems }) => {
		// const { center: centerItemKey } = getItemsPos(visibleItems); //Scroll to center Item on Init
		scrollToItem(getItemById('00:00'), 'auto', 'center');
		// setCurrentInterval("00:00")
	};

	// @React-Horizontal-Scroll (DVR scroll)
	const isItemSelected = (id) => !!selectedInterval.find((el) => el === id);

	// Handle Dvr Interval Clicked
	const handleClick =
		(id) =>
		({ getItemById, scrollToItem }) => {
			console.log('ran', id);

			const itemSelected = isItemSelected(id);
			setSelectedInterval((currentSelected) =>
				itemSelected
					? currentSelected.filter((el) => el !== id)
					: currentSelected.concat(id)
			);

			if (!itemSelected) {
				let dvrDateClicked = new Date(selectedStartDay + 'T' + id);
				if (dvrDateClicked < earlyBound) {
					console.log(
						'Handle Click Before Start Boundary',
						dateFormat(earlyBound, ' yyyy-mm-dd HH:MM:ss')
					);
					setCurrentInterval(
						moment.utc(earlyBound).format('YYYY-MM-DD HH:mm:ss')
					);
					setFetchClip(true);
					scrollToItem(
						getItemById(dateFormat(earlyBound, 'HH:MM')),
						'smooth',
						'center',
						'nearest'
					);
					//    setCurrentInterval(dateformat(earlyBound, 'HH:MM' ))
				} else if (dvrDateClicked > endBound) {
					// NOTE: center item on select
					console.log(
						'Handle Click After End Boundary',
						dateFormat(endBound, 'yyyy-mm-dd HH:MM')
					);
					setCurrentInterval(
						moment.utc(endBound).format('YYYY-MM-DD HH:mm:ss')
					);
					setFetchClip(true);
					scrollToItem(
						getItemById(dateFormat(endBound, 'HH:MM')),
						'smooth',
						'center',
						'nearest'
					);
					//    setCurrentInterval(dateformat(endBound, 'HH:MM' ));
				} else {
					console.log('Handle Within Bounds');
					// NOTE: center item on select
					// scrollToItem(getItemById(id), 'smooth', 'center', 'nearest');
					setCurrentInterval(
						moment.utc(dvrDateClicked).format('YYYY-MM-DD HH:mm:ss')
					);
					setFetchClip(true);
				}
			}
		};

	const { data: resData, error: clipUpdateErr } = getCamClipsStartOnly({
		fetchGrant: fetchClip,
		token: camera.vxg.allToken,
		limit: 15,
		start: currentInterval
	});
	//    console.log('new clips arr',resData, clipUpdateErr)
	useEffect(() => {
		if (resData) {
			setFetchClip(false);
			setAllValues((prevValues) => {
				return { ...prevValues, url: resData.clips };
			});
		}
	}, [resData]);
	// console.log(selectedStartDay);
	return (
		<div className="py-2 flex flex-col items-center justify-start  bg-white w-full">
			<span
				onClick={() => alert('Hello')}
				className="cursor-pointer px-2 w-full flex flex-row justify-start font-bold mt-2 text-xl"
			>
				{dateFormat(
					moment
						.utc(allValues?.url?.objects[0]?.start)
						.tz(camera.timezone),
					'mmmm dd'
				)}
			</span>
			<div className="mt-1">
				<ScrollMenu
					scrollContainerClassName={
						'max-w-[240px] sm:max-w-[480px] md:max-w-[638px] lg:max-w-[850px] py-4'
					}
					apiRef={dvrRef}
					LeftArrow={
						<LeftArrow
							camera={camera}
							calendarDates={calendarDates}
							setAllValues={setAllValues}
							allValues={allValues}
							selectedStartDay={selectedStartDay}
							setSelectedStartDay={setSelectedStartDay}
							setCurrentInterval={setCurrentInterval}
						/>
					}
					RightArrow={
						<RightArrow
							camera={camera}
							calendarDates={calendarDates}
							setAllValues={setAllValues}
							allValues={allValues}
							selectedStartDay={selectedStartDay}
							setSelectedStartDay={setSelectedStartDay}
							setCurrentInterval={setCurrentInterval}
						/>
					}
					onInit={centerOnInitStartBound} //replaced with useEffect/Ref
				>
					{timelineIntervals.map((interval, idx) => (
						<CamVodDvrInterval
							key={interval}
							timezone={camera.timezone}
							earlyBound={earlyBound}
							endBound={endBound}
							calendarDates={calendarDates}
							itemId={interval}
							idx={idx}
							interval={interval}
							onClick={handleClick(interval)}
							selectedInterval={selectedInterval}
							setSelectedInterval={setSelectedInterval}
							allValues={allValues}
						/>
					))}
				</ScrollMenu>
			</div>
		</div>
	);
}
