
'use server';
/**
 * @fileoverview An AI flow for optimizing waste worker assignments.
 * This file defines a Genkit flow that takes a list of complaints and a list of available workers
 * and returns an optimized assignment plan to resolve the complaints efficiently.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { Complaint, Worker } from '@/lib/types';

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

/**
 * An asynchronous function that takes complaints and workers as input,
 * and invokes the `optimizeAssignmentsFlow` to get an optimized assignment plan.
 * @param {OptimizeAssignmentsInput} input - The complaints and workers to be assigned.
 * @returns {Promise<OptimizeAssignmentsOutput>} A promise that resolves to the optimized assignment plan.
 */
export async function optimizeAssignments(
  input: OptimizeAssignmentsInput
): Promise<OptimizeAssignmentsOutput> {
  return await optimizeAssignmentsFlow(input);
}


// Define the prompt for the AI model to generate the assignment plan.
const optimizationPrompt = ai.definePrompt({
    name: 'optimizationPrompt',
    input: { schema: OptimizeAssignmentsInputSchema },
    output: { schema: OptimizeAssignmentsOutputSchema },
    prompt: `You are an expert logistics manager for a city's waste management department. 
    Your task is to assign waste collection workers to new complaints in the most efficient way possible.
    
    Analyze the list of complaints and the list of available workers. 
    
    Your goal is to create an assignment plan that minimizes travel time and maximizes the use of worker skills.
    
    Consider the following factors:
    - Worker's current zone/area vs. complaint location. Prioritize assigning workers to complaints in or near their assigned zone.
    - Worker's skills vs. the waste category of the complaint. For example, a worker skilled in "Hazardous Waste Handling" should be prioritized for hazardous waste complaints.
    - Create a plan that assigns each complaint to exactly one worker.
    
    Here is the data:
    
    Complaints:
    {{#each complaints}}
    - Complaint ID: {{id}}, Location: {{location}}, Category: {{wasteCategory}}
    {{/each}}

    Workers:
    {{#each workers}}
    - Worker ID: {{workerId}}, Name: {{name}}, Area: {{area}}, Skills: {{#each skills}}{{{this}}}{{/each}}
    {{/each}}
    
    Please provide your output in the specified JSON format.`,
});


// Define the Genkit flow for optimizing assignments.
const optimizeAssignmentsFlow = ai.defineFlow(
  {
    name: 'optimizeAssignmentsFlow',
    inputSchema: OptimizeAssignmentsInputSchema,
    outputSchema: OptimizeAssignmentsOutputSchema,
  },
  async (input) => {
    const { output } = await optimizationPrompt(input);
    return output!;
  }
);
