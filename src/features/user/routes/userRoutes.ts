import express, { Router } from 'express';

class UserRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  //TODO
  public routes(): Router {
    this.router.get('/user/all', (req, res) => res.json(['Ivan', 'Test']));

    //...
    return this.router;
  }
}

export const userRoutes: UserRoutes = new UserRoutes();
