import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenRouter } from "@langchain/openrouter";


const groq = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "openai/gpt-oss-120b",
    temperature: 0,
})


const gemini = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-3.6-flash",
    temperature: 0,
})

const openrouter = new ChatOpenRouter({
  model: "deepseek/deepseek-chat",
  temperature: 0,
  maxTokens: 2500,
});


export const getModel=async (agent)=>{
    switch(agent){
        case "chat":
            return gemini;
        case "search":
            return gemini;
        case "coding":
            return openrouter;
        case "imageAnalyzer":
            return gemini;
        
        default:
            return groq
    }
}
