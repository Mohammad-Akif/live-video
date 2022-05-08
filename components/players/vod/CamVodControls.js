import React, { useState, createRef } from 'react';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { MdVolumeOff, MdVolumeUp } from 'react-icons/md';
import { IconContext } from 'react-icons';
import {
	BsFillGearFill,
	BsFillPlayFill,
	BsPauseFill,
	BsZoomIn,
	BsZoomOut
} from 'react-icons/bs';
import { AiOutlineClose, AiFillBackward, AiFillForward } from 'react-icons/ai';
import { RiFullscreenLine } from 'react-icons/ri';
import { FiShare } from 'react-icons/fi';
import dateFormat from 'dateformat';
import axios from 'axios';
import fileDownload from 'js-file-download';
import ShareVodClipModal from '../../ui/modal/ShareVodClipModal';
import ArchiveVodClipModal from '../../ui/modal/ArchiveVodClipModal';

function classNames(...classes) {
	return classes.filter(Boolean).join(' ');
}
export default function CamVodControls(props) {
	const {
		allValues,
		camera,
		handleSetPlaybackRate,
		handleClickFullscreen,
		handleSeekChange,
		handleSeekMouseDown,
		handleSeekMouseUp,
		handlePlayPause,
		handleToggleMuted,
		fastForward,
		revert,
		zoomIn,
		zoomOut,
		resetZoom
	} = props;
	const [popoverShow, setPopoverShow] = useState(false);
	const [showArchiveModal, setShowArchiveModal] = useState(false);
	const [showShareModal, setShowShareModal] = useState(false);
	const btnRef = createRef();
	const popoverRef = createRef();

	const handleShowShareModal = () => {
		console.log('Show Share Modal');
		setShowShareModal(true);
	};
	const handleShowAddArchiveModal = () => {
		console.log('Show Archive Modal');
		setShowArchiveModal(true);
	};
	const handleDownload = (url, filename) => {
		axios
			.get(url, {
				responseType: 'blob'
			})
			.then((res) => {
				fileDownload(res.data, filename);
			});
	};
	return (
		<>
			<ShareVodClipModal
				open={showShareModal}
				setOpen={setShowShareModal}
				camera={camera}
			/>
			<ArchiveVodClipModal
				open={showArchiveModal}
				setOpen={setShowArchiveModal}
				camera={camera}
			/>
			{/* Top controls */}
			<div className="p-1 flex flex-row justify-between items-center ">
				<div>
					{/* <span  className='text-white text-xl' >
            Video Title
            </span> */}
				</div>

				<div>
					<Menu as="div" className="relative inline-block text-left">
						<div>
							<Menu.Button className="inline-flex justify-center w-full rounded-m shadow-sm   text-lg font-medium text-white">
								<FiShare size={22} />
							</Menu.Button>
						</div>

						<Transition
							as={Fragment}
							enter="transition ease-out duration-100"
							enterFrom="transform opacity-0 scale-95"
							enterTo="transform opacity-100 scale-100"
							leave="transition ease-in duration-75"
							leaveFrom="transform opacity-100 scale-100"
							leaveTo="transform opacity-0 scale-95"
						>
							<Menu.Items className="origin-bottom-right absolute top-2 right-4 mt-2 w-56 rounded-md shadow-lg bg-white  focus:outline-none">
								<div className=" px-1">
									<Menu.Item>
										{({ active }) => (
											<button
												href="#"
												onClick={() =>
													handleShowShareModal()
												}
												className={classNames(
													active
														? 'bg-gray-100 text-gray-900'
														: 'text-gray-700',
													'block px-4 py-2 text-md w-full'
												)}
											>
												Share
											</button>
										)}
									</Menu.Item>
									<Menu.Item>
										{({ active }) => (
											<button
												href="#"
												onClick={() =>
													handleShowAddArchiveModal()
												}
												className={classNames(
													active
														? 'bg-gray-100 text-gray-900'
														: 'text-gray-700',
													'block px-4 py-2 text-md w-full'
												)}
											>
												Archive Clip
											</button>
										)}
									</Menu.Item>
									<Menu.Item>
										{({ active }) => (
											// <button
											//     onClick={() => handleDownload(allValues.url?.objects[0]?.url, camera?.name+'-'+dateFormat(new Date(allValues.url?.objects[0]?.start + 'z'), "dd_mm_yyyy"+'.mp4') )}
											//     className={classNames(
											//         active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
											//         'block px-4 py-2 text-md w-full'
											//     )}
											// >
											//  Download
											// </button>
											<a
												href={
													allValues.url?.objects[0]
														?.url
												}
												target="_blank"
												rel="noopener noreferrer"
												download
											>
												<button
													className={classNames(
														active
															? 'bg-gray-100 text-gray-900'
															: 'text-gray-700',
														'block px-4 py-2 text-md w-full'
													)}
												>
													Download
												</button>
											</a>
										)}
									</Menu.Item>
								</div>
							</Menu.Items>
						</Transition>
					</Menu>
				</div>
			</div>

			{/* middle controls */}

			{/* <div container direaction="row" alignItems="center" justify="center">
        <IconContext.Provider value={{ color: "white", className: "text-[#777] text-xl hover:animate-[pulse_1s]" }}  >
                <div  onClick={() => revert()} >
                    <AiFillBackward  size={18}   />
                </div>
            </IconContext.Provider>
           
            <IconContext.Provider value={{ color: "white", className: "text-[#777] text-xl hover:animate-[pulse_1s]" }}  >
                <div  onClick={() => fastForward()} >
                    <AiFillForward size={18}   />
                </div>
            </IconContext.Provider>

            
        </div> */}

			{/* bottom controls */}
			<div className="flex flex-col justify-between items-center w-full bg-[rgb(0,0,0,0.6)]">
				<div className="w-full">
					<input
						className="w-full range-min  cursor-pointer text-black "
						type="range"
						min={0}
						max={0.999999}
						step="any"
						value={allValues.played}
						onMouseDown={handleSeekMouseDown}
						onChange={handleSeekChange}
						onMouseUp={handleSeekMouseUp}
					/>
				</div>

				<div className=" flex flex-row justify-between items-center w-full ">
					<div className="items-center flex flex-row">
						<div className="order-1 mx-2 flex flex-row justify-between">
							<IconContext.Provider
								value={{
									color: 'white',
									className: 'global-classname'
								}}
							>
								<div
									className=" cursor-pointer  p-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
									type="button"
									onClick={() => revert()}
								>
									<AiFillBackward size={22} />
								</div>
							</IconContext.Provider>
							<IconContext.Provider
								value={{
									color: 'white',
									className: 'global-classname'
								}}
							>
								<div
									className=" cursor-pointer  p-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
									type="button"
									onClick={() => handlePlayPause()}
								>
									{allValues.playing ? (
										<BsPauseFill size={22} />
									) : (
										<BsFillPlayFill size={22} />
									)}
								</div>
							</IconContext.Provider>
							<IconContext.Provider
								value={{
									color: 'white',
									className: 'global-classname'
								}}
							>
								<div
									className=" cursor-pointer  p-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
									type="button"
									onClick={() => fastForward()}
								>
									<AiFillForward size={22} />
								</div>
							</IconContext.Provider>
						</div>

						<div className="hidden sm:inline order-2 mx-2 text-white">
							{new Date(
								allValues.played * allValues.duration * 1000
							)
								.toISOString()
								.slice(14, 19)}{' '}
							:{' '}
							{new Date(allValues.duration * 1000)
								.toISOString()
								.slice(14, 19)}
						</div>
						<div className="flex flex-col items-center divide-y-2 sm:hidden order-2 mx-2 text-white">
							<p>
								{' '}
								{new Date(
									allValues.played * allValues.duration * 1000
								)
									.toISOString()
									.slice(14, 19)}{' '}
							</p>
							<p>
								{new Date(allValues.duration * 1000)
									.toISOString()
									.slice(14, 19)}
							</p>
						</div>
					</div>

					<div className=" items-center">
						<div className="flex flex-row justify-between">
							<div className="order-1 mx-2">
								<Menu
									as="div"
									className="relative inline-block text-left"
								>
									<div>
										<Menu.Button className="inline-flex justify-center w-full rounded-m shadow-sm   text-lg font-medium text-white">
											{allValues.playbackRate} x
											{/* <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" /> */}
										</Menu.Button>
									</div>

									<Transition
										as={Fragment}
										enter="transition ease-out duration-100"
										enterFrom="transform opacity-0 scale-95"
										enterTo="transform opacity-100 scale-100"
										leave="transition ease-in duration-75"
										leaveFrom="transform opacity-100 scale-100"
										leaveTo="transform opacity-0 scale-95"
									>
										<Menu.Items className="origin-bottom-right absolute bottom-2 right-4 mt-2 w-28 rounded-md shadow-lg bg-white  focus:outline-none">
											<div className="">
												{[0.5, 1, 1.5, 2].map(
													(rate, idx) => (
														<Menu.Item key={idx}>
															{({ active }) => (
																<button
																	href="#"
																	value={rate}
																	onClick={(
																		e
																	) =>
																		handleSetPlaybackRate(
																			e
																		)
																	}
																	className={classNames(
																		active
																			? 'bg-gray-100 text-gray-900'
																			: 'text-gray-700',
																		'block px-4 py-2 text-md w-full'
																	)}
																>
																	{rate}x
																</button>
															)}
														</Menu.Item>
													)
												)}
											</div>
										</Menu.Items>
									</Transition>
								</Menu>
							</div>
							<div className="order-2 mx-2">
								<IconContext.Provider
									value={{
										color: 'white',
										className: 'global-classname'
									}}
								>
									<div
										className=" cursor-pointer  p-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
										type="button"
										onClick={() => handleToggleMuted()}
									>
										{allValues.muted ? (
											<MdVolumeOff size={22} />
										) : (
											<MdVolumeUp size={22} />
										)}
									</div>
								</IconContext.Provider>
							</div>
							<div className="order-3 mx-2">
								<IconContext.Provider
									value={{
										color: 'white',
										className: 'global-classname'
									}}
								>
									<div
										className=" cursor-pointer  p-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
										type="button"
										onClick={() => handleClickFullscreen()}
									>
										<RiFullscreenLine size={22} />
									</div>
								</IconContext.Provider>
							</div>
							<div className="order-4 mx-2">
								<Menu
									as="div"
									className="relative inline-block text-left "
								>
									<div>
										<Menu.Button className="inline-flex items-center justify-center  w-full rounded-m shadow-sm   text-lg font-medium text-white">
											<BsZoomIn size={18} />
										</Menu.Button>
									</div>

									<Transition
										as={Fragment}
										enter="transition ease-out duration-100"
										enterFrom="transform opacity-0 scale-95"
										enterTo="transform opacity-100 scale-100"
										leave="transition ease-in duration-75"
										leaveFrom="transform opacity-100 scale-100"
										leaveTo="transform opacity-0 scale-95"
									>
										<Menu.Items className="origin-bottom-right absolute bottom-2 right-4 mt-2 w-28 rounded-md shadow-lg bg-white  focus:outline-none">
											<div className="">
												<div className="order-1 mx-2">
													<div
														className=" cursor-pointer flex flex-row items-center justify-center  p-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
														type="button"
														onClick={() => zoomIn()}
													>
														<BsZoomIn size={22} />
													</div>
												</div>
												<div className="order-2 mx-2">
													<div
														className=" cursor-pointer flex flex-row items-center justify-center  p-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
														type="button"
														onClick={() =>
															zoomOut()
														}
													>
														<BsZoomOut size={22} />
													</div>
												</div>
											</div>
										</Menu.Items>
									</Transition>
								</Menu>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

// OLD METHOD
{
	/* <div className='flex flex-row justify-between w-full'>
                    <div className='flex items-center order-1 px-4 '>
                        <div className='order-1 mx-2' >
                            <IconContext.Provider value={{ color: "white", className: "global-classname" }}  >
                                <div   
                                    className=" cursor-pointer  p-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"
                                    onClick={() => handlePlayPause()}
                                    >
                                    {allValues.playing ? <BsPauseFill size={22} /> :  <BsFillPlayFill size={22} />}
                                </div>
                            </IconContext.Provider>
                        </div>
                        <div  className='order-2 mx-2'>
                            <IconContext.Provider value={{ color: "white", className: "global-classname" }}  >
                                <div   
                                    className=" cursor-pointer  p-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"
                                    onClick={() => handleToggleMuted()}
                                    >
                                    {allValues.muted ? <MdVolumeOff size={22} />: <MdVolumeUp size={22} />}
                                </div>
                            </IconContext.Provider>
                        </div>
                    </div>
                    <div  className='order-3 items-center'>    
                            <div className="">
                                <IconContext.Provider value={{ color: "white", className: "global-classname" }}  >
                                <div   
                                    className=" cursor-pointer  p-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"
                                    onClick={ popoverShow ? closeTooltip : openTooltip}
                                    ref={btnRef}>
                                    <BsFillGearFill  size={22}   />
                                </div>
                                </IconContext.Provider>
                            </div>

                        
                            <div
                                // onMouseLeave={closeTooltip}
                                onMouseEnter={openTooltip}
                                className={
                                (popoverShow ? "" : "hidden ") +
                                "bg-blue-600 border-0 mr-3 block z-50 font-normal leading-normal text-sm max-w-xs text-left no-underline break-words rounded-lg"
                                }
                                ref={popoverRef}
                            >
                                <div>
                                    <div
                                        className="bg-blue-600 flex flex-row justify-between text-white opacity-75 font-semibold p-3 mb-0 border-b border-solid border-blue-400 uppercase rounded-t-lg"
                                    >
                                        <span>Playback Settings</span> 
                                        <IconContext.Provider value={{ color: "white", className: "cursor-pointer" }}  >
                                            <div onClick={closeTooltip} >
                                                <AiOutlineClose  size={18}   />
                                            </div>
                                        </IconContext.Provider>
                                    </div>
                                    <div className="text-black p-3 bg-gray-200">
                                        And here's some amazing content. It's very engaging. Right?
                                    </div>
                                </div>
                            </div>
                    </div>
                
        </div> */
}
