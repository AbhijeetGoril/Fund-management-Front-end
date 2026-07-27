import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { BellIcon } from "@heroicons/react/24/outline";
import { axiosInstance } from "../../lib/axois";

const fetchNotifications = async () => {
  const { data } = await axiosInstance.get("/notification");
  return data;
};

const NotificationBell = () => {
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    refetchInterval: 30000, // poll every 30s so the badge stays fresh
  });

  const notifications = data?.notifications ?? [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <button
      onClick={() => navigate("/notifications")}
      className="relative p-2 rounded-lg hover:bg-base-200 transition-all duration-200"
      aria-label="Notifications"
    >
      <BellIcon className="h-6 w-6 text-base-content/70" />
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-error text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;