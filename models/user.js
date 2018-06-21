import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:  { type: String, required: true, unique: true },
    password:  { type: String, required: true },
    phone:     { type: Number, required: true },
    name:      { type: String, required: true }
});

userSchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);  
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);  
};

export default mongoose.model('User', userSchema);