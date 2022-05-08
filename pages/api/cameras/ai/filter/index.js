import axios from 'axios';
import dbConnect from '../../../../../mongo/dbConnect';
import Camera from '../../../../../mongo/models/camera';
import dateformat from 'dateformat';
import VXG from '../../../../../lib/vxg/index';

export default async function handler(req, res) {
	const {
		query: { token,  event, limit, next },
		method
	} = req;

	await dbConnect();
	switch (method) {
		case 'GET' /* Get a model by its ID */:
			try {
				//Time Settings for Search Filtering
				let currTime = new Date ().toLocaleString("en-US", {timeZone: "America/New_York"})
				let startTime = encodeURIComponent(dateformat(currTime, "yyyy-mm-dd'T'HH:MM:ss")) //Current Time
				//////End Time Settings ////////
				let offset = '0'
				let limitEv = '60' 
				let order_by = 'time' // Newsest at top of response
				let objectEvt = event
				// let objectEvt =  'object_and_scene_detection' , 'personal_protective_equipment_detection', specify none to return all
				const vxgRes = await VXG.getCameraAi(token, limit ? limit :limitEv, offset,objectEvt ,order_by)
				console.log('Get Camera Ai Records Recent', objectEvt ? `Event specififed: ${objectEvt}`: 'No Event Specified')
				return res.status(200).json({ success: true,  events: vxgRes.data});

				
			} catch (error) {
                console.log(error)
				res.status(400).json({ success: false });
			}
			break;
		

		default:
			res.status(400).json({ success: false });
			break;
	}
}
