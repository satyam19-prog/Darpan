import { z } from 'zod';

export const createStudentSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    cfHandle: z.string().optional(),
    lcHandle: z.string().optional(),
    ccHandle: z.string().optional(),
  }),
});

export const updateHandlesSchema = z.object({
  body: z.object({
    cfHandle: z.string().optional(),
    lcHandle: z.string().optional(),
    ccHandle: z.string().optional(),
  }),
});

export const bulkImportSchema = z.object({
  body: z.object({
    csvData: z.string().optional(),
    googleSheetUrl: z.string().url().optional(),
  }).refine(data => data.csvData || data.googleSheetUrl, {
    message: "Either csvData or googleSheetUrl must be provided",
  }),
});
