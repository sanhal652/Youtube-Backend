import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getCategoryOfVideos = async (title, description) => {
   try {
        const model=genAI.getGenerativeModel({
            model:"gemini-2.0-flash-lite",
            systemInstruction:"You are a helpful assistant that categorizes video content into one of the following categories: Education, Entertainment, Technology, Lifestyle, Sports, Music, Travel, Food, Fashion, Gaming,Health and Fitness, Comedy, Science, Art and Culture, Business and Finance. Based on the title and description of the video, determine the most appropriate category. Respond with only the category name without any additional text or explanation."
        })
        const prompt= `Categorize this video:\nTitle: ${title}\nDescription: ${description}`
        const result=await model.generateContent(prompt)
        const response=result.response;
        return response.text().trim()
   } catch (error) {
        console.log("Ai error", error.message)
        return "Other"
   }
}

export const aiVideoSummarizer = async (title, description) => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-lite",
            systemInstruction: "You are a helpful assistant that summarizes video content. Provide a concise summary in 2-3 sentences.",
        });

        //generate content using the model
        const prompt = `Summarize this video:\nTitle: ${title}\nDescription: ${description}`;
        const result = await model.generateContent(prompt);
        const response =  result.response;
        //return response.text().trim();
        const text=response.text().trim();
        console.log("AI summary:", text);
        return text;
    } 
    catch (error) {
        console.log("Ai error", error.message)
        return null
    }
}