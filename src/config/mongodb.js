import mongoose from 'mongoose';

export const connect = (uri, config) => {
  mongoose.connect(uri, config);
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    console.log('Connected to database');
  });
};


export default mongoose;