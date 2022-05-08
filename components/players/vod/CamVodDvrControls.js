import moment from "moment-timezone";
import { useContext, useEffect, useState } from "react";
import { VisibilityContext, getItemsPos } from "react-horizontal-scrolling-menu";
import { AiOutlineLeft, AiOutlineDoubleLeft, AiOutlineRight, AiOutlineDoubleRight } from 'react-icons/ai'
import getCameraClipsStartOnly from "../../hooks/camera/getCamClipsStartOnly";
import dateFormat from "dateformat";

export function LeftArrow(props) {
    const { camera, calendarDates, setAllValues, allValues,  selectedStartDay, setSelectedStartDay, setCurrentInterval  } = props;
    const { isFirstItemVisible ,scrollNext, scrollPrev,scrollToItem,visibleItems, getItemById } = useContext(VisibilityContext);
    const { center: centerItemKey } = getItemsPos(visibleItems); //Scroll to center Item on Init
    const [pushPrevious, setPushPrevious] = useState(false)

    const minusHour = () => {
        if(isFirstItemVisible && (new Date (calendarDates[0]) < new Date(selectedStartDay))){
            return setPushPrevious(true)
        }
        const timearray = centerItemKey.split(":");
        const hour = timearray[0];
        const minute = timearray[1];
        // console.log(centerItemKey , hour, minute)
        scrollToItem(getItemById((Number(hour) - 1).toString().padStart(2, '0') +':'+ minute), "auto", "center")
    }

    //Fetch Yesterday clips
    const yesterday = moment(allValues.url?.objects[0]?.start).tz(camera.timezone).subtract(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss')
    const { data: resData, error:clipUpdateErr } = getCameraClipsStartOnly({fetchGrant: true,  token: camera.vxg.allToken, limit:3, start: moment(yesterday).tz(camera.timezone).utc().format() })
    // console.log('new clips arr',resData, clipUpdateErr)
    useEffect(() => {
        if(resData && pushPrevious){
            console.log('Set previous day 🎉 ')
            setPushPrevious(false)
            setSelectedStartDay(dateFormat(yesterday,"yyyy-mm-dd")) // Set for DVR Click
            scrollToItem(getItemById("00:00"), "auto", "center");
            setAllValues( prevValues => {
                return { ...prevValues, url: resData.clips }
            })
        
        }
   }, [resData,pushPrevious])
    return (
       <div className="flex flex-col min-w-[4rem] divide-y-2 text-gray-600 text-lg items-center p-[0.5rem]">
           {/* <button disabled={isFirstItemVisible} className="cursor-pointer hover:text-blue-700  bg-gray-200 hover:bg-gray-300 shadow-lg flex flex-row  justify-evenly items-center min-w-[2rem]" onClick={() => scrollPrev()}>
               <AiOutlineLeft  />   
               <span>- Min</span>
           </button> */}
           <button className="cursor-pointer hover:text-blue-700 bg-gray-200 hover:bg-gray-300 shadow-lg flex flex-row  justify-evenly  items-center min-w-[2rem]" onClick={() => minusHour()}>
              <AiOutlineDoubleLeft />
               <span>-1 H</span>
           </button>
       </div>
    );
  }
  
export function RightArrow(props) {
    const { camera, calendarDates, setAllValues, allValues, selectedStartDay, setSelectedStartDay, setCurrentInterval } = props;
    const { isLastItemVisible, scrollNext, scrollPrev,scrollToItem,visibleItems, getItemById } = useContext(VisibilityContext);
    const { center: centerItemKey } = getItemsPos(visibleItems); //Scroll to center Item on Init
    const [pushNext, setPushNext] = useState(false)
    // console.log(isLastItemVisible) 
    const addHour = () => {
       if(isLastItemVisible){
           return setPushNext(true)
       }
       const timearray = centerItemKey.split(":");
       const hour = timearray[0];
       const minute = timearray[1];
       // console.log(centerItemKey , hour, minute)
       scrollToItem(getItemById((Number(hour) + 1).toString().padStart(2, '0') +':'+ minute), "auto", "center")
   }
   
        //Fetch Tomorows clips
        const tomorrow = moment(allValues.url?.objects[0]?.start).tz(camera.timezone).startOf('day').add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
        const { data: resData, error:clipUpdateErr } = getCameraClipsStartOnly({fetchGrant: true,  token: camera.vxg.allToken, limit:3, start: moment(tomorrow).tz(camera.timezone).utc().format() })
        console.log(moment(allValues.url?.objects[0]?.start).tz(camera.timezone).startOf('day').format('YYYY-MM-DD HH:mm:ss'))
        useEffect(() => {
            if(resData && pushNext){
                console.log('Set next day 🎉 ')
                setPushNext(false)
                setSelectedStartDay(dateFormat(tomorrow,"yyyy-mm-dd")) // Format for DVR Click
                scrollToItem(getItemById("00:00"), "auto", "center");
                setAllValues( prevValues => {
                    return { ...prevValues, url: resData.clips }
                })
            
            }
       }, [resData,pushNext])
   
   
   return (
    <div className="flex flex-col min-w-[4rem] divide-y-2 text-gray-600 text-lg items-center p-[0.5rem]">
       {/* <button disabled={isLastItemVisible} className="cursor-pointer hover:text-blue-700 bg-gray-200 hover:bg-gray-300 shadow-lg  flex flex-row justify-evenly  items-center min-w-[2rem]" onClick={() => scrollNext()}>
           <span>+ Min</span>
           <AiOutlineRight  />

       </button> */}
       <button 
       onClick={() => addHour()} 
       className="cursor-pointer hover:text-blue-700 bg-gray-200 hover:bg-gray-300 shadow-lg  flex flex-row justify-evenly  items-center min-w-[2rem]" >
           <span>+1 H </span>
           <AiOutlineDoubleRight  />
 
       </button>
   </div>
);
}

