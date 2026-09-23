"use client";

import {
    useCallback,
} from "react";

import {
    useQueryClient,
    type InfiniteData,
} from "@tanstack/react-query";

import type {
    Message,
    MessagesPage,
} from "@/api/messages";

export const useAddRealtimeMessage = (
    conversationId: number
) => {
    const queryClient = useQueryClient();

    return useCallback(
        (message: Message) => {
            queryClient.setQueryData<
                InfiniteData<MessagesPage>
            >(
                ["messages", conversationId],
                (oldData) => {
                    if (!oldData) {
                        return oldData;
                    }

                    return {
                        ...oldData,

                        pages: oldData.pages.map(
                            (page, index) => {
                                if (index !== 0) {
                                    return page;
                                }

                                return {
                                    ...page,

                                    data: [
                                        message,
                                        ...page.data,
                                    ],
                                };
                            }
                        ),
                    };
                }
            );
        },
        [queryClient, conversationId]
    );
};