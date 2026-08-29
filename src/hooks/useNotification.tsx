import { create } from "zustand";
import {v4 as uuidv4} from 'uuid';
import useConfig from "../config/useConfig";
import { useEffect, useState } from "react";

const NotificationItem = ({
  notification,
}: {
  notification: NotificationProps;
}) => {
  const { removeNotification } = useNotification();
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => removeNotification(notification), 300);
  };

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  useEffect(() => {
    if (notification.duration > 0) {
      const timer = setTimeout(() => handleRemove(), notification.duration);
      return () => clearTimeout(timer);
    }
  }, []);

  let alert = "";
  switch (notification.type) {
    case "info":
      alert = "bg-info/15 text-info border-l-6";
      break;
    case "success":
      alert = "bg-success/15 text-success border-l-6";
      break;
    case "warning":
      alert = "bg-warning/15 text-warning border-l-6";
      break;
    case "error":
      alert = "bg-error/15 text-error border-l-6";
      break;
  }

  return (
    <div className={`bg-base-200 rounded transition-all duration-300 ${isRemoving ? "translate-x-full opacity-0" : isVisible ? "opacity-100 translate-y-0" : "-translate-y-full opacity-0"}`}>
      <div role="alert" className={`min-w-full lg:min-w-xs pointer-events-auto flex items-center gap-3 px-4 py-3 rounded shadow-sm ${alert}`}>
        <span className="shrink-0">{getIconForNotificationItemType(notification.type)}</span>
        <span className="flex-1 text-sm font-medium">{notification.message}</span>
        <button className="shrink-0 ml-auto rounded-full p-1 hover:bg-black/10" onClick={handleRemove}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="w-4 h-4 fill-neutral-400">
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const getIconForNotificationItemType = (type: string) => {
  switch (type) {
    case "info": {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="h-6 w-6 shrink-0 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      );
    }
    case "success": {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    }
    case "warning": {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      );
    }
    case "error": {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    }
    default: {
      return <></>;
    }
  }
};

const NotificationContainer = () => {
    const { notifications } = useNotification()
    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-start pointer-events-none z-40">
            <div className="flex flex-col gap-2 p-5 w-full z-50 items-end mt-16">
                { 
                    notifications.map((n) => 
                        <NotificationItem key={n.id} notification={n}/>
                    )
                }
            </div>
        </div>
    )
}

export type NotificationProps = {
    id: string
    type: 'info' | 'warning' | 'success' | 'error'
    duration: number
    message: string
}

type NotificationState = {
    notifications: NotificationProps[]
    showInfo: (msg: string) => void
    showWarning: (msg: string) => void
    showError: (msg: string) => void
    showSuccess: (msg: string) => void

    removeNotification: (n: NotificationProps) => void
    clearNotifications: () => void

    NotificationContainer: () => React.JSX.Element
}

const useNotification = create<NotificationState>((set) => ({
    notifications: [],
    showInfo: (msg: string) => set((state) => ({ notifications: [{id: uuidv4(), type: "info", duration: useConfig().NOTIFICATION_DURATION_INFO, message: msg}, ...state.notifications]})),
    showWarning: (msg: string) => set((state) => ({ notifications: [{id: uuidv4(), type: "warning", duration: useConfig().NOTIFICATION_DURATION_WARNING, message: msg}, ...state.notifications]})),
    showError: (msg: string) => set((state) => ({ notifications: [{id: uuidv4(), type: "error", duration: useConfig().NOTIFICATION_DURATION_ERROR, message: msg}, ...state.notifications]})),
    showSuccess: (msg: string) => set((state) => ({ notifications: [{id: uuidv4(), type: "success", duration: useConfig().NOTIFICATION_DURATION_SUCCESS, message: msg}, ...state.notifications]})),
    removeNotification: (n: NotificationProps) => set((state) => ({ notifications:  state.notifications.filter(current => current !== n)})),
    clearNotifications: () => set({notifications: []}),
    NotificationContainer: NotificationContainer
}))

export default useNotification
