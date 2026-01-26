import { createContext, useContext, useState, ReactNode } from "react";

interface ChatConversation {
  id: string;
  customerName: string;
  customerEmail: string;
  topic: string;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
  status: "active" | "resolved" | "pending";
}

interface SupportChatContextType {
  conversations: ChatConversation[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
}

const initialConversations: ChatConversation[] = [
  {
    id: "1",
    customerName: "Nguyễn Văn A",
    customerEmail: "nguyenvana@gmail.com",
    topic: "Làm sao để theo dõi đơn hàng?",
    lastMessage: "Cảm ơn bạn đã hỗ trợ!",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    unread: true,
    status: "active",
  },
  {
    id: "2",
    customerName: "Trần Thị B",
    customerEmail: "tranthib@gmail.com",
    topic: "Chính sách đổi trả như thế nào?",
    lastMessage: "Tôi muốn đổi sản phẩm này",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    unread: true,
    status: "pending",
  },
  {
    id: "3",
    customerName: "Lê Văn C",
    customerEmail: "levanc@gmail.com",
    topic: "Có hỗ trợ mua sỉ không?",
    lastMessage: "Vâng, tôi sẽ liên hệ lại sau",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unread: false,
    status: "resolved",
  },
  {
    id: "4",
    customerName: "Phạm Thị D",
    customerEmail: "phamthid@gmail.com",
    topic: "Thời gian giao hàng mất bao lâu?",
    lastMessage: "Đơn hàng của tôi đã giao chưa?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    unread: false,
    status: "active",
  },
];

const SupportChatContext = createContext<SupportChatContextType | undefined>(undefined);

export const SupportChatProvider = ({ children }: { children: ReactNode }) => {
  const [conversations, setConversations] = useState<ChatConversation[]>(initialConversations);

  const unreadCount = conversations.filter((c) => c.unread).length;

  const markAsRead = (id: string) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === id ? { ...conv, unread: false } : conv
      )
    );
  };

  const markAsUnread = (id: string) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === id ? { ...conv, unread: true } : conv
      )
    );
  };

  return (
    <SupportChatContext.Provider value={{ conversations, unreadCount, markAsRead, markAsUnread }}>
      {children}
    </SupportChatContext.Provider>
  );
};

export const useSupportChat = () => {
  const context = useContext(SupportChatContext);
  if (!context) {
    throw new Error("useSupportChat must be used within a SupportChatProvider");
  }
  return context;
};
