import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email:     { type: String, required: true, unique: true },
    password:  { type: String, required: true },
    phone:     { type: Number, required: true },
    name:      { type: String, required: true },
    roles:     { type: [String], default: ['technician'] },
    confirmed: { type: Boolean, default: false }
});

userSchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);  
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);  
};

userSchema.methods.hasRole = function(role) {
  if (!this.confirmed) return false;
	for (let i = this.roles.length - 1; i >= 0; i--) {
		if (this.roles[i] == role) return true;
	};

	return false;
}

export default mongoose.model('User', userSchema);