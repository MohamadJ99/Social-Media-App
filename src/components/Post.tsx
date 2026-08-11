import Image from "next/image";
import Comments from "./Comments";

const Post = () => {
  return (
    <div className="flex flex-col gap-4">
    
    {/* USER */}
    <div className="flex items-center justify-between">
     <div className="flex items-center gap-4">
     <Image src="https://images.pexels.com/photos/1311311/pexels-photo-1311311.jpeg" alt="" width={40} height={40} className="w-10 h-10 rounded-full"/>
     <span className="font-medium">Nasser Jehad</span>
     </div>
     <Image src="/more.png" alt="" width={16} height={16} />
    </div>

    {/* DESC */}
    <div className="flex flex-col gap-4">
     <div className="w-full min-h-96 relative">
      <Image src="https://images.pexels.com/photos/19900476/pexels-photo-19900476.jpeg" alt="" fill className="object-cover rounded-md"/>
     </div>
     <p>
       Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
       Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
         Excepteur sint occaecat cupidatat non proident,
         sunt in culpa qui officia deserunt mollit anim id est laborum.
     </p>
    </div>

    {/* INTERACTION */}
    <div className="flex items-center justify-between text-sm my-4">
     <div className="flex gap-8">
        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
            <Image src="/like.png" alt="" width={16} height={16} className="cursor-pointer"/>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">123 <span className="hidden md:inline">Likes</span></span>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
            <Image src="/comment.png" alt="" width={16} height={16} className="cursor-pointer"/>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">20 <span className="hidden md:inline">Comments</span></span>
        </div>

     </div>
     <div className="">
     <div className="flex items-center gap-4 bg-slate-100 p-2 rounded-xl">
            <Image src="/share.png" alt="" width={16} height={16} className="cursor-pointer"/>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">4 <span className="hidden md:inline">Shares</span></span>
        </div>

     </div>
    </div>

   <Comments/>
    </div>
  )
}

export default Post;