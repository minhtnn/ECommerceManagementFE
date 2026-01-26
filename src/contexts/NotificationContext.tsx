import { createContext, useContext, useState, ReactNode } from "react";

interface Notification {
  id: string;
  type: "order" | "admin" | "customer";
  title: string;
  description: string;
  timestamp: Date;
  isRead: boolean;
  referenceId: string;
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "order",
    title: "Đơn hàng mới #DH001",
    description: "Khách hàng Nguyễn Văn A đã đặt 3 sản phẩm",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    isRead: false,
    referenceId: "DH001",
  },
  {
    id: "2",
    type: "customer",
    title: "Khách hàng mới đăng ký",
    description: "Trần Thị B vừa tạo tài khoản mới",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    isRead: false,
    referenceId: "KH002",
  },
  {
    id: "3",
    type: "order",
    title: "Đơn hàng mới #DH002",
    description: "Khách hàng Lê Văn C đã đặt 5 sản phẩm",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    isRead: false,
    referenceId: "DH002",
  },
  {
    id: "4",
    type: "admin",
    title: "Admin mới được thêm",
    description: "Phạm Văn D được thêm làm quản trị viên",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    isRead: true,
    referenceId: "AD001",
  },
  {
    id: "5",
    type: "customer",
    title: "Khách hàng mới đăng ký",
    description: "Hoàng Thị E vừa tạo tài khoản mới",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: true,
    referenceId: "KH003",
  },
  {
    id: "6",
    type: "order",
    title: "Đơn hàng mới #DH003",
    description: "Khách hàng Võ Văn F đã đặt 2 sản phẩm",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    isRead: true,
    referenceId: "DH003",
  },
];

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

export type { Notification };
