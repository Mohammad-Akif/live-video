import { customAlphabet } from 'nanoid'
import VXG from '../../../../lib/vxg/index';
import Camera from '../../../../mongo/models/camera';
import CamArchive from '../../../../mongo/models/camArchive';

import dbConnect from '../../../../mongo/dbConnect';

export default async function handler(req, res) {
    const {
        query: { id, key }, 
        method 
    } = req;
	
	await dbConnect();

	switch (method) {
        case 'GET':
			
			try {
              
                const camera = await Camera.findOne({_id: id});
                if(!camera){
                    return res.status(422).json({success:false, message:'No Camera Found'})
                }
                const apiRes = await VXG.getCameraArchive(camera)
                console.log(apiRes)
                return  res.status(200).json({success:true, archive: apiRes.data.events })
                                
			} catch (error) {
                console.log('Camera Archive Find Error', error)
				res.status(400).json({ success: false });
			}
			break;
		case 'POST':

			try {
               
               const { token } = req.query
                const data = {
                    start: req.body.start,
                    end: req.body.end,
                    delete_at: "2022-05-14T06:17:17.904016",
                    group: req.body.group ? data.group : 'z-archive-bk', //z-archive
                    title: req.body.title
                  }
                const apiRes = await VXG.createCameraArchiveClip(token, data)
                console.log(apiRes)
                const archiveClip = await CamArchive.create({
                    clip_id: apiRes.data.id
                })

               return  res.status(201).json({success:true, message:'archive clip created' })
                
			} catch (error) {
                console.log('Archive Create Error', error)
				res.status(400).json({ success: false });
			}
			break;
		
		default:
			res.status(400).json({ success: false });
			break;
	}
}
