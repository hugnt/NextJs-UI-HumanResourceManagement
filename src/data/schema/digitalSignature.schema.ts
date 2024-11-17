import { z } from 'zod';

export const digitalSigSchema = z.object({
  certificateFile: z.instanceof(File).nullable(),
  reason: z.string().optional(),
  password: z.string().optional(),
  signatureImageFile: z.instanceof(File).nullable().optional(),
});

export type DigitalSig = z.infer<typeof digitalSigSchema>;
export const digitalSigDefault: DigitalSig = {
  certificateFile: null,
  reason: '',
  password: '',
  signatureImageFile: null,
};