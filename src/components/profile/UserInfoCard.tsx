import Image from "next/image";
import Link from "next/link";
import type { User } from "@/types/user";
import { useSendFriendRequest } from "@/hooks/useSendFriendRequest";


type UserInfoCardProps = {
    user: User;
    isOwnProfile: boolean;
};

const UserInfoCard = ({ user, isOwnProfile }: UserInfoCardProps) => {
    const { mutate: sendRequest, isPending } = useSendFriendRequest();
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
                    <span className="text-xl text-black">{user.name}</span>
                    <span className="text-sm">@{user.username}</span>
                </div>
                <p>{user.bio || " "}</p>


                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <Image src="/link.png" alt="" width={16} height={16} />
                        <Link href="https://mj.dev" className="text-blue-500 font-medium">
                            mj.dev
                        </Link>
                    </div>
                    <div className="flex items-center gap-1">
                        <Image src="/date.png" alt="" width={16} height={16} />
                        <span>Joined Jul 2023</span>
                    </div>
                </div>
                {!isOwnProfile && (
                    <>
                        {user.friendship?.status === "accepted" ? (
                            <button
                                className="bg-red-500 text-white text-sm rounded-md p-2"
                            >
                                Remove Friend
                            </button>
                        ) : user.friendship?.status === "pending" ? (
                            <button
                                disabled
                                className="bg-gray-400 text-white text-sm rounded-md p-2 cursor-not-allowed"
                            >
                                Request Sent
                            </button>
                        ) : (
                            <button
                                onClick={() => sendRequest(user.id)}
                                disabled={isPending}
                                className="bg-blue-500 text-white text-sm rounded-md p-2 disabled:opacity-50"
                            >
                                {isPending ? "Sending..." : "Add Friend"}
                            </button>
                        )}
                    </>
                )}
                <span className="text-red-400 self-end text-xs cursor-pointer">Block User</span>
            </div>

        </div>
    )
}

export default UserInfoCard;