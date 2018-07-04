import mongoose from 'mongoose';

require('mongoose-type-url');

const Schema = mongoose.Schema;

const articleSchema = new Schema({
    username:  { type: Schema.Types.ObjectId, ref: 'User'},
    caption:   { type: String, required: true },
    text:      { type: String, required: true },
    image:     { type: mongoose.SchemaTypes.Url, required: false }
});

export default mongoose.model('Article', articleSchema);