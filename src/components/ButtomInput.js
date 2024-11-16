import { Translator } from "../svg/translator"


export const BottomInput = ({inputText, inputToAI, step, text}) => {
    console.log("step",step)
    return <div class="relative flex px-2 justify-evenly">
    <div className='w-[85%]'>
      <textarea disabled={ step == 1 ? false: true }  placeholder='Enter text here...' onChange={(e)=>inputText(e.target.value)} value={text} type="search" id="default-search" class="w-full block p-2.5 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
    </div>
    <div onClick={inputToAI} className='w-[10%] cursor-pointer justify-items-center self-center px-2  py-2.5 bg-blue-100 rounded-full'>
      <Translator/>         
    </div>
  </div>

}