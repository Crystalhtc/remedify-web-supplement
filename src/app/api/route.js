import { generateObject } from 'ai';
import { z } from 'zod';
import { openai } from "@ai-sdk/openai"

export const GET = async () => {
    return new Response("ok")
}
export const POST = async (request) => {
    const data = await request.json();
    console.log(data);

    const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: z.object({
        // recipe: z.object({
        //     name: z.string(),
        //     ingredients: z.array(z.object({ name: z.string(), amount: z.string() })),
        //     steps: z.array(z.string()),
        // }),
        description: z.string(),
        uses: z.array(z.string()),
        sideEffects: z.array(z.string()),
        drugInteraction: z.string(),
        allergies: z.array(z.string()),
    }),
    system: 'You are a tool that provides descriptions, uses, side effects, drug interaction, and allergies of medications based on the provided data.',
    prompt: `Medication Data:
- DIN: ${data.din}
- Brand Name: ${data.brandName}
- Company: ${data.companyName}
- Dosage Form: ${data.dosageForm}
- Active Ingredient: ${data.activeIngredient}
`,
    });
    return new Response(JSON.stringify(object))
}
