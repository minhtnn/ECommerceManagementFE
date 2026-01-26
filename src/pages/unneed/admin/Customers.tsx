// import { useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Search, Eye, Mail, Phone, Calendar, ShoppingBag, UserPlus, CheckCircle } from "lucide-react";
// import { format } from "date-fns";
// import { vi } from "date-fns/locale";
// // import { supabase } from "@/integrations/supabase/client";
// import { toast } from "sonner";

// interface Customer {
//   id: string;
//   code: string;
//   name: string;
//   email: string;
//   phone: string;
//   registeredAt: Date;
//   totalOrders: number;
//   totalSpent: number;
//   status: "active" | "pending" | "inactive";
//   user_id: string;
// }

// const Customers = () => {
//   const [searchParams] = useSearchParams();
//   const highlightId = searchParams.get("id");
  
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [newRegistrations, setNewRegistrations] = useState<string[]>([]);
  
//   // View dialog state
//   const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
//   const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);

//   // Fetch customers from database
//   // const fetchCustomers = async () => {
//   //   try {
//   //     const { data, error } = await supabase
//   //       .from('profiles')
//   //       .select('*')
//   //       .order('created_at', { ascending: false });

//   //     if (error) throw error;

//   //     const formattedCustomers: Customer[] = (data || []).map((profile, index) => ({
//   //       id: profile.id,
//   //       code: `KH${String(index + 1).padStart(3, '0')}`,
//   //       name: profile.full_name || 'Chưa cập nhật',
//   //       email: profile.email || '',
//   //       phone: profile.phone || '',
//   //       registeredAt: new Date(profile.created_at),
//   //       totalOrders: 0,
//   //       totalSpent: 0,
//   //       status: "active" as const,
//   //       user_id: profile.user_id,
//   //     }));

//   //     setCustomers(formattedCustomers);
//   //   } catch (error) {
//   //     console.error('Error fetching customers:', error);
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };

//   // useEffect(() => {
//   //   fetchCustomers();

//   //   // Subscribe to realtime updates for new registrations
//   //   const channel = supabase
//   //     .channel('new-customers')
//   //     .on(
//   //       'postgres_changes',
//   //       {
//   //         event: 'INSERT',
//   //         schema: 'public',
//   //         table: 'profiles'
//   //       },
//   //       (payload) => {
//   //         const newProfile = payload.new as any;
//   //         const newCustomer: Customer = {
//   //           id: newProfile.id,
//   //           code: `KH${String(customers.length + 1).padStart(3, '0')}`,
//   //           name: newProfile.full_name || 'Chưa cập nhật',
//   //           email: newProfile.email || '',
//   //           phone: newProfile.phone || '',
//   //           registeredAt: new Date(newProfile.created_at),
//   //           totalOrders: 0,
//   //           totalSpent: 0,
//   //           status: "active",
//   //           user_id: newProfile.user_id,
//   //         };
          
//   //         setCustomers(prev => [newCustomer, ...prev]);
//   //         setNewRegistrations(prev => [...prev, newProfile.id]);
          
//   //         toast.success(
//   //           <div className="flex items-center gap-2">
//   //             <UserPlus className="h-4 w-4" />
//   //             <span>Khách hàng mới: <strong>{newProfile.full_name}</strong></span>
//   //           </div>,
//   //           { duration: 5000 }
//   //         );
//   //       }
//   //     )
//   //     .subscribe();

//   //   return () => {
//   //     supabase.removeChannel(channel);
//   //   };
//   // }, []);

//   // Auto-open dialog if navigated from notification
//   useEffect(() => {
//     if (highlightId && customers.length > 0) {
//       const customer = customers.find(c => c.code === highlightId || c.id === highlightId);
//       if (customer) {
//         setViewCustomer(customer);
//         setIsViewDialogOpen(true);
//       }
//     }
//   }, [highlightId, customers]);

