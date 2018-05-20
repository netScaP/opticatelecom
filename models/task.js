import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const taskSchema = new Schema({
	dispatcher:   { type: Schema.Types.ObjectId, ref: 'Dispatcher'},
	authorPhone:  { type: Number },
    name:         { type: String, required: true },
    task:         { type: String, required: true },
    gotTask:      { type: Schema.Types.ObjectId, ref: 'User', required: false },
    status:       { type: String, default: 'free', enum: ['free', 'adopted', 'ready'] }
});


export default mongoose.model('Task', taskSchema);