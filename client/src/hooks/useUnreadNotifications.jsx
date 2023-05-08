const useUnreadNotifications = (notifications) => {
  return notifications?.filter((notif) => notif.isRead === false);
};

export default useUnreadNotifications;
