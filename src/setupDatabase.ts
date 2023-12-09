import mongoose from 'mongoose';
import config from 'config';

const dbUrl = `mongodb://${config.get('dbName')}:${config.get(
  'dbPass',
)}@localhost:6000/jwtAuth?authSource=admin`;

export default () => {
  const connect = () => {
    mongoose
      .connect(dbUrl)
      .then(() => {
        console.log('Successfully connected to database');
      })
      .catch((error) => {
        console.log('Error connecting to database', error);

        return process.exit(1);
      });
  };

  connect();
  mongoose.connection.on('disconnected', () => setTimeout(connect, 5000));
};
