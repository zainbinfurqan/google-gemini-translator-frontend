import './App.css';
import { GoogleGenerativeAI } from '@google/generative-ai'
import { useEffect, useRef, useState } from 'react';

function App() {

  const [userChat, setUserChat] = useState([])
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [translateVia, setTranslateVia] = useState(null);
  const [step, setStep] = useState(0);
  const [chatInActive, setChatInActive] = useState(true);
  const [currentId, setCurrentId] = useState(0);
  const [activeInputToGetTranslationLanguageIndex, setActiveInputToGetTranslationLanguageIndex] = useState(null)
  const [isLoadingChat, setIslLoadingChat] = useState(false)
  const messagesEndRef = useRef(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState('')

  const handleFileChange = async (e) => {
      if (e && e.target.files) {
      setFile(e.target.files);
      uploadVideos(e.target.files)
  }
  };

  const uploadVideos = (files) => {
    const formData = new FormData();

    formData.append("file", files[0]);
    formData.append("upload_preset", "an2dckm9");
    fetch("https://api.cloudinary.com/v1_1/zainahmed/video/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then( async (data) => {
        const resss = await fetch(data.secure_url)
        const blob = await resss.blob();
        const file = new File([blob], 'video.mp4', { type: blob.type });
      handleTranslateThroughFile(files[0].name, data.secure_url)
      });
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
      console.log("isLoadingChat false",newChat)
      setUserChat(newChat)
    }
  },[isLoadingChat])

  const translateText = async () => {
    const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `convert this text ${text} to spanish language `;

    const result = await model.generateContent(prompt);
    console.log(result.response.text());
  }

  const handleTranslateThroughFile = async (fileName,url) => {
    if(step === 1){
      setUploadedVideoUrl(url)
      setUserChat((previous)=>[...previous,{ id:currentId+1, user:'you',message:text},{user:'other',message:`in which language you want to translate file ${fileName}`, inputFlag:'true'}])
      setCurrentId(currentId+1)
       setStep(step+1)
    }
  }

  const handleTranslate = async (item,index) => {
    if(step === 1){
      setUserChat((previous)=>[...previous,{ id:currentId+1, user:'you',message:text},{user:'other',message:'in which language you want to translate', inputFlag:'true'}])
      setText('')
      setCurrentId(currentId+1)
    }
    if(step === 2){
      if(translateVia === 'file') {
      
        setIslLoadingChat(true)
      
        const req =  await fetch(`http://localhost:3001/speech-to-text?language=${item.language}&url=${uploadedVideoUrl}`)
        const res= await req.json()
        const newChat = [...userChat,{user:'other',message:res}]
        userChat[index].inputFlag = false
        
        setUserChat(newChat)
        setChatInActive(!chatInActive)
        setIslLoadingChat(false)
    }
      else{
        setIslLoadingChat(true)
        
        const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_GEMINI_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `convert this  ${userChat.filter(item=>item?.id && item.id === currentId)[0].message} to ${item.language} language `;
        const result = await model.generateContent(prompt);
        const newChat = [...userChat,{user:'other',message:result.response.text()}]
        
        userChat[index].inputFlag = false
        
        setUserChat(newChat)
        setChatInActive(!chatInActive)
        setIslLoadingChat(false)
      }
    }
    setStep(step+1)
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
            <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlSpace="preserve"
                width={24}
                height={24}
                viewBox="-230.3 -230.3 950.6 950.6"
              >
                <rect
                  width={950.6}
                  height={950.6}
                  x={-230.3}
                  y={-230.3}
                  fill="#dbe9fe"
                  strokeWidth={0}
                  rx={475.3}
                />
                <path d="M456.851 0 245 212.564 33.149 0 .708 32.337l211.961 212.667L.708 457.678 33.149 490 245 277.443 456.851 490l32.441-32.322-211.961-212.674L489.292 32.337z" />
              </svg>
            </p>}
          </div>
        {translateVia === null && 
          <div className='flex w-full h-full'>
            <div onClick={()=>{ 
              setTranslateVia('text')
              setChatInActive(!chatInActive)
              setStep(1)}} className='w-1/2 text-center self-center border border-gray-100 p-5 py-10 m-2 rounded-xl shadow-md cursor-pointer'>
              <p className='font-["Outfit"] '>Translate via text</p>
            </div>
            <div onClick={()=>{
              setTranslateVia('file')
              setChatInActive(!chatInActive)
              setStep(1)}} className='w-1/2 text-center self-center border border-gray-100 p-5 py-10 m-2 rounded-xl shadow-md cursor-pointer'>
              <p className='font-["Outfit"]'>Translate via audio file</p>
            </div>
          </div>
          }
          <div className=' flex-row overflow-scroll py-10 ' ref={messagesEndRef}>
            {userChat.map((item,index)=>{
              return(
                <div className={`flex ${item.user=== 'you' && 'justify-end'} ${item.user==='other' && 'justify-start'}`}>
                  <div className='flex row animate-[tada_1s_ease-in-out]'>
                  <p className={`font-["Outfit"] p-2 px-4 w-fit m-2 rounded-full`}>{item.message}</p>
                  {item.user=== 'other' && item?.inputFlag && item?.inputFlag && 
                  <div className='flex p-2 w-fit h-fit rounded-xl border border-gray-100  -ml-24 mt-10'>
                    <input type='text' placeholder='Enter text here' className='font-["Outfit"] border-0 outline-none' value={userChat[index].language} onChange={(e)=>{
                      const newChat = [...userChat]
                      newChat[index].language = e.target.value
                      setUserChat(newChat)
                    }} />
                    <svg
                      onClick={item?.inputFlag && item?.inputFlag ? ()=>handleTranslate(item,index): ()=>{}}
                      width={20}
                      height={20}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <g
                        stroke="#292D32"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                      >
                        <path d="m19.06 18.67-2.14-4.27-2.14 4.27M15.17 17.91h3.52" />
                        <path d="M16.92 22a5.08 5.08 0 1 1 .001-10.162A5.08 5.08 0 0 1 16.92 22ZM5.02 2h3.92c2.07 0 3.07 1 3.02 3.02v3.92c.05 2.07-.95 3.07-3.02 3.02H5.02C3 12 2 11 2 8.93V5.01C2 3 3 2 5.02 2ZM9.01 5.85H4.95M6.969 5.17v.68" />
                        <path d="M7.99 5.84c0 1.75-1.37 3.17-3.05 3.17" />
                        <path d="M9.01 9.01c-.73 0-1.39-.39-1.85-1.01" />
                        <path
                          d="M2 15c0 3.87 3.13 7 7 7l-1.05-1.75M22 9c0-3.87-3.13-7-7-7l1.05 1.75"
                          opacity={0.4}
                        />
                      </g>
                    </svg>
                    </div>}
                  </div>
                 
                </div>
              )
            })}
            <div ref={messagesEndRef}></div>
            {chatInActive && translateVia != null && userChat.length >0 && <p onClick={()=>{
              setChatInActive(!chatInActive)
              setFile(null)
              setStep(1)}} className='font-["Outfit"] justify-self-center text-xs cursor-pointer text-center px-4 p-2 border border-gray-100 w-fit rounded-full'>want to translate more?</p>}
          </div>
         
        </div>
        {translateVia != null && <div className='h-[12%] content-center'>
          {translateVia === 'file' && <div className='h-[40%] py-1 px-2 content-center flex justify-end cursor-pointer'>
            <div className='p-1 px-2 bg-blue-100 w-fit rounded-full flex self-center cursor-pointer'>
            <input disabled={ step == 1 ? false: true } id="file" type="file" value={file? file.name: ''} onChange={(e)=>handleFileChange(e)} className='cursor-pointerfont-["Outfit"] opacity-0 relative w-5 z-10' />
              <svg
              className='cursor-pointer absolute my-1'
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                viewBox="-2.8 -2.8 33.6 33.6"
                >
                <title>{"attachment 2"}</title>
                <path
                  fill="#000"
                  fillRule="evenodd"
                  strokeWidth={0}
                  d="M26.562 10.181 12.325 24.26c-2.359 2.333-6.184 2.333-8.543 0a5.926 5.926 0 0 1 0-8.447L16.596 3.141a4.06 4.06 0 0 1 5.695 0 3.951 3.951 0 0 1 0 5.631L9.477 21.444a2.03 2.03 0 0 1-2.848 0 1.976 1.976 0 0 1 0-2.816L18.02 7.365l-1.424-1.408-11.39 11.264a3.95 3.95 0 0 0 0 5.632 4.06 4.06 0 0 0 5.695-.001l12.813-12.671a5.927 5.927 0 0 0 .001-8.448c-2.36-2.333-6.184-2.333-8.543 0L1.646 15.108l.05.049a7.896 7.896 0 0 0 .662 10.511c2.904 2.871 7.47 3.086 10.629.655l.049.049 14.95-14.783-1.424-1.408"
                />
             </svg>
          </div>
          </div>}
          {translateVia === 'text' && <div class="relative flex px-2 justify-evenly">
            <div className='w-[85%]'>
              <textarea disabled={ step == 1 ? false: true }  placeholder='Enter text here...' onChange={(e)=>setText(e.target.value)} value={text} type="search" id="default-search" class="w-full block p-2.5 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
            </div>
            <div onClick={handleTranslate} className='w-[10%] cursor-pointer justify-items-center self-center px-2  py-2.5 bg-blue-100 rounded-full'>
              <svg
                width={20}
                height={20}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <g
                  stroke="#292D32"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                >
                  <path d="m19.06 18.67-2.14-4.27-2.14 4.27M15.17 17.91h3.52" />
                  <path d="M16.92 22a5.08 5.08 0 1 1 .001-10.162A5.08 5.08 0 0 1 16.92 22ZM5.02 2h3.92c2.07 0 3.07 1 3.02 3.02v3.92c.05 2.07-.95 3.07-3.02 3.02H5.02C3 12 2 11 2 8.93V5.01C2 3 3 2 5.02 2ZM9.01 5.85H4.95M6.969 5.17v.68" />
                  <path d="M7.99 5.84c0 1.75-1.37 3.17-3.05 3.17" />
                  <path d="M9.01 9.01c-.73 0-1.39-.39-1.85-1.01" />
                  <path
                    d="M2 15c0 3.87 3.13 7 7 7l-1.05-1.75M22 9c0-3.87-3.13-7-7-7l1.05 1.75"
                    opacity={0.4}
                  />
                </g>
              </svg>          
            </div>
          </div> }
        </div>}
      </div>
    </div>
  );
}

export default App;