//   const filteredCustomers = customers.filter((customer) => {
//     const matchesSearch = 
//       customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       customer.phone.includes(searchTerm) ||
//       customer.code.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   const handleViewClick = (customer: Customer) => {
//     setViewCustomer(customer);
//     setIsViewDialogOpen(true);
//     // Remove from new registrations highlight
//     setNewRegistrations(prev => prev.filter(id => id !== customer.id));
//   };

//   const handleConfirmAccount = async (customer: Customer) => {
//     // In a real app, this would update the user's status
//     toast.success(`Đã xác nhận tài khoản ${customer.name}`);
//     setNewRegistrations(prev => prev.filter(id => id !== customer.id));
//   };

//   return (
//     <AdminLayout>
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <h1 className="text-2xl font-bold">Quản lý khách hàng</h1>
//           {newRegistrations.length > 0 && (
//             <Badge className="bg-green-500 text-white animate-pulse">
//               <UserPlus className="h-3 w-3 mr-1" />
//               {newRegistrations.length} đăng ký mới
//             </Badge>
//           )}
//         </div>

//         {/* Filters */}
//         <div className="flex flex-wrap gap-4">
//           <div className="relative flex-1 max-w-md">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Tìm kiếm theo tên, email, SĐT..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10"
//             />
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="text-sm text-muted-foreground">Trạng thái</span>
//             <Select value={statusFilter} onValueChange={setStatusFilter}>
//               <SelectTrigger className="w-32">
//                 <SelectValue placeholder="Tất cả" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">Tất cả</SelectItem>
//                 <SelectItem value="active">Hoạt động</SelectItem>
//                 <SelectItem value="inactive">Không hoạt động</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="bg-background rounded-lg border">
//           <Table>
//             <TableHeader>
//               <TableRow className="bg-muted/50">
//                 <TableHead className="font-semibold">Mã KH</TableHead>
//                 <TableHead className="font-semibold">Tên khách hàng</TableHead>
//                 <TableHead className="font-semibold">Email</TableHead>
//                 <TableHead className="font-semibold">Số điện thoại</TableHead>
//                 <TableHead className="font-semibold">Ngày đăng ký</TableHead>
//                 <TableHead className="font-semibold">Trạng thái</TableHead>
//                 <TableHead className="font-semibold text-center">Thao tác</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {isLoading ? (
//                 <TableRow>
//                   <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
//                     Đang tải...
//                   </TableCell>
//                 </TableRow>
//               ) : filteredCustomers.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
//                     Chưa có khách hàng nào
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 filteredCustomers.map((customer) => (
//                   <TableRow 
//                     key={customer.id}
//                     className={`${highlightId === customer.code || highlightId === customer.id ? "bg-primary/10" : ""} ${newRegistrations.includes(customer.id) ? "bg-green-50 dark:bg-green-950/20 animate-pulse" : ""}`}
//                   >
//                     <TableCell>
//                       <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 font-mono text-xs">
//                         {customer.code}
//                       </Badge>
//                     </TableCell>
//                     <TableCell className="font-medium">
//                       <div className="flex items-center gap-2">
//                         {customer.name}
//                         {newRegistrations.includes(customer.id) && (
//                           <Badge className="bg-green-500 text-white text-xs">Mới</Badge>
//                         )}
//                       </div>
//                     </TableCell>
//                     <TableCell className="text-muted-foreground">{customer.email}</TableCell>
//                     <TableCell className="text-muted-foreground">{customer.phone || '-'}</TableCell>
//                     <TableCell className="text-muted-foreground">
//                       {format(customer.registeredAt, "dd/MM/yyyy HH:mm", { locale: vi })}
//                     </TableCell>
//                     <TableCell>
//                       <Badge
//                         variant="outline"
//                         className={
//                           customer.status === "active"
//                             ? "bg-green-100 text-green-700 border-green-200"
//                             : "bg-gray-100 text-gray-700 border-gray-200"
//                         }
//                       >
//                         {customer.status === "active" ? "Hoạt động" : "Không hoạt động"}
//                       </Badge>
//                     </TableCell>
//                     <TableCell className="text-center">
//                       <div className="flex items-center justify-center gap-1">
//                         <Button 
//                           variant="ghost" 
//                           size="icon" 
//                           className="h-8 w-8"
//                           onClick={() => handleViewClick(customer)}
//                         >
//                           <Eye className="h-4 w-4" />
//                         </Button>
//                         {newRegistrations.includes(customer.id) && (
//                           <Button 
//                             variant="ghost" 
//                             size="icon" 
//                             className="h-8 w-8 text-green-600 hover:text-green-700"
//                             onClick={() => handleConfirmAccount(customer)}
//                             title="Xác nhận tài khoản"
//                           >
//                             <CheckCircle className="h-4 w-4" />
//                           </Button>
//                         )}
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>

//           {/* Pagination */}
//           <div className="flex items-center justify-between px-4 py-3 border-t">
//             <div className="flex items-center gap-2 text-sm text-muted-foreground">
//               <span>Số hàng mỗi trang:</span>
//               <Select defaultValue="10">
//                 <SelectTrigger className="w-16 h-8">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="10">10</SelectItem>
//                   <SelectItem value="20">20</SelectItem>
//                   <SelectItem value="50">50</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="flex items-center gap-2 text-sm">
//               <span className="text-muted-foreground">
//                 Hiển thị {filteredCustomers.length} khách hàng
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* View Dialog */}
//         <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
//           <DialogContent className="max-w-md">
//             <DialogHeader>
//               <DialogTitle>Chi tiết khách hàng</DialogTitle>
//             </DialogHeader>
//             {viewCustomer && (
//               <div className="space-y-4">
//                 <div className="flex items-center justify-center">
//                   <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
//                     <span className="text-2xl font-bold text-primary">
//                       {viewCustomer.name.charAt(0).toUpperCase()}
//                     </span>
//                   </div>
//                 </div>
                
//                 <div className="text-center">
//                   <h3 className="text-lg font-semibold">{viewCustomer.name}</h3>
//                   <Badge variant="outline" className="mt-1 bg-blue-100 text-blue-700 border-blue-200">
//                     {viewCustomer.code}
//                   </Badge>
//                 </div>

//                 <div className="space-y-3">
//                   <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
//                     <Mail className="h-4 w-4 text-muted-foreground" />
//                     <div>
//                       <Label className="text-xs text-muted-foreground">Email</Label>
//                       <p className="text-sm">{viewCustomer.email}</p>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
//                     <Phone className="h-4 w-4 text-muted-foreground" />
//                     <div>
//                       <Label className="text-xs text-muted-foreground">Số điện thoại</Label>
//                       <p className="text-sm">{viewCustomer.phone || 'Chưa cập nhật'}</p>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
//                     <Calendar className="h-4 w-4 text-muted-foreground" />
//                     <div>
//                       <Label className="text-xs text-muted-foreground">Ngày đăng ký</Label>
//                       <p className="text-sm">
//                         {format(viewCustomer.registeredAt, "dd/MM/yyyy HH:mm", { locale: vi })}
//                       </p>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
//                     <ShoppingBag className="h-4 w-4 text-muted-foreground" />
//                     <div className="flex-1">
//                       <Label className="text-xs text-muted-foreground">Thống kê mua hàng</Label>
//                       <div className="flex justify-between mt-1">
//                         <span className="text-sm">{viewCustomer.totalOrders} đơn hàng</span>
//                         <span className="text-sm font-semibold text-primary">
//                           {viewCustomer.totalSpent.toLocaleString()}đ
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex justify-end pt-2">
//                   <Badge
//                     variant="outline"
//                     className={
//                       viewCustomer.status === "active"
//                         ? "bg-green-100 text-green-700 border-green-200"
//                         : "bg-gray-100 text-gray-700 border-gray-200"
//                     }
//                   >
//                     {viewCustomer.status === "active" ? "Đang hoạt động" : "Không hoạt động"}
//                   </Badge>
//                 </div>
//               </div>
//             )}
//           </DialogContent>
//         </Dialog>
//       </div>
//     </AdminLayout>
//   );
// };

// export default Customers;
