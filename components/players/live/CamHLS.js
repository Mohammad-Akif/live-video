import React, { useState } from 'react';
import ReactPlayer from 'react-player';

export default function CamHLS(props) {
	const { allValues } = props;
	const [isReady, setIsReady] = useState(false);

	return (
		<div className="relative min-h-[211px] md:min-h-[454px] bg-black w-full">
			{!isReady && (
				<div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] transform">
					<div class="w-12 h-12 rounded-full animate-spin border-8 border-dashed border-purple-500 border-t-transparent" />
				</div>
			)}
			<ReactPlayer
				width={allValues.width}
				height={allValues.height}
				// ref={ (video) => videoRef.current = video}
				playsinline={true}
				playing={allValues.playing}
				// url={selectedDay === null ? watch.hls+'.m3u8' : vidSrcArr}
				url={allValues.url}
				pip={allValues.pip}
				onReady={() => {
					setIsReady(true);
				}}
				onBuffer={() => setIsReady(false)}
				onBufferEnd={() => setIsReady(true)}
				// controls={allValues.controls}
				controls={false}
			/>
		</div>
	);
}
