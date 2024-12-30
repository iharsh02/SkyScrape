import { ExecutionEnvironment } from "@/types/executor";
import { ExtractDataWithAITask } from "../tasks/ExtractDataWithAI";
import db from "@/lib/db";
import { symetricDecrypt } from "@/lib/encryption";
import OpenAI from "openai";

export async function extractDataWithAIExecutor(
  environment: ExecutionEnvironment<typeof ExtractDataWithAITask>,
): Promise<boolean> {
  try {
    const content = environment.getInput("Content");
    if (!content) {
      environment.log.error("Input content not defined");
      return false;
    }

    const credentials = environment.getInput("Credentials");
    if (!credentials) {
      environment.log.error("Input Credentials are not defined");
      return false;
    }

    const prompt = environment.getInput("Prompt");
    if (!prompt) {
      environment.log.error("Input Prompt is not defined");
      return false;
    }

    const credential = await db.credential.findUnique({
      where: {
        id: credentials,
      },
    });

    if (!credential) {
      environment.log.error("Credentials not found");
      return false;
    }

    const plainCredentialValue = symetricDecrypt(credential.value);
    if (!plainCredentialValue) {
      environment.log.error("Cannot decrypt credential");
      return false;
    }

    const openai = new OpenAI({
      apiKey: plainCredentialValue,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a webscraper helper that extracts data from HTML or text. You will be given a piece of text or HTML content as input and also the prompt with the data you have to extract. The response should always be only the extracted data as a JSON array or object, without any additional words or explanations. Analyze the input carefully and extract data precisely based on the prompt. If no data is found , return an empty JSON array. Work only with the provided content and ensure the output is always a valid JSON array without any surrounding text",
        },
        {
          role: "user",
          content: content,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    environment.log.info(
      `Prompt tokens: ${response.usage?.prompt_tokens ?? 0}`,
    );
    environment.log.info(
      `Completion tokens: ${response.usage?.completion_tokens ?? 0}`,
    );

    const result = response.choices[0].message?.content;
    if (!result) {
      environment.log.error("Empty response from AI");
      return false;
    }

    environment.setOutput("Extracted Data", result);
    return true;
  } catch (error: any) {
    environment.log.error(error?.message || "An unknown error occurred");
    return false;
  }
}
