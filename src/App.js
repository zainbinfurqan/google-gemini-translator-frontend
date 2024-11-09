import logo from './logo.svg';
import './App.css';
import { GoogleGenerativeAI } from '@google/generative-ai'
// import { GoogleAIFileManager, FileState } from '@google/generative-ai/server'
import { useEffect } from 'react';

function App() {

useEffect(()=>{
  // speechToText()
  // initializeGoogleGemini()
},[])

// const initializeGoogleGemini =  async () => {
//  const genAI = new GoogleGenerativeAI('');
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// const prompt = "Write a story about a magic backpack.";

// const result = await model.generateContent(prompt);
// console.log(result.response.text());
// }

// const speechToText = async () => {
//   const fileManager = new GoogleAIFileManager(process.env.API_KEY);
//   const uploadResult = await fileManager.uploadFile(
//     `./media/intro.mp3`,
//     {
//       mimeType: "audio/mp3",
//       displayName: "Audio sample",
//     },
//   );
//   let file = await fileManager.getFile(uploadResult.file.name);
//   while (file.state === FileState.PROCESSING) {
//     process.stdout.write(".");
//     await new Promise((resolve) => setTimeout(resolve, 10_000));
//     file = await fileManager.getFile(uploadResult.file.name);
//   }

//   if (file.state === FileState.FAILED) {
//     throw new Error("Audio processing failed.");
//   }
  
//   console.log(
//     `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`,
//   );
// }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
