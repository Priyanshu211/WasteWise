/**
 * @fileoverview This file defines the Zod schemas and TypeScript types for the application's AI flows.
 * Separating schemas into their own file avoids issues with Next.js "use server" directive,
 * which requires all exports from a server-side file to be async functions.
 */

import { z } from 'zod';

// Define the input schema for the optimization flow.
export const OptimizeAssignmentsInputSchema = z.object({
  complaints: z.array(
    z.object({
      id: z.string(),
      location: z.string(),
      wasteCategory: z.string(),
    })
  ),
  workers: z.array(
    z.object({
      workerId: z.string(),
      name: z.string(),
      skills: z.array(z.string()),
      area: z.string(),
    })
  ),
});

export type OptimizeAssignmentsInput = z.infer<
  typeof OptimizeAssignmentsInputSchema
>;

// Define the output schema for the optimization flow.
export const OptimizeAssignmentsOutputSchema = z.object({
  assignments: z.array(
    z.object({
      complaintId: z.string().describe('The ID of the complaint to be addressed.'),
      workerId: z.string().describe('The ID of the worker assigned to the complaint.'),
      reason: z.string().describe('A brief explanation for why this worker was chosen for this specific complaint, considering their skills, location, and the nature of the complaint.'),
    })
  ),
  summary: z.string().describe('A brief, high-level summary of the assignment strategy.'),
});

export type OptimizeAssignmentsOutput = z.infer<
  typeof OptimizeAssignmentsOutputSchema
>;
