"use client";

import { useCallback, useState } from "react";

import { useMessages } from "@/hooks/useMessages";
import { useAuth } from "@/context/AuthContext";
import { sendMessage } from "@/api/messages";
import {
    useConversationChannel,
    type RealtimeMessage,
} from "@/hooks/useConversationChannel";
import { useAddRealtimeMessage } from "@/hooks/useAddRealtimeMessage";

type ChatProps = {
    conversationId: number;
};

const Chat = ({ conversationId }: ChatProps) => {
    const { token, user } = useAuth();

    const [message, setMessage] = useState("");

    const {
        data,
        isLoading,
        isError,
    } = useMessages(conversationId);

    const addRealtimeMessage =
        useAddRealtimeMessage(conversationId);

    const messages =
        data?.pages
            .flatMap((page) => page.data)
            .reverse() ?? [];

          

    const handleSend = async () => {
        if (!token || !message.trim()) {
            return;
        }

        try {
            await sendMessage(
                token,
                conversationId,
                message.trim()
            );

            setMessage("");
        } catch (error) {
            console.error(
                "Failed to send message:",
                error
            );
        }
    };

    const handleRealtimeMessage = useCallback(
        (message: RealtimeMessage) => {
            addRealtimeMessage(message);
        },
        [addRealtimeMessage]
    );

    useConversationChannel({
        conversationId,
        onMessage: handleRealtimeMessage,
    });

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                Loading messages...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex h-full items-center justify-center">
                Failed to load messages.
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.map((item) => (
                    <div
                        key={item.id}
                        className={
                            item.user?.id === user?.id
                                ? "ml-auto w-fit max-w-[70%]"
                                : "mr-auto w-fit max-w-[70%]"
                        }
                    >
                        <div className="rounded-lg bg-gray-100 px-4 py-2">
                            {item.body}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-2 border-t p-4">
                <input
                    value={message}
                    onChange={(e) =>
                        setMessage(e.target.value)
                    }
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSend();
                        }
                    }}
                    placeholder="Write a message..."
                    className="flex-1 rounded-lg border px-4 py-2"
                />

                <button
                    onClick={handleSend}
                    disabled={!message.trim()}
                    className="rounded-lg bg-purple-600 px-5 py-2 text-white disabled:bg-purple-300"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;