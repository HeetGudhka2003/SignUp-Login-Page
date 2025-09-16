import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
    username:string;
  email: string;
  password: string;       // hashed
  currentRefreshTokenId?: string | null;
}

const userSchema = new Schema<IUser>({
      username: { type: String, required:true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  currentRefreshTokenId: { type: String, default: null }
}, { timestamps: true });

export default model<IUser>('User', userSchema);
