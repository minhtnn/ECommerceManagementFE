import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Calendar, 
  Download, 
  DollarSign, 
  FileText, 
  Package, 
  TrendingUp,
  Bell,
  ShoppingCart,
  UserPlus,
  Shield,
  Eye,
  MessageCircle
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useNotifications, type Notification } from "@/contexts/NotificationContext";
import { useSupportChat } from "@/contexts/SupportChatContext";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState("2025-12-23");
  const [toDate, setToDate] = useState("2025-12-23");
  const [store, setStore] = useState("all");
  const [notificationFilter, setNotificationFilter] = useState<"all" | "order" | "admin" | "customer">("all");
  
  // const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  // const { unreadCount: supportChatUnreadCount } = useSupportChat();

  // const totalUnreadCount = unreadCount + supportChatUnreadCount;

  // const filteredNotifications = notifications.filter(n => 
  //   notificationFilter === "all" || n.type === notificationFilter
  // );

  // const handleNotificationClick = (notification: Notification) => {
  //   markAsRead(notification.id);
    
  //   // Navigate based on notification type
  //   switch (notification.type) {
  //     case "order":
  //       navigate(`/admin/orders?id=${notification.referenceId}`);
  //       break;
  //     case "admin":
  //       navigate(`/admin/admins?id=${notification.referenceId}`);
  //       break;
  //     case "customer":
  //       navigate(`/admin/customers?id=${notification.referenceId}`);
  //       break;
  //   }
  // };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="h-4 w-4 text-blue-600" />;
      case "admin":
        return <Shield className="h-4 w-4 text-purple-600" />;
      case "customer":
        return <UserPlus className="h-4 w-4 text-green-600" />;
    }
  };

  const getNotificationBadge = (type: Notification["type"]) => {
    switch (type) {
      case "order":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Đơn hàng</Badge>;
      case "admin":
        return <Badge className="bg-purple-100 text-purple-700 border-purple-200">Admin</Badge>;
      case "customer":
        return <Badge className="bg-green-100 text-green-700 border-green-200">Khách hàng</Badge>;
    }
  };

  // const orderCount = notifications.filter(n => n.type === "order" && !n.isRead).length;
  // const adminCount = notifications.filter(n => n.type === "admin" && !n.isRead).length;
  // const customerCount = notifications.filter(n => n.type === "customer" && !n.isRead).length;

  const statsCards = [
    {
      title: "Tổng doanh thu bán hàng",
      subtitle: "(VND)",
      value: "0 đ",
      icon: DollarSign,
      bgColor: "bg-gradient-to-br from-orange-50 to-orange-100",
      iconBg: "bg-orange-500",
      details: [
        { label: "Doanh thu trước giảm giá:", value: "0 đ" },
        { label: "Tổng giảm giá bán hàng:", value: "0 đ", highlight: true },
        { label: "Doanh thu thực tế:", value: "0 đ" },
      ],
    },
    {
      title: "Tổng số hóa đơn bán hàng",
      subtitle: "(Hóa Đơn)",
      value: "0",
      icon: FileText,
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      iconBg: "bg-blue-500",
      details: [
        { label: "Tại quán:", value: "0" },
        { label: "Mang đi:", value: "0", highlight: true },
        { label: "Tổng hóa đơn:", value: "0" },
      ],
    },
    {
      title: "Bình quân hóa đơn",
      subtitle: "(VND/Hóa Đơn)",
      value: "0 đ",
      icon: TrendingUp,
      bgColor: "bg-gradient-to-br from-cyan-50 to-cyan-100",
      iconBg: "bg-cyan-500",
      details: [
        { label: "Bình quân hóa đơn tại quán:", value: "0 đ" },
        { label: "Bình quân hóa đơn mang đi:", value: "0 đ", highlight: true },
        { label: "Bình quân hóa đơn tổng:", value: "0 đ" },
      ],
    },
    {
      title: "Bình quân sản phẩm",
      subtitle: "(Sản phẩm/Hóa Đơn)",
      value: "0",
      icon: Package,
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
      iconBg: "bg-purple-500",
      details: [
        { label: "Bình quân sản phẩm tại quán:", value: "0" },
        { label: "Bình quân sản phẩm mang đi:", value: "0", highlight: true },
        { label: "Bình quân sản phẩm tổng:", value: "0" },
      ],
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Tổng quan</h1>
          <Button className="bg-primary hover:bg-primary/90">
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>

        {/* Notifications Section */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Thông báo</CardTitle>
                {/* {totalUnreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {totalUnreadCount} mới
                  </Badge>
                )} */}
              </div>
              {/* <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <Eye className="h-4 w-4 mr-1" />
                Đánh dấu tất cả đã đọc
              </Button> */}
            </div>
          </CardHeader>
          <CardContent>
            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div 
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                  notificationFilter === "order" ? "bg-blue-100 border-2 border-blue-300" : "bg-blue-50 hover:bg-blue-100"
                )}
                onClick={() => setNotificationFilter(notificationFilter === "order" ? "all" : "order")}
              >
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-white" />
                </div>
                <div>
                  {/* <p className="text-2xl font-bold text-blue-700">{orderCount}</p> */}
                  <p className="text-xs text-blue-600">Đơn hàng mới</p>
                </div>
              </div>
              <div 
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                  notificationFilter === "admin" ? "bg-purple-100 border-2 border-purple-300" : "bg-purple-50 hover:bg-purple-100"
                )}
                onClick={() => setNotificationFilter(notificationFilter === "admin" ? "all" : "admin")}
              >
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  {/* <p className="text-2xl font-bold text-purple-700">{adminCount}</p> */}
                  <p className="text-xs text-purple-600">Admin mới</p>
                </div>
              </div>
              <div 
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                  notificationFilter === "customer" ? "bg-green-100 border-2 border-green-300" : "bg-green-50 hover:bg-green-100"
                )}
                onClick={() => setNotificationFilter(notificationFilter === "customer" ? "all" : "customer")}
              >
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                  <UserPlus className="h-5 w-5 text-white" />
                </div>
                <div>
                  {/* <p className="text-2xl font-bold text-green-700">{customerCount}</p> */}
                  <p className="text-xs text-green-600">Khách hàng mới</p>
                </div>
              </div>
              <div 
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors bg-rose-50 hover:bg-rose-100"
                onClick={() => navigate("/admin/support-chats")}
              >
                <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  {/* <p className="text-2xl font-bold text-rose-700">{supportChatUnreadCount}</p> */}
                  <p className="text-xs text-rose-600">Liên hệ & Hỗ trợ</p>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            {/* <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {filteredNotifications.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Không có thông báo</p>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                        notification.isRead 
                          ? "bg-muted/30 hover:bg-muted/50" 
                          : "bg-primary/5 hover:bg-primary/10 border-l-4 border-primary"
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={cn("text-sm font-medium", !notification.isRead && "text-primary")}>
                            {notification.title}
                          </p>
                          {getNotificationBadge(notification.type)}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{notification.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(notification.timestamp, { addSuffix: true, locale: vi })}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea> */}
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Từ ngày</span>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="pl-10 w-40"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Đến ngày</span>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="pl-10 w-40"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Chọn cửa hàng</span>
            <Select value={store} onValueChange={setStore}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Chọn cửa hàng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toàn hệ thống</SelectItem>
                <SelectItem value="store1">Cửa hàng 1</SelectItem>
                <SelectItem value="store2">Cửa hàng 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((card, index) => (
            <Card key={index} className={cn(card.bgColor, "border-0")}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center",
                      card.iconBg
                    )}
                  >
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-2xl font-bold">{card.value}</p>
                  <p className="text-sm font-medium text-primary">
                    {card.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                </div>
                <div className="space-y-2 text-xs">
                  {card.details.map((detail, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="text-muted-foreground">{detail.label}</span>
                      <span className={detail.highlight ? "text-primary" : ""}>
                        {detail.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Doanh thu thực tế</CardTitle>
              <p className="text-center text-sm text-muted-foreground">
                Tổng số: 0 đ
              </p>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
              <p>Không có dữ liệu</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Hóa đơn bán hàng</CardTitle>
              <p className="text-center text-sm text-muted-foreground">
                Tổng số hóa đơn bán hàng: 0
              </p>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
              <p>Không có dữ liệu</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
