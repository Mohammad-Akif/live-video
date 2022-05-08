import useSWR from 'swr'

import fetch from '../fetch'

export default function getCameraMotionEvents(token) {
  return useSWR(`/api/cameras/ai/filter?token=${token}&event=motion`, fetch)
}

