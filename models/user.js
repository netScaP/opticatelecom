import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email:            { type: String, required: true, unique: true },
    name:             { type: String, required: true, index: true },
    password:         { type: String, required: true },
    city:             { type: String, required: true },
    phone:            { type: Number, required: true },
    followingsEvents: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    followingsUsers:  [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

userSchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);  
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);  
};

userSchema.index({'$**': 'text'});

export default mongoose.model('User', userSchema);