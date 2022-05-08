import axios from 'axios';

const CLOUD_BASE_URL = process.env.VXG_API_GATEWAY //https://web.skyvr.videoexpertsgroup.com
const  CLOUD_API_KEY = 'v3.sY7gdC0NGw7ORTA'
const adminHeaders = {
    'Content-Type': 'application/json',
    "Authorization": `LKey ${CLOUD_API_KEY}`
}

const adminInstance = axios.create({
    baseURL: CLOUD_BASE_URL,
    headers: adminHeaders
});
const instance = axios.create({
    baseURL: CLOUD_BASE_URL,
});


const CLOUD_ADMIN_API_PATH = '/api/v3';
const CLOUD_SERVERS_API_PATH = '/api/v6';
const CLOUD_AI_API_PATH = '/api/v2';
const CLOUD_CHANNEL_API_PATH = '/api/v4';


////////////////////////////////////////////  API v3 Admin ///////////////////////////////////////////////////////////////
const createChannel = (data) => {
  const camData = {
    name: data.name,
    meta: {},
    rec_mode: data.rec_mode,
    timezone: "America/New_York"
  }
  return adminInstance.post(`${CLOUD_ADMIN_API_PATH}/channels/`,camData);
}

const deleteChannel = (channel_id) => adminInstance.delete(`${CLOUD_ADMIN_API_PATH}/channels/${channel_id}`);
const updateChannel = (channel_id, body) => adminInstance.put(`${CLOUD_ADMIN_API_PATH}/channels/${channel_id}`, body);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////  API v6 Servers ///////////////////////////////////////////////////////////////
const getAllServers = () => adminInstance.get(`${CLOUD_SERVERS_API_PATH}/servers/`)
const getServer = (server_id) => adminInstance.get(`${CLOUD_SERVERS_API_PATH}/servers/${server_id}`)
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////  API v2 Artifical Intelligence ///////////////////////////////////////////////////////          //events = camera.aiTypes[0],[1],[2],etc..
const getCameraAi = (token,limit,offset,events,order) => instance.get(`${CLOUD_AI_API_PATH }/storage/events/?limit=${limit}&offset=${offset}&events=${events}&order_by=${order}&include_filemeta_download=true&include_meta=true`,{
    headers: {
    'Content-Type': 'application/json',
    'Authorization': `Acc ${token}`
    }
})
const getCameraAiNextURL = (camera,next_url) => instance.get(`${next_url}&include_meta=true`,{
    headers: {
    'Content-Type': 'application/json',
    'Authorization': `Acc ${camera.vxg.allToken}`
    }
})
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////  API v4 Channels ///////////////////////////////////////////////////////////////
const getCameraImageGenRange = (token,limit,start,end) => instance.get(`${CLOUD_CHANNEL_API_PATH}/storage/images/?origin=generated_from_live&order_by=time&limit=${limit}${start.length > 4 && `&start=${start}`}${end.length > 4 && `&end=${end}`}`,{
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Acc ${token}`
  }
}) 
const getCameraEventImages = (camera,offset,limit,order) => instance.get(`${CLOUD_CHANNEL_API_PATH}/storage/images/?offset=${offset}&limit=${limit}&order_by=${order}`,{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Acc ${camera.vxg.allToken}`
    }
  }) 
  const getCameraEventImagesNextURL = (camera,next_url) => instance.get(`${next_url}`,{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Acc ${camera.vxg.allToken}`
    }
  })                                                                                                                                     
  // Used For Image Generation Tasks or Specific Event - NOT IN USE
  const getCameraRecordingPreview = ({camera,offset,origin = 'recording_thumbnail', limit = 1 ,order = '-time'}) => instance.get(`${CLOUD_CHANNEL_API_PATH}/storage/images/?offset=${offset}&limit=${limit}&order_by=${order}`,{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Acc ${camera.vxg.allToken}`
    }
  }) 
  const getCameraLiveSnap = (camera) => instance.get(`${CLOUD_CHANNEL_API_PATH}/live/image/`,{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Acc ${camera.vxg.allToken}`
    }
  }) 
  //TODO Check Start,End filter options
  const getCameraRecords = (camera,start, limit, order) => instance.get(`${CLOUD_CHANNEL_API_PATH}/storage/records/?end=${start}&limit=${limit}&order_by=${order}`,{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Acc ${camera.vxg.allToken}`
    }
  }) 
  const getCameraDvrRecords = (token, start, limit) => instance.get(`${CLOUD_CHANNEL_API_PATH}/storage/records?start=${start}&limit=${limit}`,{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Acc ${token}`
    }
  }) 
  const getCameraDvrRecordsStart = (token, limit) => instance.get(`${CLOUD_CHANNEL_API_PATH}/storage/records?order_by=time&limit=${limit}`,{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Acc ${token}`
    }
  }) 
  const getCameraDvrRecordsRange = (token, limit, start,end) => instance.get(`${CLOUD_CHANNEL_API_PATH}/storage/records?order_by=time&limit=${limit}&start=${start}&end=${end}`,{
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Acc ${token}`
    }
  }) 
  const getCameraCalender = (token, boundstime, daysincamtz) =>  instance.get(`${CLOUD_CHANNEL_API_PATH}/storage/calendar/?boundstime=${boundstime}&daysincamtz=${daysincamtz}`,{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Acc ${token}`
    }
  }) 
  const getCameraWatchURL = (token) => instance.get(`${CLOUD_CHANNEL_API_PATH}/live/watch/`,{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Acc ${token}`
    }
  }) 

  const createCameraArchiveClip = (token,data) => {
    const clipData = {
      start: data.start,
      end: data.end,
      wait_for_data: false,
      delete_at:data.delete_at,
      event_time: null,
      group: data.group ,
      title: data.title
    }
    return instance.post(`${CLOUD_CHANNEL_API_PATH}/clips/`,clipData ,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Acc ${token}`
      }
    });
  }

  const getCameraArchive = (camera) => instance.get(`${CLOUD_CHANNEL_API_PATH}/clips/?order_by=-created`,{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Acc ${camera.vxg.allToken}`
    }
  }) 
  const getCameraArchiveClip = (camera,clip_id) => instance.get(`${CLOUD_CHANNEL_API_PATH}/clips/${clip_id}/`,{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Acc ${camera.vxg.allToken}`
    }
  }) 

  const deleteCameraArchiveClip = (camera,clip_id) => instance.delete(`${CLOUD_CHANNEL_API_PATH}/clips/${clip_id}`,{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Acc ${camera.vxg.allToken}`
    }
  }) 


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default {
  createChannel,//Create Channel
  deleteChannel,// Delete Channel by Id
  updateChannel, // Update Channel with JSON Body
  getAllServers, //Fetch All Servers on Cloud Account
  getServer ,//Fetch Server By ID
  getCameraAi, //Fetch Camera Ai Events
  getCameraAiNextURL, //Fetch Camera Ai Events - Paginate
  getCameraImageGenRange, // Get Live Image Generation Period
  getCameraEventImages, // Get Camera Event Images - no origin specified (Option: Recording, Motion, Image Genration Task or null for all)
  getCameraEventImagesNextURL,// Get Camera Event Images - Paginate
  getCameraRecordingPreview, // Get Camera Recent Event Image - origin recording_thumbnail
  getCameraLiveSnap, //Get Live Snapshot From Camera
  getCameraRecords, // Get Recorded Storage Clips 
  getCameraDvrRecords, // Get Camera Clips After DVR Click
  getCameraDvrRecordsStart, // Records from Start of recording period
  getCameraDvrRecordsRange, // Records From Specified Range
  getCameraCalender,// Get Camera Calender Bounds
  getCameraWatchURL, // Get Camera Live Watch URLs (HLS,(RTMP,WebRTC)-Not used)
  createCameraArchiveClip, //Create Archive Clip
  getCameraArchive, // Get Archive Clips
  getCameraArchiveClip, // Get Archive Clip by ID
  deleteCameraArchiveClip, //Delete Archive Clip

};

