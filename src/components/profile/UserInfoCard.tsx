import Image from "next/image";
import Link from "next/link";

const UserInfoCard = ({ userId }: { userId: string }) => {
    return (
        <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">

            {/* TOP */}
            <div className="flex items-center justify-between font-medium">
                <span className="text-gray-500">User Information</span>
                <Link href="/" className="text-blue-500 text-xs">See all</Link>
            </div>

            {/* Bottom */}
            <div className="flex flex-col gap-4 text-gray-500">
                <div className="flex items-center gap-2">
                    <span className="text-xl text-black">Mohammad Jawad</span>
                    <span className="text-sm">@mohammad991</span>
                </div>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa minus iste totam perspiciatis dolorem</p>
                <div className="flex items-center gap-2">
                 <Image src="/map.png" alt="" width={16} height={16}/>
                 <span>Living in <b>Sint Maarten</b></span>
                </div>

                <div className="flex items-center gap-2">
                 <Image src="/school.png" alt="" width={16} height={16}/>
                 <span>Went to <b>St.Maartenschool</b></span>
                </div>

                <div className="flex items-center gap-2">
                 <Image src="/work.png" alt="" width={16} height={16}/>
                 <span>Works at <b>Samsung</b></span>
                </div>
               <div className="flex items-center justify-between">
               <div className="flex items-center gap-1">
                <Image src="/link.png" alt="" width={16} height={16}/>
                <Link href="https://mj.dev" className="text-blue-500 font-medium">
                mj.dev
                </Link>
               </div>
               <div className="flex items-center gap-1">
                <Image src="/date.png" alt="" width={16} height={16}/>
                <span>Joined Jul 2023</span>
               </div>
               </div>
               <button className="bg-blue-500 text-white text-sm rounded-md p-2">Follow</button>
               <span className="text-red-400 self-end text-xs cursor-pointer">Block User</span>
            </div>

        </div>
    )
}

export default UserInfoCard;