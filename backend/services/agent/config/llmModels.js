import { ChatGroq } from "@langchain/groq";
import { MistralAI } from "@langchain/mistralai";
import { ChatOpenRouter } from "@langchain/openrouter";


const groq = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "openai/gpt-oss-120b",
    temperature: 0,
})


const mistral = new MistralAI({
    apiKey: process.env.MISTRAL_API_KEY,
    model: "ministral-8b-latest",
    temperature: 0,
})


const openrouter = new ChatOpenRouter({
    model: "deepseek/deepseek-chat",
    temperature: 0,
    maxTokens: 2500,
});


export const getModel = async (agent) => {

    switch(agent){

        case "chat":
            return mistral;

        case "search":
            return mistral;

        case "coding":
            return openrouter;

        case "imageAnalyzer":
            return mistral;

        default:
            return groq
    }
}
