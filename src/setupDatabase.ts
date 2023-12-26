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

const setupDatabase = () => {
  const connect = () => {
    mongoose
      .connect(dbUri)
      .then(() => {
        console.log('Успешное подключение к базе данных');
      })
      .catch((error) => {
        console.log('Ошибка подключения к базе данных', error);

        return process.exit(1);
      });
  };

  connect();
  mongoose.connection.on('disconnected', () => setTimeout(connect, 5000));
};

export default setupDatabase