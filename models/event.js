import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const eventSchema = new Schema({
	title:     { type: String, required: true },
	content:   { type: String, required: true },
	city:      { type: String, required: true },
	createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
	messages:  [{
		sender:     { type: Schema.Types.ObjectId, ref: 'User' },
		senderName: { type: String, required: true },
		message:    { type: String, required: true }
	}],
	followers: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

export default mongoose.model('Event', eventSchema);