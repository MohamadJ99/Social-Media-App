"use client";

import {
  useMarkNotificationAsRead,
  useNotifications,
  useUnreadNotificationsCount,
} from "@/hooks/useNotifications";

const Notifications = () => {
  const { data, isLoading, isError } = useNotifications();
  const { data: unreadData } = useUnreadNotificationsCount();
  const { mutate: markAsRead } = useMarkNotificationAsRead();

  const notifications = data?.data ?? [];
  const unreadCount = unreadData?.count ?? 0;

  const handleNotificationClick = (
    notificationId: number,
    readAt: string | null,
  ) => {
    if (!readAt) {
      markAsRead(notificationId);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-gray-500">
        Loading notifications...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-sm text-red-500">
        Failed to load notifications.
      </div>
    );
  }

  return (
    <div className="w-full max-w-96 mx-auto rounded-lg bg-white shadow-lg">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="font-semibold text-gray-800">
          Notifications
        </h2>

        {unreadCount > 0 && (
          <span className="rounded-full bg-red-500 px-2 py-1 text-xs text-white">
            {unreadCount}
          </span>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="p-4 text-center text-sm text-gray-500">
            No notifications
          </p>
        ) : (
          notifications.map((notification) => (
            <button
              key={notification.id}
              type="button"
              onClick={() =>
                handleNotificationClick(
                  notification.id,
                  notification.read_at,
                )
              }
              className={`w-full border-b px-4 py-3 text-left transition hover:bg-gray-50 ${
                !notification.read_at ? "bg-gray-100" : "bg-white"
              }`}
            >
              <p className="text-sm text-gray-800">
                {notification.message}
              </p>

              <span className="mt-1 block text-xs text-gray-400">
                {new Date(notification.created_at).toLocaleString()}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
