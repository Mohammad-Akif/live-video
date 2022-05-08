import useSWR from 'swr'

import fetch from '../fetch'

export default function getCameraAiEvents(props) {
  const { token, event, limit } = props;
  return useSWR(`/api/cameras/ai/filter?token=${token}&event=${event}&limit=${limit}`, fetch)
}

