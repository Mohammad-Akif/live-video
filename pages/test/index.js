import React from 'react'
import Timeline, {
    TimelineHeaders,
    SidebarHeader,
    DateHeader
  } from 'react-calendar-timeline'
  // make sure you include the timeline stylesheet or the timeline will not be styled
import 'react-calendar-timeline/lib/Timeline.css'
import moment from 'moment-timezone'
import { useState } from 'react'



export default function index() {
    const [showFilters, setShowFilters] = useState(false)
    const [showAi, setShowAi] = useState(false)
    const groups = showAi ? [
        { id: 1, title: 'Recordings' },
         { id: 2, title: 'Ai' },
         { id: 3, title: 'Motion' }
        ] : [
          { id: 1, title: 'Recordings' },
          //  { id: 2, title: 'Ai' },
           { id: 3, title: 'Motion' }
          ]
    
    const items = [
      {
        id: 1,
        group: 1,
        onClick: () => alert('Click'),
        tip: 'additional information',
        title: 'Person detected',
        start_time: moment(),
        end_time: moment().add(1, 'hour')
      },
      showAi &&  {
        id: 2,
        group: 2,
        title: 'Person Detected',
        start_time: moment().add(-0.5, 'hour'),
        end_time: moment().add(0.5, 'hour')
      },
      {
        id: 3,
        group: 3,
        title: 'Motion Event',
        start_time: moment().add(-0.5, 'hour'),
        end_time: moment().add(0.5, 'hour')
      },
      showAi &&  {
        id: 4,
        group: 2,
        title: 'Car Detected',
        start_time: moment().add(2, 'hour'),
        end_time: moment().add(3, 'hour')
      }
    ]

    
  return (
    <>
    <div> 
        <Timeline
          groups={groups}
          items={items}
          defaultTimeStart={moment().add(-12, 'hour')}
          defaultTimeEnd={moment().add(12, 'hour')}
          sidebarWidth={true ? 0  : 100}
          itemTouchSendsClick={true}
          stackItems
          itemHeightRatio={0.75}
          showCursorLine
          canMove={false}
          canResize={false}
        />
        </div>
        <button onClick={() => setShowAi(!showAi)}>Toggle Ai</button>
  </>
  )
}
// shift + mousewheel = move timeline left/right
// alt + mousewheel = zoom in/out
// ctrl + mousewheel = zoom in/out 10× faster
// meta + mousewheel = zoom in/out 3x faster (win or cmd + mousewheel)