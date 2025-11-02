/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */

import { Request, Response } from 'express';

class Controller {
  protected service: any;

  constructor(service: any) {
    this.service = service;

    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async getAll(_req: Request, res: Response) {
    try {
      const { code, data, message } = await this.service.getAll();

      if (!data) res.status(code).json({ message });

      return res.status(code).json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const { code, data, message } = await this.service.getById(id);

      if (!data) res.status(code).json({ message });

      return res.status(code).json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async create(req: Request, res: Response): Promise<void> {}

  async update(req: Request, res: Response): Promise<void> {}

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const { code, data, message } = await this.service.delete(id);

      if (!data) res.status(code).json({ message });

      return res.status(code).json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async recover(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const { code, data, message } = await this.service.recover(Number(id));

      if (!data) res.status(code).json({ message });

      return res.status(code).json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default Controller;
