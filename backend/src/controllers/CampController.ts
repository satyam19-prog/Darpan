import { Request, Response } from 'express';
import { CampService } from '../services/CampService';
import { AuthRequest } from '../types';

const campService = new CampService();

export class CampController {
  static async createCamp(req: AuthRequest, res: Response) {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    const camp = await campService.createCamp(req.user.userId, req.body);
    res.status(201).json({ success: true, data: camp });
  }

  static async getAllCamps(req: Request, res: Response) {
    const camps = await campService.getAllCamps();
    res.status(200).json({ success: true, data: camps });
  }

  static async getCamp(req: Request, res: Response) {
    const camp = await campService.getCampById(req.params.id);
    res.status(200).json({ success: true, data: camp });
  }

  static async assignMentor(req: Request, res: Response) {
    const { mentorEmail } = req.body;
    const assignment = await campService.assignMentor(req.params.id, mentorEmail);
    res.status(200).json({ success: true, data: assignment });
  }

  static async importStudents(req: Request, res: Response) {
    const { sheetUrl } = req.body;
    const results = await campService.importStudentsFromSheet(req.params.id, sheetUrl);
    res.status(200).json({ success: true, data: results });
  }
}
