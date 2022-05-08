import React from 'react';
import ReactPlayer from 'react-player';
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import getCameraClips from '../../hooks/camera/getCameraClips';
import CamVodControls from './CamVodControls';
import { findDOMNode } from 'react-dom';
import { toast } from 'react-toastify';
import moment from 'moment-timezone';
import dateFormat from 'dateformat';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

export default function CamVod(props) {
	const {
		camera,
		calendarBoundStart,
		allValues,
		setAllValues,
		setSelectedDay,
		setSelectedStartDay
	} = props;
	const playerRef = useRef();
	const videoRef = useRef();
	const [isFullScreen, setIsFullScreen] = useState(false);
	const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
	const [isReady, setIsReady] = useState(false);

	// const { response, error, loading: loadingStartClip} = getCameraClips({token: camera.vxg.allToken, start: moment(calendarBoundStart).startOf('day').format()}) // Fetch Start On Load
	const {
		response,
		error,
		loading: loadingStartClip
	} = getCameraClips({
		token: camera.vxg.allToken,
		start: moment(Date.now()).subtract(0.25, 'hours')
	}); // Fetch Start On Load

	useEffect(() => {
		if (!loadingStartClip && response.success) {
			console.log('Fetched Cam Clips 🎉 ');
			setSelectedStartDay(
				dateFormat(
					moment
						.utc(response.clips.objects[0].start)
						.tz(camera.timezone)
						.format(),
					'yyyy-mm-dd'
				)
			); //Set Selected Start
			setAllValues((prevValues) => {
				return { ...prevValues, url: response.clips };
			});
			setAllValues((prevValues) => {
				return { ...prevValues, playing: true };
			});
		}
	}, [loadingStartClip]);

	///////////////////////////// Video Player Callbacks //////////////////////

	const handleProgress = (state) => {
		// Video Progress
		// console.log(state)
		// We only want to update time slider if we are not currently seeking
		if (!allValues.seeking) {
			setAllValues((prevValues) => {
				return { ...prevValues, played: state.played };
			});
		}
	};
	const handleDuration = (duration) => {
		//Video Duration
		console.log('onDuration', duration);
		// setClipDuration(duration)
		setAllValues((prevValues) => {
			return { ...prevValues, duration: duration };
		});
	};
	const handleEnded = () => {
		console.log('vid-src ended');
		document.exitFullscreen();
	};

	const handlePlayPause = () => {
		// Play Pause Toggle
		setAllValues((prevValues) => {
			return { ...prevValues, playing: !allValues.playing };
		});
	};

	const handleStop = () => {
		//Stop Video
		setUrl(null);
		setAllValues((prevValues) => {
			return { ...prevValues, url: null };
		});
		setAllValues((prevValues) => {
			return { ...prevValues, playing: false };
		});
	};

	const handleToggleControls = () => {
		const url = allValues.url;
		setAllValues((prevValues) => {
			return { ...prevValues, controls: !allValues.controls };
		});

		// setAllValues( prevValues => {
		//   return { ...prevValues, url: null}
		// }).then(() => load(url));
	};
	const load = (url) => {
		setAllValues((prevValues) => {
			return { ...prevValues, url: url };
		});
		setAllValues((prevValues) => {
			return { ...prevValues, played: 0 };
		});
		setAllValues((prevValues) => {
			return { ...prevValues, loaded: 0 };
		});
		setAllValues((prevValues) => {
			return { ...prevValues, pip: false };
		});
	};

	const handleToggleLight = () => {
		setAllValues((prevValues) => {
			return { ...prevValues, light: !allValues.light };
		});
	};

	const handleToggleLoop = () => {
		setAllValues((prevValues) => {
			return { ...prevValues, loop: !allValues.loop };
		});
	};

	const handleVolumeChange = (e) => {
		setAllValues((prevValues) => {
			return { ...prevValues, volume: parseFloat(e.target.value) };
		});
	};

	const handleToggleMuted = () => {
		setAllValues((prevValues) => {
			return { ...prevValues, muted: !allValues.muted };
		});
	};

	const handlePlay = () => {
		console.log('onPlay');
		setAllValues((prevValues) => {
			return { ...prevValues, playing: true };
		});
	};

	const handlePause = () => {
		console.log('onPause');
		setAllValues((prevValues) => {
			return { ...prevValues, playing: false };
		});
	};
	const fastForward = () => {
		let fromNow = videoRef.current.getCurrentTime() + 5;
		videoRef.current.seekTo(fromNow);
		console.log('FFoward 🎉 ');
	};

	const revert = () => {
		let fromNow = videoRef.current.getCurrentTime() - 5;
		videoRef.current.seekTo(fromNow);
		console.log('REWIND 🎉 ');
	};

	const handleSetPlaybackRate = (e) => {
		console.log(e.target.value);
		setAllValues((prevValues) => {
			return { ...prevValues, playbackRate: parseFloat(e.target.value) };
		});
	};

	const handleOnPlaybackRateChange = (speed) => {
		setAllValues((prevValues) => {
			return { ...prevValues, playbackRate: parseFloat(speed) };
		});
	};

	function IsFullScreen() {
		return !!(
			document.fullscreenElement ||
			document.mozFullScreenElement ||
			document.webkitFullscreenElement ||
			document.msFullscreenElement
		);
	}

	const handleClickFullscreen = () => {
		if (IsFullScreen() === false) {
			findDOMNode(playerRef.current)
				.requestFullscreen()
				.catch((err) => {
					toast.error('Could not activate full-screen mode ');
				});

			setIsFullScreen(true);
		} else {
			// console.log(IsFullScreen())
			document?.exitFullscreen();
			setIsFullScreen(false);
		}
	};

	const handleTogglePIP = () => {
		setAllValues((prevValues) => {
			return { ...prevValues, pip: !allValues.pip };
		});
	};

	const handleEnablePIP = () => {
		console.log('onEnablePIP');
		setAllValues((prevValues) => {
			return { ...prevValues, pip: true };
		});
	};

	const handleDisablePIP = () => {
		console.log('onDisablePIP');
		setAllValues((prevValues) => {
			return { ...prevValues, pip: false };
		});
	};

	const handleSeekMouseDown = (e) => {
		setAllValues((prevValues) => {
			return { ...prevValues, seeking: true };
		});
	};

	const handleSeekChange = (e) => {
		setAllValues((prevValues) => {
			return { ...prevValues, played: parseFloat(e.target.value) };
		});
	};

	const handleSeekMouseUp = (e) => {
		setAllValues((prevValues) => {
			return { ...prevValues, seeking: false };
		});
		videoRef.current.seekTo(parseFloat(e.target.value));
	};

	return (
		<div className="w-full">
			<TransformWrapper
				initialScale={1}
				className="w-full"
				// initialPositionX={200}
				// initialPositionY={20}
			>
				{({ zoomIn, zoomOut, resetTransform, ...rest }) => (
					<React.Fragment>
						<div
							ref={playerRef}
							// onMouseEnter={handleToggleControls}
							//  onMouseLeave={handleToggleControls}
							className={
								isFullScreen
									? 'relative min-h-[211px] md:min-h-[454px] bg-black w-full'
									: 'relative min-h-[211px] md:min-h-[454px] bg-black w-full sm:px-[23] lg:px-24 xl:px-28'
							}
						>
							{!isReady && (
								<div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] transform">
									<div class="w-12 h-12 rounded-full animate-spin border-8 border-dashed border-purple-500 border-t-transparent" />
								</div>
							)}

							<TransformComponent className="w-full relative h-full">
								<ReactPlayer
									width="100%"
									height="100%"
									ref={(video) => (videoRef.current = video)}
									playsinline={true}
									playing={allValues.playing}
									// url={selectedDay === null ? watch.hls+'.m3u8' : vidSrcArr}
									url={allValues.url?.objects[0]?.url}
									pip={allValues.pip}
									// controls={allValues.controls}
									controls={false}
									light={allValues.light}
									loop={allValues.loop}
									playbackRate={allValues.playbackRate}
									volume={allValues.volume}
									muted={allValues.muted}
									onBuffer={() => {
										console.log('Buffering');
									}}
									onBufferEnd={() => {
										console.log('Buffering Ended');
									}}
									onError={(e) => {
										console.log('error', e);
									}}
									onProgress={handleProgress}
									onDuration={handleDuration}
									onEnded={handleEnded}
									onPlaybackRateChange={
										handleOnPlaybackRateChange
									}
									onSeek={(e) => console.log('onSeek', e)}
									onReady={() => {
										setIsReady(true);
									}}
									onStart={() => console.log('onStart')}
									onPlay={handlePlay}
									onPause={handlePause}
									config={{
										file: {
											attributes: {
												//Allows screenshot
												crossOrigin: 'anonymous'
											}
										}
									}}
								/>
							</TransformComponent>

							{!allValues.controls && (
								<div
									className={
										'absolute top-0 left-0 right-0 bottom-0 w-full  flex flex-col justify-between z-10'
									}
								>
									<CamVodControls
										allValues={allValues}
										camera={camera}
										handleSetPlaybackRate={
											handleSetPlaybackRate
										}
										handleClickFullscreen={
											handleClickFullscreen
										}
										handleSeekChange={handleSeekChange}
										handleSeekMouseDown={
											handleSeekMouseDown
										}
										handleSeekMouseUp={handleSeekMouseUp}
										handlePlayPause={handlePlayPause}
										handleToggleMuted={handleToggleMuted}
										fastForward={fastForward}
										revert={revert}
										zoomIn={zoomIn}
										zoomOut={zoomOut}
										resetZoom={resetTransform}
									/>
								</div>
							)}
						</div>
					</React.Fragment>
				)}
			</TransformWrapper>

			{/* <div className="w-full "> 
              <input
                  className='w-full range-min  cursor-pointer   text-black '
                  type='range' min={0} max={0.999999} step='any' 
                  value={allValues.played}
                  onMouseDown={handleSeekMouseDown}
                  onChange={handleSeekChange}
                  onMouseUp={handleSeekMouseUp}
              />
        </div> */}
		</div>
	);
}
