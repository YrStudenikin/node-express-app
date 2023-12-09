// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import express, { Express } from 'express';

import databaseConnection from './setupDatabase';
import { AppServer } from './setupServer';

class Application {
  public init(): void {
    databaseConnection();

    const app: Express = express();
    const server: AppServer = new AppServer(app);

    server.start();
  }

  private static handleExit(): void {
    //TODO
  }
}

const application: Application = new Application();

application.init();
