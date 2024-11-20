 const Category = ({selectTranslateCategory, text, type}) => {
 
    return <div onClick={()=>selectTranslateCategory(type)} className='w-1/2 text-center self-center border border-gray-100 p-5 py-10 m-2 rounded-xl shadow-md cursor-pointer'>
    <p className='font-["Outfit"]'>{text}</p>
  </div>
}

export default Category