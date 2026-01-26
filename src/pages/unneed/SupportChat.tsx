import EndUserLayout from "@/layouts/EndUserLayout";
import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Send, Bot, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

interface Message {
  id: string;
  content: string;
  sender: "user" | "admin";
  timestamp: Date;
}

const SupportChat = () => {
  const [searchParams] = useSearchParams();
  const topic = searchParams.get("topic") || "Hỗ trợ chung";
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `Xin chào! Tôi là nhân viên hỗ trợ của Uni Coffee. Bạn đang hỏi về "${topic}". Tôi có thể giúp gì cho bạn?`,
      sender: "admin",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate admin response
    setTimeout(() => {
      const adminResponses = [
        "Cảm ơn bạn đã liên hệ! Để hỗ trợ bạn tốt hơn, bạn có thể cho tôi biết thêm chi tiết không?",
        "Tôi đã ghi nhận yêu cầu của bạn. Đội ngũ chúng tôi sẽ xem xét và phản hồi sớm nhất có thể.",
        "Bạn có thể cung cấp mã đơn hàng hoặc email đã đăng ký để tôi kiểm tra thông tin không?",
        "Chúng tôi rất tiếc vì sự bất tiện này. Để giải quyết vấn đề nhanh nhất, vui lòng gọi hotline 1900 123 456.",
      ];

      const randomResponse = adminResponses[Math.floor(Math.random() * adminResponses.length)];

      const adminMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        sender: "admin",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, adminMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <EndUserLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/guest/contact">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Chat hỗ trợ</h1>
            <p className="text-sm text-muted-foreground">Chủ đề: {topic}</p>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-cream rounded-lg border overflow-hidden max-w-3xl mx-auto">
          {/* Messages */}
          <div className="h-[500px] overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.sender === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === "admin"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {message.sender === "admin" ? (
                    <Bot className="w-5 h-5" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </div>
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender === "admin"
                      ? "bg-background text-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span
                    className={`text-xs mt-1 block ${
                      message.sender === "admin"
                        ? "text-muted-foreground"
                        : "text-primary-foreground/70"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="bg-background rounded-lg p-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-4 bg-background">
            <div className="flex gap-2">
              <Input
                placeholder="Nhập tin nhắn..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={!inputMessage.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </EndUserLayout>
  );
};

export default SupportChat;
