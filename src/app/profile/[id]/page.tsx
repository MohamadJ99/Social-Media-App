import Feed from "@/components/Feed";
import LeftMenu from "@/components/LeftMenu";
import RightMenu from "@/components/RightMenu";
import Image from "next/image";
import ProtectedRoute from "@/components/ProtectedRoute";

const ProfilePage = async ({params}:{
  params:Promise<{id:string}>
}) => {

  const { id } = await params;
  return (
    <ProtectedRoute>
    <div className="flex gap-6 pt-6">

    <div className="hidden xl:block w-[20%]"><LeftMenu type="profile"/></div>
    <div className="w-full lg:w-[70%] xl:w-[50%]">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center justify-center">
        <div className="w-full h-64 relative">
        <Image src="https://images.pexels.com/photos/34787094/pexels-photo-34787094.jpeg" alt="" fill className=" rounded-md object-cover" />
        <Image src="https://images.pexels.com/photos/30835516/pexels-photo-30835516.jpeg" alt="" width={128} height={128}className=" w-32 h-32 rounded-full absolute left-0 right-0 m-auto -bottom-16 ring-4 ring-white object-cover" />
        </div>
        <h1 className="mt-20 mb-4 text-2xl font-medium">Mohammad Jawad</h1>
        <div className="flex items-center justify-center gap-12 mb-4">
        <div className="flex flex-col items-center">
         <span className="font-medium">102</span>
         <span className="text-sm">Posts</span>
        </div>

        <div className="flex flex-col items-center">
         <span className="font-medium">6.2k</span>
         <span className="text-sm">Followers</span>
        </div>

        <div className="flex flex-col items-center">
         <span className="font-medium">30</span>
         <span className="text-sm">Following</span>
        </div>

        </div>
        </div>
       <Feed/>
      </div>
    </div>
    <div className="hidden lg:block w-[30%]"><RightMenu userId={id}/></div>


   </div>
   </ProtectedRoute>
  )
}

export default ProfilePage;