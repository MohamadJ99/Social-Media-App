import Image from "next/image";
import Comments from "./Comments";

type PostType = {
  id: number;
  user_id: number;
  content: string;
  image: string | null;
  created_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
};

type PostProps = {
  post: PostType;
};

const Post = ({ post }: PostProps) => {

  const imageUrl = post.image
    ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${post.image}`
    : null;

  return (
    <div className="flex flex-col gap-4">

      {/* USER */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          <Image
            src="https://images.pexels.com/photos/1311311/pexels-photo-1311311.jpeg"
            alt=""
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
          />

          <span className="font-medium">
            {post.user.name}
          </span>

        </div>

        <Image
          src="/more.png"
          alt=""
          width={16}
          height={16}
        />

      </div>

      {/* CONTENT */}
      <div className="flex flex-col gap-4">

        {post.image && (
          <div className="relative w-full h-96">
            <Image
              src={imageUrl}
              alt=""
              fill
              unoptimized
              className="object-cover rounded-md"
            />
          </div>
        )}

        <p>
          {post.content}
        </p>

      </div>

      {/* INTERACTION */}
      <div className="flex items-center justify-between text-sm my-4">

        <div className="flex gap-8">

          <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">

            <Image
              src="/like.png"
              alt=""
              width={16}
              height={16}
              className="cursor-pointer"
            />

            <span className="text-gray-300">|</span>

            <span className="text-gray-500">
              123{" "}
              <span className="hidden md:inline">
                Likes
              </span>
            </span>

          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">

            <Image
              src="/comment.png"
              alt=""
              width={16}
              height={16}
              className="cursor-pointer"
            />

            <span className="text-gray-300">|</span>

            <span className="text-gray-500">
              20{" "}
              <span className="hidden md:inline">
                Comments
              </span>
            </span>

          </div>

        </div>

        <div className="flex items-center gap-4 bg-slate-100 p-2 rounded-xl">

          <Image
            src="/share.png"
            alt=""
            width={16}
            height={16}
            className="cursor-pointer"
          />

          <span className="text-gray-300">|</span>

          <span className="text-gray-500">
            4{" "}
            <span className="hidden md:inline">
              Shares
            </span>
          </span>

        </div>

      </div>

      <Comments />

    </div>
  );
};

export default Post;