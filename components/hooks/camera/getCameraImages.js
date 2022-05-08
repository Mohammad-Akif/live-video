import useSWR from 'swr'

import fetch from '../fetch'

export default function getCameraImages(props) {
    const { token, limit, start, end } = props;
  return useSWR(`/api/cameras/player/images?key=range&token=${token}&limit=${limit}&start=${start}&end=${end}`, fetch)
}

