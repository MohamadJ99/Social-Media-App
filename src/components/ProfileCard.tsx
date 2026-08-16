import Image from "next/image";

const ProfileCard = () => {
  return (
    <div className=" flex flex-col gap-6 p-4 bg-white rounded-lg shadow-md text-sm">
    <div className="h-20 relative">
    <Image src="https://images.pexels.com/photos/34787094/pexels-photo-34787094.jpeg" alt="" fill className="rounded-md object-cover"/>
    <Image src="https://images.pexels.com/photos/30835516/pexels-photo-30835516.jpeg" alt="" width={48} height={48} className="rounded-full w-12 h-12 object-cover absolute left-0 right-0 m-auto -bottom-6 ring-1 ring-white z-10 "/>
    </div>
    <div className="h-20 flex flex-col gap-2 items-center">
    <span className="font-semibold">mohammad Jawad</span>
    <div className="flex items-center gap-4">
     <div className="flex">
    <Image src="https://images.pexels.com/photos/30835516/pexels-photo-30835516.jpeg" alt="" width={12} height={12} className="rounded-full w-3 h-3"/>
    <Image src="https://images.pexels.com/photos/30835516/pexels-photo-30835516.jpeg" alt="" width={12} height={12} className="rounded-full w-3 h-3"/>
    <Image src="https://images.pexels.com/photos/30835516/pexels-photo-30835516.jpeg" alt="" width={12} height={12} className="rounded-full w-3 h-3"/>
     </div>
     <span className="text-xs text-gray-500">600 Followers</span>
    </div>
    <button className="bg-blue-500 text-white text-xs p-2 rounded-md">My Profile</button>
    </div>

    </div>
  )
}

export default ProfileCard;