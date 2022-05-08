import React from 'react'
import { useContext } from "react";
import { VisibilityContext, getItemsPos } from "react-horizontal-scrolling-menu";
import dateFormat from 'dateformat';
import moment from 'moment-timezone';
export default function CamVodDvrInterval(props) {
    const { idx,timezone,earlyBound, endBound,calendarDates, interval, onClick, selectedInterval,setSelectedInterval, allValues } = props;
    const visibility = useContext(VisibilityContext);
    const { getItemById,  scrollToItem } = useContext(VisibilityContext);
   
    let tenMinMarker =  idx % 2 === 0 && idx % 10 === 0 
    let fiveMinMarker =  idx % 2 !== 0 && idx % 5 === 0
    let currentPlayingMarker = moment.utc(allValues.url?.objects[0]?.start).tz(timezone).format("HH:mm")
  
    // console.log(calendarDates)
    let intervalWidth =`16px` //16px or less to adjust timeline
    // console.log(earlyBound,endBound)
  return (
    <div className={ interval === currentPlayingMarker ?'bg-green-400 shadow-lg h-full cursor-pointer flex flex-col items-center max-w-[16px]' : 'cursor-pointer flex flex-col items-center max-w-[16px]'} onClick={() => onClick(visibility)}>
      <div   className={ interval === currentPlayingMarker ?'bg-green-400 w-4 h-[12px]' : 'bg-gray-200 w-4 h-[12px]'}/>
        <div className='flex flex-row justify-start items-end'>
          <div className={tenMinMarker ? 'mt-4 text-black font-extrabold' : fiveMinMarker=== 0 ? 'mt-4 text-blue-300' : 'mt-4 text-gray-300'}>
                {tenMinMarker ?(
                    <div className='flex flex-col items-center mx-1'>
                        <div className={'h-[32px] w-[4px] bg-gray-300'}/>
                        <span className=''>{interval}</span> 
                    </div>
                    ): fiveMinMarker ? ( <div className='h-[22px] w-[4px] bg-gray-300 mx-1'/>) :<div className='h-[12px] w-[4px] mx-1 bg-gray-800'/>}
            </div>
      </div>
    </div>
  )
}
