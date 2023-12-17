import mongoose from 'mongoose';
import config from 'config';

const dbUri = [
    'mongodb://',
    `${config.get('dbUserName')}:`,
    `${config.get('dbPass')}@`,
    `${config.get('dbHost')}:`,
    `${config.get('dbPort')}/`,
    `${config.get('dbName')}?authSource=admin`
].join('')

export default () => {
  const connect = () => {
    mongoose
      .connect(dbUri)
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
