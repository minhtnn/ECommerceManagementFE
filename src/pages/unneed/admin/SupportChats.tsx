import AdminLayout from "@/components/admin/AdminLayout";
import { useState } from "react";
import { Search, Send, User, Clock, MessageCircle, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useSupportChat } from "@/contexts/SupportChatContext";

interface ChatMessage {
  id: string;
  content: string;
  sender: "customer" | "admin";
  timestamp: Date;
}

const mockMessages: Record<string, ChatMessage[]> = {
  "1": [
    { id: "1", content: "Xin chào, tôi muốn theo dõi đơn hàng của mình", sender: "customer", timestamp: new Date(Date.now() - 1000 * 60 * 10) },
    { id: "2", content: "Chào bạn! Bạn vui lòng cung cấp mã đơn hàng để tôi kiểm tra nhé.", sender: "admin", timestamp: new Date(Date.now() - 1000 * 60 * 8) },
    { id: "3", content: "Mã đơn hàng của tôi là #ORD123456", sender: "customer", timestamp: new Date(Date.now() - 1000 * 60 * 7) },
    { id: "4", content: "Đơn hàng của bạn đang được vận chuyển và dự kiến giao vào ngày mai.", sender: "admin", timestamp: new Date(Date.now() - 1000 * 60 * 6) },
    { id: "5", content: "Cảm ơn bạn đã hỗ trợ!", sender: "customer", timestamp: new Date(Date.now() - 1000 * 60 * 5) },
  ],
  "2": [
    { id: "1", content: "Tôi muốn hỏi về chính sách đổi trả", sender: "customer", timestamp: new Date(Date.now() - 1000 * 60 * 35) },
    { id: "2", content: "Chào bạn! Chúng tôi hỗ trợ đổi trả trong vòng 7 ngày nếu sản phẩm bị lỗi.", sender: "admin", timestamp: new Date(Date.now() - 1000 * 60 * 33) },
    { id: "3", content: "Tôi muốn đổi sản phẩm này", sender: "customer", timestamp: new Date(Date.now() - 1000 * 60 * 30) },
  ],
};

const SupportChats = () => {
  const { conversations, unreadCount, markAsRead } = useSupportChat();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState(conversations[0] || null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(mockMessages);
  const [unreadSheetOpen, setUnreadSheetOpen] = useState(false);

  const unreadConversations = conversations.filter((c) => c.unread);

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "admin",
      timestamp: new Date(),
    };

    setMessages((prev) => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), newMsg],
    }));
    setNewMessage("");
    
    // Mark conversation as read when admin sends a response
    markAsRead(selectedChat.id);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    return date.toLocaleDateString("vi-VN");
  };

  const getStatusBadge = (status: "active" | "resolved" | "pending") => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Đang hoạt động</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Chờ phản hồi</Badge>;
      case "resolved":
        return <Badge variant="secondary">Đã giải quyết</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="h-[calc(100vh-8rem)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Liên hệ & Hỗ trợ khách hàng</h1>
            <p className="text-muted-foreground">Quản lý các cuộc hội thoại với khách hàng</p>
          </div>
          <Sheet open={unreadSheetOpen} onOpenChange={setUnreadSheetOpen}>
            <SheetTrigger asChild>
              <Badge 
                variant="outline" 
                className="text-sm cursor-pointer hover:bg-muted transition-colors"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                {unreadCount} tin nhắn mới
              </Badge>
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px] sm:w-[450px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  Tin nhắn chưa phản hồi
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                {unreadConversations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Không có tin nhắn chưa phản hồi</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[calc(100vh-10rem)]">
                    <div className="space-y-3 pr-4">
                      {unreadConversations.map((conv) => (
                        <div
                          key={conv.id}
                          onClick={() => {
                            setSelectedChat(conv);
                            setUnreadSheetOpen(false);
                          }}
                          className="p-4 bg-primary/5 border border-primary/20 rounded-lg cursor-pointer hover:bg-primary/10 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-primary">
                                  {conv.customerName}
                                </span>
                                <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 animate-pulse" />
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {conv.customerEmail}
                              </p>
                              <p className="text-sm font-medium text-foreground mt-2 truncate">
                                {conv.topic}
                              </p>
                              <p className="text-sm text-muted-foreground truncate mt-1">
                                "{conv.lastMessage}"
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Clock className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(conv.timestamp)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-4 h-[calc(100%-4rem)] bg-background rounded-lg border overflow-hidden">
          {/* Conversations List */}
          <div className="w-80 border-r flex flex-col">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm cuộc hội thoại..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              {filteredConversations.map((conv) => {
                const currentConv = conversations.find(c => c.id === conv.id);
                const isUnread = currentConv?.unread || false;
                return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedChat(conv)}
                  className={cn(
                    "p-4 border-b cursor-pointer transition-colors hover:bg-muted/50",
                    selectedChat?.id === conv.id && "bg-muted",
                    isUnread && "bg-primary/5"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn("font-medium truncate", isUnread && "text-primary")}>
                          {conv.customerName}
                        </span>
                        {isUnread && (
                          <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {conv.topic}
                      </p>
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {conv.lastMessage}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {formatTime(conv.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );})}
            </ScrollArea>
          </div>

          {/* Chat Area */}
          {selectedChat ? (
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{selectedChat.customerName}</h3>
                    <p className="text-xs text-muted-foreground">{selectedChat.customerEmail}</p>
                  </div>
                </div>
                {getStatusBadge(selectedChat.status)}
              </div>

              {/* Topic */}
              <div className="px-4 py-2 bg-muted/30 border-b">
                <p className="text-sm">
                  <span className="text-muted-foreground">Chủ đề:</span>{" "}
                  <span className="font-medium">{selectedChat.topic}</span>
                </p>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {(messages[selectedChat.id] || []).map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex items-start gap-3",
                        msg.sender === "admin" && "flex-row-reverse"
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                          msg.sender === "admin"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        <User className="w-4 h-4" />
                      </div>
                      <div
                        className={cn(
                          "max-w-[70%] rounded-lg p-3",
                          msg.sender === "admin"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <span
                          className={cn(
                            "text-xs mt-1 block",
                            msg.sender === "admin"
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          )}
                        >
                          {msg.timestamp.toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nhập tin nhắn..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Chọn một cuộc hội thoại để xem
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default SupportChats;
