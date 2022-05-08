import React from 'react'
import FilterToggle from '../../buttons/FilterToggle';

export default function DvrFilters(props) {
    const {aiFilter, setAiFilter, motionFilter, setMotionFilter} = props;
  return (
    <div className='flex flex-row p-1 items-center'>
        <div className='mt-2 mx-2 flex items-center'>
            <FilterToggle enabled={motionFilter} setEnabled={setMotionFilter} activeColor={'motion'}/>
            <span className='px-1 font-bold text-lg ml-2'>
                Filter Motion Events
                </span>
        </div>
        <div className='mt-2 mx-2 flex items-center'>
            <FilterToggle enabled={aiFilter} setEnabled={setAiFilter} activeColor={'ai'}/> 
            <span className='px-1 font-bold text-lg ml-2'>
                Filter Ai Events
            </span>
        </div>
    </div>

  )
}
