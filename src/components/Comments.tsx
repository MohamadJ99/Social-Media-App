import Image from "next/image";

const Comments = () => {
  return (
    <div className="">
         {/* WRITE */}
        <div className="flex items-center gap-4">
            <Image src="https://images.pexels.com/photos/30299053/pexels-photo-30299053.jpeg" alt="" width={32} height={32} className="w-8 h-8 rounded-full"/>
            <div className=" flex-1 flex items-center justify-between bg-slate-100 rounded-xl text-sm px-6 py-2 w-full">
             <input type="text" placeholder="Write a comment..." className="bg-transparent outline-none flex-1"/>
             <Image src="/emoji.png" alt="" width={16} height={16} className="cursor-pointer"/>
            </div>
        </div>

        {/* COMMENTS */}
        <div className="">
            {/* COMMENT */}
            <div className="flex gap-4 justify-between mt-6">
              {/* AVATAR */}
              <Image src="https://images.pexels.com/photos/30299053/pexels-photo-30299053.jpeg" alt="" width={40} height={40} className="w-10 h-10 rounded-full"/>
                {/* DESC */}
              <div className="flex flex-col gap-2 flex-1">
              <span className="font-medium">Samer Ahmad</span>
              <p className="">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                 Consequatur itaque fugit quidem et quibusdam veritatis incidunt perspiciatis laudantium necessitatibus,
                  reiciendis deleniti repellat debitis sit quis? Autem eveniet praesentium tempora nulla?
              </p>
              <div className="flex items-center gap-8 text-xs text-gray-500 mt-2">
              <div className="flex items-center gap-4">
               <Image src="/like.png" alt="" width={12} height={12} className="cursor-pointer w-4 h-4"/>
               <span className="text-gray-300">|</span>
               <span className="text-gray-500">5 Likes</span>
              </div>
              <div className="">Replay</div>
              </div>

              </div>
                {/* ICON */}
              <Image src="/more.png" alt="" width={16} height={16} className="cursor-pointer w-4 h-4"/>
            </div>
        </div>
    </div>
  )
}

export default Comments;