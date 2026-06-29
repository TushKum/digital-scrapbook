import { z } from 'zod';

export const windowSchema = z.enum(['24h', '7d', 'epi22']);
export const langSchema = z.enum(['EN', 'PA']);

export const idParamSchema = z.object({
  id: z.string().min(1).max(64),
});

export const aggregateQuerySchema = z.object({
  window: windowSchema.default('epi22'),
});

export const dispatchesQuerySchema = z.object({
  lang: langSchema.optional(),
});

const count = z.coerce.number().int().min(0).max(100000);
const percent = z.coerce.number().int().min(0).max(100);

export const submitReportSchema = z
  .object({
    window: windowSchema,
    sForms: count.optional(),
    pForms: count.optional(),
    newCases: count.optional(),
  })
  .refine((d) => d.sForms !== undefined || d.pForms !== undefined || d.newCases !== undefined, {
    message: 'Provide at least one of: sForms, pForms, newCases',
  });

export const updateStockSchema = z
  .object({
    window: windowSchema,
    ors: percent.optional(),
    zinc: percent.optional(),
    antibiotics: percent.optional(),
  })
  .refine((d) => d.ors !== undefined || d.zinc !== undefined || d.antibiotics !== undefined, {
    message: 'Provide at least one of: ors, zinc, antibiotics',
  });

export const loginSchema = z.object({
  username: z.string().trim().min(1, 'Username is required').max(64),
  password: z.string().min(1, 'Password is required').max(200),
});

export const addDispatchSchema = z.object({
  lang: langSchema,
  text: z.string().trim().min(4).max(280),
  priority: z.coerce.number().int().min(0).max(100).default(0),
});

export type SubmitReportInput = z.infer<typeof submitReportSchema>;
export type UpdateStockInput = z.infer<typeof updateStockSchema>;
export type AddDispatchInput = z.infer<typeof addDispatchSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
