import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import getCameraCalender from '../../hooks/camera/getCameraCalender';
import getCameraAiEvents from '../../hooks/camera/getCameraAiEvents';
import getCameraMotionEvents from '../../hooks/camera/getCameraMotionEvents';
import getCameraImages from '../../hooks/camera/getCameraImages';

import CamVod from '../../players/vod/CamVod';
import dateFormat from 'dateformat';
import CamVodDvr from '../../players/vod/CamVodDvr';
import CameraClipSection from './sections/CameraClipSection';
import DvrFilters from './sections/DvrFilters';
import CamLive from '../../players/live/CamLive';

export default function CamVodView(props) {
	const { camera } = props;
	const [showLive, setShowLive] = useState(false);
	const [motionFilter, setMotionFilter] = useState(false);
	const [aiFilter, setAiFilter] = useState(false);
	const [calendarDates, setCalendarDates] = useState([]);
	const [selectedDay, setSelectedDay] = useState(null);
	const [selectedDays, setSelectedDays] = useState(false);
	const [selectedStartDay, setSelectedStartDay] = useState(new Date()); // Selected Start Day
	const [selectedStartTime, setSelectedStartTime] = useState(''); // Selected Start Time
	const [selectedEndDay, setSelectedEndDay] = useState(new Date()); // Selected End Day
	const [selectedEndTime, setSelectedEndTime] = useState(''); // Selected End Time
	const [allValues, setAllValues] = useState({
		//Vod Player Config
		width: '100%',
		height: '100%',
		url: null,
		pip: true,
		controls: false,
		light: false,
		volume: 0.8,
		muted: true,
		playing: false,
		played: 0,
		loaded: 0,
		duration: 0,
		playbackRate: 1.0,
		loop: true,
		seeking: false
	});

	const { data: calendarData, error: calenderErr } = getCameraCalender(
		camera.vxg.allToken
	); //Calender Bounds
	// const { data: cameraRecordingsData, error: cameraRecordingsErr } = getCameraClipsStart({token:camera.vxg.allToken, limit: '12'}) //Recodings or Imagess below
	const { data: cameraRecordingsData, error: cameraRecordingsErr } =
		getCameraImages({
			token: camera.vxg.allToken,
			limit: '12',
			start: moment
				.utc(calendarData?.calender?.objects[0])
				.startOf('day')
				.format(),
			end: moment
				.utc(calendarData?.calender?.objects[0])
				.startOf('day')
				.add(1, 'days')
				.format()
		}); //Images
	const { data: cameraAiData, error: cameraAiErr } = getCameraAiEvents({
		token: camera.vxg.allToken,
		event: 'object_and_scene_detection',
		limit: '12'
	}); //Ai Events
	const { data: cameraMotionData, error: cameraMotionErr } =
		getCameraMotionEvents(camera.vxg.allToken); //Motion Events

	if (calenderErr) return <h1>Calender Err</h1>;
	if (!calendarData) return <h1>Loading...</h1>;
	let calendarBoundStart = moment.utc(calendarData.calender.objects[0]);
	let calendarBoundEnd = moment.utc(calendarData.calender.objects[1]);
	// let calendarBoundStart = moment.utc(calendarData.calender.objects[0]).startOf('day').format()
	// let calendarBoundEnd = moment.utc(calendarData.calender.objects[1]).endOf('day').format()
	// console.log('Cam Recording Data',cameraRecordingsData)
	// console.log('Cam Ai Objects Data',cameraAiData)
	// console.log('Cam Motion Data',cameraMotionData)
	// console.log('current playing:', allValues?.url)

	return (
		<div className="flex py-16 lg:py-24 flex-col items-center justify-center bg-white">
			{/* 1 - Camera VOD Player/Controls */}
			<div className="bg-white">
				{!showLive && (
					<div className="flex flex-row justify-center items-center bg-black">
						<div className="max-w-full w-screen sm:max-w-[768px] lg:max-w-[1000px] xl:max-w-[1100px]  items-start flex justify-start">
							<CamVod
								camera={camera}
								calendarBoundStart={calendarBoundStart}
								// calendarBoundEnd={calendarBoundEnd}
								allValues={allValues}
								setAllValues={setAllValues}
								setSelectedDay={setSelectedDay}
								setSelectedStartDay={setSelectedStartDay}
							/>
						</div>
					</div>
				)}

				{/* 1 - Camera Live Player/Controls */}
				{showLive && (
					<div className="flex flex-row justify-center items-center bg-black">
						<div className="max-w-full w-screen sm:max-w-[768px] lg:max-w-[1000px] xl:max-w-[1100px]  items-start flex justify-start">
							<CamLive
								camera={camera}
								// calendarBoundEnd={calendarBoundEnd}
								setAllValues={setAllValues}
								setSelectedDay={setSelectedDay}
								setSelectedStartDay={setSelectedStartDay}
							/>
						</div>
					</div>
				)}

				{/* 2 -  Time , Clip-Length Switch, Live View Toggle */}
				<div className="md:min-w-[1000px] p-5 bg-gray-600 flex flex-row justify-between items-center text-white px-6 self-center">
					<div className="order-1 flex flex-row items-center">
						<div className="flex flex-col justify-start items-start">
							<div>
								<span className="text-gray-200 font-bold text-md">
									{allValues?.url &&
										dateFormat(
											moment
												.utc(
													allValues?.url?.objects[0]
														?.start
												)
												.tz(camera.timezone),
											'mmm dd, yyyy'
										)}
								</span>
							</div>
							<div>
								<span className="text-xl">
									{moment
										.utc(allValues?.url?.objects[0]?.start)
										.tz(camera.timezone)
										.add(
											new Date(
												allValues.played *
													allValues.duration
											),
											'seconds'
										)
										.format('hh:mm:ss A')}
								</span>
								{/* {new Date(allValues?.url?.objects[0]?.start + allValues.played, "hh:MM")} */}
							</div>
						</div>
						{/* <div>
                            Clip Switcher
                        </div>
                        <div>
                            America/NewYork
                        </div> */}
					</div>
					<div className="order-2">
						<button
							className="px-4 py-2 bg-black  rounded"
							onClick={
								showLive
									? () => setShowLive(false)
									: () => setShowLive(true)
							}
						>
							{showLive ? (
								<span className="inline-flex items-center px-3 py-0.5 rounded text-sm font-lg   text-white uppercase shadow-md">
									Live
									<svg
										className="-mr-1 ml-1.5 h-4 w-4 text-green-400 animate-[pulse_4s_infinite]"
										fill="currentColor"
										viewBox="0 0 8 8"
									>
										<circle cx={4} cy={4} r={3} />
									</svg>
								</span>
							) : (
								'Go Live View'
							)}
						</button>
					</div>
				</div>

				{/* 3- Timeline DVR Calender Bounds */}
				{!showLive && (
					<div className="bg-blue-200 rounded p-1 shadow-2xl mt-2 max-w-[400px]  sm:max-w-full">
						<CamVodDvr
							camera={camera}
							calendarBoundStart={calendarBoundStart}
							calendarBoundEnd={calendarBoundEnd}
							calendarDates={calendarDates}
							setCalendarDates={setCalendarDates}
							allValues={allValues}
							setAllValues={setAllValues}
							selectedDay={selectedDay}
							setSelectedDay={setSelectedDay}
							selectedStartDay={selectedStartDay}
							setSelectedStartDay={setSelectedStartDay}
						/>
					</div>
				)}
			</div>

			{/* 4- Time / Filters */}
			<DvrFilters
				aiFilter={aiFilter}
				setAiFilter={setAiFilter}
				motionFilter={motionFilter}
				setMotionFilter={setMotionFilter}
			/>

			{/*5- Time / Filters */}
			{/* <CameraClipSection cameraMotionData={cameraMotionData} cameraAiData={cameraAiData} cameraRecordingsData={cameraRecordingsData}/> */}
		</div>
	);
}
