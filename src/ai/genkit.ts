/**
 * @fileoverview This file configures and exports the Genkit AI instance.
 */

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Initialize the Genkit AI instance with the Google AI plugin.
// This `ai` object will be used throughout the application to interact with Genkit services.
export const ai = genkit({
  plugins: [googleAI()],
});
