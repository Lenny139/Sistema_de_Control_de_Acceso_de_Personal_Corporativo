import { Request, Response } from 'express';

export abstract class ControllerBase {
  abstract execute(req: Request, res: Response): Promise<void>;
}
