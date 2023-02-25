import React from "react";
import { toast } from "react-hot-toast";

import { getTheme } from "../styles/theme";

const NOTIFICATION_DURATION = 8000;
const SHORT_NOTIFICATION_DURATION = 4000;

type NotificationType = "success" | "error" | "loading";

const theme = getTheme("dark");
const notificationOptions = {
  duration: NOTIFICATION_DURATION,
};

/**
 * Notify the user with a toast component.
 *
 * @param id The id of the notification (Optional)
 * @param content The content of the notification
 * @param type The type of the notification (Optional)
 * @param style CSS properties to apply to notification (Optional)
 */
export function notify({
  id,
  content,
  type,
  style,
  shortDuration,
}: {
  id?: string;
  content: React.ReactNode;
  type?: NotificationType;
  style?: React.CSSProperties;
  shortDuration?: boolean;
}) {
  const duration = shortDuration
    ? SHORT_NOTIFICATION_DURATION
    : NOTIFICATION_DURATION;
  if (type === "success") {
    return toast.success(content as string, {
      ...notificationOptions,
      id,
      style: {
        ...style,
        border: `2px solid ${theme.palette.success}`,
      },
      duration,
    });
  } else if (type === "error") {
    return toast.error(content as string, {
      ...notificationOptions,
      id,
      style: {
        ...style,
        border: `2px solid ${theme.palette.error}`,
      },
      duration,
    });
  } else if (type === "loading") {
    return toast.loading(content as string, {
      ...notificationOptions,
      id,
      style,
      duration,
    });
  }

  return toast(content as string, {
    ...notificationOptions,
    id,
    style,
    duration,
  });
}

/**
 * Remove a notification by id.
 *
 * @param id The id of the notification
 */
export const removeNotification = toast.dismiss;

// export const notifyAsync = toast.promise;
