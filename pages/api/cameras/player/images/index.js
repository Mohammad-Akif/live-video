import axios from 'axios';
import dbConnect from '../../../../../mongo/dbConnect';
import Camera from '../../../../../mongo/models/camera';
import VXG from '../../../../../lib/vxg/index';

export default async function handler(req, res) {
	const {query: { id, key, token, limit, start, end }, method } = req;
	
	await dbConnect();

	switch (method) {
		case 'GET':
			try {
				if(key === 'range'){
					const { start, end } = req.query;
					let limitRes = limit ? limit :'24';
					const vxgRes = await VXG.getCameraImageGenRange(token,limitRes, start,end)
					console.log('Get Camera Images Range', start,end)
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
