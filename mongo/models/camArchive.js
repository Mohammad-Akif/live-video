import mongoose, { ConnectionStates } from 'mongoose';
const Schema = mongoose.Schema;

const camArchive = new Schema({
    clip_id: {
        type: String
    },

    description: {
		type: String,
		
    },
    
},
{
    timestamps: true,
});

mongoose.models = {}; //Prevents overwrite warning

const CamArchive = mongoose.model('CamArchive', camArchive);

export default CamArchive;
