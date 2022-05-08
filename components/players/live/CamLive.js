import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import CamLiveControls from './CamLiveControls';
import getCameraWatchUrl from '../../hooks/camera/getCameraWatchUrl';
import { findDOMNode } from 'react-dom';
import { toast } from 'react-toastify';
import CamWebRTC from './CamWebRTC';
import CamHLS from './CamHLS';

export default function CamLive(props) {
	const { index, camera, maxHeight } = props;
	const playerRef = useRef();

	const [isFullScreen, setIsFullScreen] = useState(false);
	const [showHls, setShowHls] = useState(false);
	const [allValues, setAllValues] = useState({
		//Vod Player Config
		width: '100%',
		height: '100%',
		pip: true,
		controls: false,
		volume: 0.8,
		muted: true,
		playing: true,
		playbackRate: 1.0
	});
	/// Media Server

	const { data: camWatchUrls, error: camWatchUrlsError } = getCameraWatchUrl(
		camera.vxg.allToken
	);
	useEffect(() => {
		if (showHls) {
			setAllValues((prevValues) => {
				return { ...prevValues, url: camWatchUrls.watch.hls };
			});
		}
	}, [showHls]);

	const handlePlayPause = () => {
		// Play Pause Toggle
		setAllValues((prevValues) => {
			return { ...prevValues, playing: !allValues.playing };
		});
	};
	const handleToggleMuted = () => {
		setAllValues((prevValues) => {
			return { ...prevValues, muted: !allValues.muted };
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
		<div
			ref={playerRef}
			// onMouseEnter={handleToggleControls}
			//  onMouseLeave={handleToggleControls}
			className={
				isFullScreen
					? 'w-full relative '
					: 'w-full relative  sm:px-[23] lg:px-24 xl:px-28'
			}
		>
			{!showHls && (
				<CamWebRTC camera={camera} isFullScreen={isFullScreen} />
			)}

			{showHls && <CamHLS allValues={allValues} />}

			{!allValues.controls && (
				<div
					className={
						'absolute top-0 left-0 right-0 bottom-0  flex flex-col justify-between z-10'
					}
				>
					<CamLiveControls
						allValues={allValues}
						camera={camera}
						handleClickFullscreen={handleClickFullscreen}
						handleSeekChange={handleSeekChange}
						handleSeekMouseDown={handleSeekMouseDown}
						handleSeekMouseUp={handleSeekMouseUp}
						handlePlayPause={handlePlayPause}
						handleToggleMuted={handleToggleMuted}
						setShowHls={setShowHls}
						showHls={showHls}
					/>
				</div>
			)}
		</div>
	);
}
