import axios from 'axios';
import dbConnect from '../../../../../mongo/dbConnect';
import Camera from '../../../../../mongo/models/camera';
import VXG from '../../../../../lib/vxg/index';

export default async function handler(req, res) {
	const {query: { id, key, token, limit}, method } = req;
	
	await dbConnect();

	switch (method) {
		case 'GET':
			try {
				if(key === 'range'){
					const { start, end } = req.query;
					let limitRes = limit ? limit :'24';
					const vxgRes = await VXG.getCameraDvrRecordsRange(token,limitRes, start,end)
					console.log('Get Camera Records Range', start,end)
					return res.status(200).send({success:true , clips: vxgRes.data})
				}else if ( key === 'recordingStart'){
					//newer method fetch recordings
					let limitRes = limit ? limit :'24';
					const vxgRes = await VXG.getCameraDvrRecordsStart(token,limitRes)
					console.log('Get Camera Recording Start')
					return res.status(200).send({success:true , clips: vxgRes.data})
				}else{
					const {start} =req.query;
					let limitRes = limit;
					const vxgRes = await VXG.getCameraDvrRecords(token,start,limitRes)
					console.log('Got Camera Recordings from Start')
				   return res.status(200).send({success:true , clips: vxgRes.data})
				}
			

				
			} catch (error) {
				console.log('Camera Records Err',error)
				res.status(400).json({ success: false });
			}
			break;
		case 'POST':
		
            
			try {
				if( key === 'recordedStart'){
                    const {start} =req.body;
					console.log(start)
					let limitRes ='40';
					const vxgRes = await VXG.getCameraDvrRecords(token,start,limitRes)
					console.log('Got Camera Recording Start')
				   return res.status(200).send({success:true , clips: vxgRes.data})
				   
                }
			} catch (error) {
				console.log('Camera Records Err',error)
				res.status(400).json({ success: false });
			}
			break;
		
		default:
			res.status(400).json({ success: false });
			break;
	}
}
