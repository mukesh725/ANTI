import { signToken } from './src/lib/membershipAuth';

const token = signToken({ mobile: '9876543210' });
console.log(token);
