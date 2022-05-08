import React from 'react'
import { HiSearch} from 'react-icons/hi';

export default function CameraClipSection(props) {
    const { cameraAiData, cameraMotionData, cameraRecordingsData } = props;
  return (
      <div className='flex flex-col items-start '>
        <div className='flex flex-row items-center font-bold'>
            <HiSearch size={28} /> 
            <span className='font-bold text-2xl  lg:text-3xl ml-4 mt-2 ' >Segment Search</span>
        </div>
        <div className='flex flex-col mt-8'>
        <span className='w-full text-center  text-2xl'>Recordings</span>
            <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 '>
                { cameraRecordingsData?.clips?.objects?.map((object,idx) =>
                            <div key={idx} className="cursor-pointer">
                                <img src={object?.url}  width="200px" className="rounded-lg w-[200px]" controls playsInline/>
                            </div>
                        )}
            </div>
        </div>

        { cameraAiData?.events?.objects?.length > 0 &&  <div className='flex flex-col mt-12'>
            <span className='w-full text-center  text-2xl'>Ai Events</span>
            <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 '>
                { cameraAiData?.events?.objects?.map((event,idx) =>
                            <div key={idx}>
                                <img src={event?.thumb?.url}  width="200px" className="rounded-lg w-[200px]"/>
                            </div>
                        )}
            </div>
        </div>
        }

       { cameraMotionData?.events?.objects?.length > 0 &&  <div className='flex flex-col mt-12'>
            <span>Motion Events</span>
            <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 '>
                { cameraMotionData?.events?.objects?.map((event,idx) =>
                            <div key={idx}>
                                <img src={event?.thumb?.url}  width="200px" className="rounded-lg w-[200px]"/>
                            </div>
                        )}
            </div>
        </div>}
        

    </div>
  )
}
