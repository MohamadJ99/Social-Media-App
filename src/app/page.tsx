import AddPost from "@/components/post/AddPost";
import Feed from "@/components/post/Feed";
import LeftMenu from "@/components/layout/LeftMenu";
import RightMenu from "@/components/layout/RightMenu";
import Stories from "@/components/stories/Stories";
import ProtectedRoute from "@/components/common/ProtectedRoute";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <div className="flex gap-6 pt-6">

        <div className="hidden xl:block w-[20%]"><LeftMenu type="home" /></div>
        <div className="w-full lg:w-[70%] xl:w-[50%]">
          <div className="flex flex-col gap-6">
            <Stories />
            <AddPost />
            <Feed />
          </div>
        </div>
        <div className="hidden lg:block w-[30%]"><RightMenu /></div>


      </div>
    </ProtectedRoute>
  );
}
