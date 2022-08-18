import { createContext, useState, useEffect } from "react";

const NotificationContext = createContext({
  notification: null,
  showNotification: function (notificationData) {},
  hideNotification: function () {},
});
export const NotificationContextProvider = ({ children }) => {
  const [notification, setNotification] = useState();

  useEffect(() => {
    if (
      notification &&
      (notification.status === "success" || notification.status == "error")
    ) {
      const timer = setTimeout(() => {
        hideNotificationHandler();
      }, 3000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [notification]);
  function showNotificationHandler(notificationData) {
    setNotification(notificationData);
  }
  function hideNotificationHandler() {
    setNotification(null);
  }
  const context = {
    notification,
    showNotification: showNotificationHandler,
    hideNotification: hideNotificationHandler,
  };
  return (
    <NotificationContext.Provider value={context}>
      {children}
    </NotificationContext.Provider>
  );
};
export default NotificationContext;
