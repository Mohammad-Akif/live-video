import { useState } from 'react'
import { Switch } from '@headlessui/react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function FilterToggle(props) {
const { enabled, setEnabled, activeColor } = props;
  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className="flex-shrink-0 shadow-xl group relative rounded-full inline-flex items-center justify-center h-5 w-10 cursor-pointer  "
    >
      <span aria-hidden="true" className="pointer-events-none absolute bg-white w-full h-full rounded-md" />
      <span
        aria-hidden="true"
        className={classNames(
          enabled && activeColor === 'ai' ? `bg-fuchsia-500 ` :   enabled && activeColor === 'motion' ? 'bg-blue-500' :'bg-gray-200',
          'pointer-events-none absolute h-4 w-9 mx-auto rounded-full transition-colors ease-in-out duration-200'
        )}
      />
      <span
        aria-hidden="true"
        className={classNames(
          enabled ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none absolute left-0 inline-block h-5 w-5 border border-gray-200 rounded-full bg-white shadow transform ring-0 transition-transform ease-in-out duration-200'
        )}
      />
    </Switch>
  )
}