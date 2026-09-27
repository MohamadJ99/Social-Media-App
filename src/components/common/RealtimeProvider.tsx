"use client";

import { useRealtimeConversations } from "@/hooks/useRealtimeConversations";

const RealtimeProvider = () => {
    useRealtimeConversations();

    return null;
};

export default RealtimeProvider;