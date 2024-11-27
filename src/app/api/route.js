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
        uses: z.string(),
        sideEffects: z.array(z.string()),
    }),
    system: 'You are a tool that provides descriptions, uses, and side effects of medications based on the provided data.',
    prompt: `Medication Data:
- DIN: ${data.din}
- Brand Name: ${data.brandName}
- Company: ${data.companyName}
- Active Ingredient: ${data.activeIngredient}
- Dosage Form: ${data.dosageForm}
`,
    });
    return new Response(JSON.stringify(object))
}