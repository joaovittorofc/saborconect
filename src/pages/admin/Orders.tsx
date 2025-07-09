import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Search, Filter, Eye } from "lucide-react";

// Sample orders data
const ordersData = [
  {
    id: "ORD-1001",
    customerName: "Maria Santos",
    phone: "+1 (555) 123-4567",
    items: ["2x Coxinha de Frango", "1x Açaí Bowl"],
    total: 17.99,
    status: "new",
    date: "2024-01-15",
    time: "14:30"
  },
  {
    id: "ORD-1002",
    customerName: "João Silva",
    phone: "+1 (555) 234-5678",
    items: ["1x Feijoada Completa", "1x Caipirinha Mocktail"],
    total: 22.74,
    status: "preparing",
    date: "2024-01-15",
    time: "13:45"
  },
  {
    id: "ORD-1003",
    customerName: "Ana Costa",
    phone: "+1 (555) 345-6789",
    items: ["1x Brigadeiro Box", "2x Pão de Açúcar"],
    total: 18.50,
    status: "delivered",
    date: "2024-01-15",
    time: "12:20"
  },
  {
    id: "ORD-1004",
    customerName: "Carlos Mendes",
    phone: "+1 (555) 456-7890",
    items: ["3x Coxinha de Frango", "1x Açaí Bowl"],
    total: 22.49,
    status: "new",
    date: "2024-01-15",
    time: "11:15"
  },
  {
    id: "ORD-1005",
    customerName: "Lucia Fernandez",
    phone: "+1 (555) 567-8901",
    items: ["2x Feijoada Completa", "2x Caipirinha Mocktail"],
    total: 45.48,
    status: "preparing",
    date: "2024-01-14",
    time: "19:30"
  },
];

const statusColors = {
  new: "default",
  preparing: "secondary",
  delivered: "outline"
} as const;

const statusLabels = {
  new: "New",
  preparing: "Preparing",
  delivered: "Delivered"
};

export default function Orders() {
  const [orders, setOrders] = useState(ordersData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const updateOrderStatus = (orderId: string, newStatus: keyof typeof statusLabels) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    const matchesDate = dateFilter === "all" || order.date === dateFilter;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getOrderStats = () => {
    const today = "2024-01-15";
    const todayOrders = orders.filter(order => order.date === today);
    return {
      total: orders.length,
      today: todayOrders.length,
      new: orders.filter(order => order.status === "new").length,
      preparing: orders.filter(order => order.status === "preparing").length,
      delivered: orders.filter(order => order.status === "delivered").length,
    };
  };

  const stats = getOrderStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">
          Manage and track all customer orders
        </p>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.today}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">New</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.new}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Preparing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.preparing}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.delivered}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Orders</CardTitle>
          <CardDescription>Search and filter orders by different criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by customer name, order ID, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="2024-01-15">Today</SelectItem>
                <SelectItem value="2024-01-14">Yesterday</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders ({filteredOrders.length})</CardTitle>
          <CardDescription>All customer orders with status tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date/Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell className="text-sm">{order.phone}</TableCell>
                  <TableCell>
                    <div className="max-w-[200px]">
                      {order.items.map((item, index) => (
                        <div key={index} className="text-sm">
                          {item}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    ${order.total.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColors[order.status as keyof typeof statusColors]}>
                      {statusLabels[order.status as keyof typeof statusLabels]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div>{order.date}</div>
                    <div className="text-muted-foreground">{order.time}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {order.status === "new" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateOrderStatus(order.id, "preparing")}
                        >
                          Start Preparing
                        </Button>
                      )}
                      {order.status === "preparing" && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, "delivered")}
                        >
                          Mark Delivered
                        </Button>
                      )}
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}