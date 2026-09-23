import Chat from "@/components/chat/Chat";

type PageProps = {
    params: Promise<{
        conversationId: string;
    }>;
};

const ChatPage = async ({ params }: PageProps) => {
    const { conversationId } = await params;

    return (
        <div className="h-screen">
            <Chat
                conversationId={Number(conversationId)}
            />
        </div>
    );
};

export default ChatPage;