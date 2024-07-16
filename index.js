const PORT = 5000 || process.env.PORT;
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(express.json());
app.use(cors());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


app.get('/', (req, res) => {
    res.send('Hello World');
})

app.post('/api/getresult', async function (req, res) {
    const userInput = req.body.userInput;
    if (!userInput) {
        return res.status(400).json({ error: "User input is required", output: null });
    }

    try {
        const result = await model.generateContent(userInput);
        res.status(200).json({ output: result.response.candidates[0].content.parts[0].text });
    } catch (error) {
        res.status(500).json({ error: "Something went wrong!", output: null });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



export default app;