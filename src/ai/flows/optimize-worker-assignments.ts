'use server';

/**
 * @fileOverview An AI agent that optimizes worker task assignments.
 *
 * - optimizeWorkerAssignments - A function that suggests improved worker assignments based on proximity, skill match, and past performance.
 * - OptimizeWorkerAssignmentsInput - The input type for the optimizeWorkerAssignments function.
 * - OptimizeWorkerAssignmentsOutput - The return type for the optimizeWorkerAssignments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeWorkerAssignmentsInputSchema = z.object({
  workOrderDescription: z.string().describe('A description of the work order, including location and required skills.'),
  availableWorkers: z
    .array(z.object({
      workerId: z.string().describe('The unique identifier of the worker.'),
      location: z.string().describe('The current location of the worker.'),
      skills: z.array(z.string()).describe('The skills possessed by the worker.'),
      pastPerformance: z.number().describe('A numerical representation of the worker\'s past performance (e.g., average task completion time, quality score).'),
    }))
    .describe('A list of available workers with their locations, skills, and past performance data.'),
});
export type OptimizeWorkerAssignmentsInput = z.infer<typeof OptimizeWorkerAssignmentsInputSchema>;

const OptimizeWorkerAssignmentsOutputSchema = z.object({
  suggestedAssignments: z
    .array(z.object({
      workerId: z.string().describe('The worker ID to be assigned to the task.'),
      reasoning: z.string().describe('The detailed reasoning for this assignment suggestion, considering proximity, skills, and past performance.'),
      confidenceScore: z.number().describe('A numerical score indicating the confidence level in the assignment suggestion (e.g., 0.0 to 1.0).'),
    }))
    .describe('A list of suggested worker assignments for the work order, along with reasoning and confidence scores.'),
});
export type OptimizeWorkerAssignmentsOutput = z.infer<typeof OptimizeWorkerAssignmentsOutputSchema>;

export async function optimizeWorkerAssignments(input: OptimizeWorkerAssignmentsInput): Promise<OptimizeWorkerAssignmentsOutput> {
  return optimizeWorkerAssignmentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeWorkerAssignmentsPrompt',
  input: {schema: OptimizeWorkerAssignmentsInputSchema},
  output: {schema: OptimizeWorkerAssignmentsOutputSchema},
  prompt: `You are an AI assistant specializing in optimizing worker task assignments for waste management operations.

  Given a work order description and a list of available workers with their attributes (location, skills, past performance), your goal is to suggest the best worker assignments to maximize efficiency and effectiveness.

  Consider the following factors when making your suggestions:
  - Proximity: Assign workers who are closest to the work order location to minimize travel time.
  - Skill Match: Assign workers who possess the skills required to complete the work order successfully.
  - Past Performance: Prioritize workers with a proven track record of high performance.

  Work Order Description: {{{workOrderDescription}}}

  Available Workers:
  {{#each availableWorkers}}
  - Worker ID: {{{workerId}}}, Location: {{{location}}}, Skills: {{#each skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}, Past Performance: {{{pastPerformance}}}
  {{/each}}

  Based on the above information, provide a list of suggested worker assignments for the work order, along with detailed reasoning for each assignment and a confidence score (0.0 to 1.0) indicating your certainty in the suggestion.
  Ensure the output is valid JSON.
  `,  
});

const optimizeWorkerAssignmentsFlow = ai.defineFlow(
  {
    name: 'optimizeWorkerAssignmentsFlow',
    inputSchema: OptimizeWorkerAssignmentsInputSchema,
    outputSchema: OptimizeWorkerAssignmentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
