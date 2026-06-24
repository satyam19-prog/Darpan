import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler.middleware';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

export class ReportController {
  // Generate Excel report for a camp
  static async exportExcel(req: Request, res: Response) {
    const { campId } = req.params;

    const camp = await prisma.camp.findUnique({
      where: { id: campId },
      include: {
        enrollments: {
          include: { student: { include: { user: true } } }
        }
      }
    });

    if (!camp) throw new AppError('Camp not found', 404);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Leaderboard');

    sheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Codeforces', key: 'cf', width: 15 },
      { header: 'LeetCode', key: 'lc', width: 15 },
      { header: 'CodeChef', key: 'cc', width: 15 },
      { header: 'Total Solved', key: 'solved', width: 15 }
    ];

    camp.enrollments.forEach((enrollment: any) => {
      const p = enrollment.student;
      sheet.addRow({
        name: p.user.name,
        email: p.user.email,
        cf: 0,
        lc: 0,
        cc: 0,
        solved: 0
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=camp-${campId}-report.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  }

  // Generate PDF report for a camp
  static async exportPDF(req: Request, res: Response) {
    const { campId } = req.params;

    const camp = await prisma.camp.findUnique({
      where: { id: campId },
      include: {
        enrollments: {
          include: { student: { include: { user: true } } }
        }
      }
    });

    if (!camp) throw new AppError('Camp not found', 404);

    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=camp-${campId}-report.pdf`);
    
    doc.pipe(res);

    doc.fontSize(20).text(`Camp Performance Report`, { align: 'center' });
    doc.fontSize(14).text(`Camp: ${camp.name}`, { align: 'center' });
    doc.moveDown(2);

    let y = doc.y;
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('Name', 50, y);
    doc.text('CF Rating', 250, y);
    doc.text('LC Rating', 350, y);
    doc.text('Solved', 450, y);
    
    doc.moveTo(50, y + 15).lineTo(500, y + 15).stroke();
    
    doc.font('Helvetica');
    y += 25;

    camp.enrollments.forEach((enrollment: any, index: number) => {
      const p = enrollment.student;
      doc.text(p.user.name, 50, y);
      doc.text('0', 250, y);
      doc.text('0', 350, y);
      doc.text('0', 450, y);
      y += 20;

      if (y > 700) {
        doc.addPage();
        y = 50;
      }
    });

    doc.end();
  }
}
