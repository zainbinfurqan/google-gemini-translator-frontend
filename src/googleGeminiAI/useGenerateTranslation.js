import { GoogleGenerativeAI } from '@google/generative-ai'

export const generateTranslation =  async (text, language) => {
        try {
            console.log(text)
            console.log(language)
            const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_GEMINI_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `convert this text ${text} to ${language} language `;
            const response = await model.generateContent(prompt);
            return  response.response.text()
        } catch (error) {
                console.log(error)
        }

}