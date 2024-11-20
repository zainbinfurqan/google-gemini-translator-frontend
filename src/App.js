import './App.css';
import { GoogleGenerativeAI } from '@google/generative-ai'
import { useEffect, useRef, useState } from 'react';
import { Cross } from './svg/cross';
import { Translator } from './svg/translator';
import { Attachment } from './svg/attachment';
import { BottomInput } from './components/ButtomInput';
import { BottomFileSelector } from './components/BottomFileSelector';
import ChatMessage from './components/ChatMessage';
import Category from './components/Category';
import Reset from './components/Reset';
// import {fetch} from './middleware/fetch';

function App() {

  const [userChat, setUserChat] = useState([])
  const [translateVia, setTranslateVia] = useState(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState('')
  const [text, setText] = useState('');
  const [isLoadingChat, setIslLoadingChat] = useState(false)
  const [file, setFile] = useState(null);
  const messagesEndRef = useRef(null);

  const [step, setStep] = useState(0);
  const [chatInActive, setChatInActive] = useState(true);
  const [currentId, setCurrentId] = useState(0);

  const handleFileChange = async (e) => {
    console.log("e.target.files[0].name.split('.')[-1]",e.target.files[0].name.split('.')[e.target.files[0].name.split('.').length - 1])
      if (e && e.target.files && e.target.files[0].name.split('.')[e.target.files[0].name.split('.').length - 1] == 'mp3') {
      console.log("e.target.files",e.target.files[0].name)
      setFile(e.target.files);
      uploadVideos(e.target.files)
  }
  };

  const uploadVideos =  async(files) => {
    const formData = new FormData();
    
    formData.append("file", files[0]);
    formData.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);

    const cloudinaryResponse  = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_USERNAME}/video/upload`,{
      method: "POST",
      body: formData,
    })
    const response = await cloudinaryResponse.json()
    handleTranslateThroughFile(files[0].name, response.secure_url)
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView(
        {
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        })
    }
  }, [userChat]);

  useEffect(()=>{
    if(isLoadingChat){
      const newChat = [...userChat,{hasLoading:true, user:'other',message:'Processing...'}]
      setUserChat(newChat)
    }
    if(!isLoadingChat){
      const newChat = userChat.filter(item => !item.hasLoading);
      setUserChat(newChat)
    }
  },[isLoadingChat])

  const handleTranslateThroughFile = async (fileName,url) => {
    if(step === 1){
      setUploadedVideoUrl(url)
      setUserChat((previous)=>[...previous,{ id:currentId+1, user:'you',message:text},{user:'other',message:`in which language you want to translate file ${fileName}`, inputFlag:'true'}])
      setCurrentId(currentId+1)
       setStep(step+1)
    }
  }

  const inputToAI = async () => {
    setUserChat((previous)=>[...previous,{ id:currentId+1, user:'you', message:text },{ user:'other', message:'in which language you want to translate', inputFlag:'true' }])
    setText('')
    setCurrentId(currentId+1)
  }

  const getTranslationFromAI = async (item,index) =>  {
    setIslLoadingChat(true)
    let newChat = []
    if(translateVia === 'file') {
        const response = await fetch(`http://localhost:8888/api/hello?language=${item.language}&url=${uploadedVideoUrl}`) 
       const response_ = await response.json()
        newChat = [...userChat,{user:'other',message:response_}]
        userChat[index].inputFlag = false
      }
       else{
        try {
          const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_GEMINI_KEY);
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
          const prompt = `convert this text ${userChat.filter(item=>item?.id && item.id === currentId)[0].message} to ${item.language} language `;
          const result = await model.generateContent(prompt);
          newChat = [...userChat,{user:'other',message:result.response.text()}]
          userChat[index].inputFlag = false
        } catch (error) {
          console.log("error",error.message)
          newChat = [...userChat,{user:'other',message:error}]
        }
      }
      setUserChat(newChat)
      setChatInActive(!chatInActive)
      setIslLoadingChat(false)
  }

  const selectTranslateCategory = async (category) => {
    setTranslateVia(category)
    setChatInActive(!chatInActive)
    setStep(1)
  }

  return (
    <div className="flex justify-center items-center h-screen"> 
      <div className="w-[80%] h-[80%] bg-white border border-gray-100 rounded-lg shadow dark:bg-gray-800 dark:border-gray-100 mt-4">
        <div className='h-[88%] overflow-scroll flex flex-col'>
          <div className='w-fit'>
            {translateVia != null && <p onClick={()=>{
              setUserChat([])
              setTranslateVia(null)}
            } className='font-["Outfit"] p-1 px-3h-fit m-2 cursor-pointer rounded-lg'>
            <Cross/>
            </p>}
          </div>
        {/* This part of the code is conditionally rendering a section based on the value of the `translateVia` state variable. */}
        {translateVia === null && 
          <div className='flex w-full h-full'>
            <Category selectTranslateCategory={selectTranslateCategory} text='Translate via text' type='text' />
            <Category selectTranslateCategory={selectTranslateCategory} text='Translate via audio file' type='file' />
          </div>
          }
          {/* This part of the code in the `App` component is responsible for rendering the chat
          messages and additional components based on certain conditions. Here's a breakdown of what
          it does: */}
          <div className=' flex-row overflow-scroll py-10 ' ref={messagesEndRef}>
            {userChat.map((item,index)=>{
              return(
                <ChatMessage item={item} userChat={userChat} setUserChat={setUserChat} getTranslationFromAI={getTranslationFromAI} index={index}/>)
            })}
            <div ref={messagesEndRef}></div>
            {chatInActive && translateVia != null && userChat.length >0 && <Reset chatInActive={chatInActive} setChatInActive={setChatInActive} setFile={setFile} setStep={setStep} />}
          </div>
        </div>

        {/* This part of the code is conditionally rendering a section based on the value of the
        `translateVia` state variable. */}
        {translateVia != null && 
        <div className='h-[12%] content-center'>
          {translateVia === 'file' && 
            <BottomFileSelector handleFileChange={handleFileChange} step={step} file={file}/>}
          {translateVia === 'text' && 
            <BottomInput inputText={setText} inputToAI={inputToAI} step={step} text={text}/>}
        </div>}
      </div>
    </div>
  );
}

export default App;
