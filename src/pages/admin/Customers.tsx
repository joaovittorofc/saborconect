import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Phone, MessageCircle, Eye, UserPlus } from "lucide-react";

// Sample customer data
const customersData = [
  {
    id: 1,
    name: "Maria Santos",
    phone: "+1 (555) 123-4567",
    email: "maria.santos@email.com",
    totalOrders: 23,
    totalSpent: 387.50,
    lastOrder: "2024-01-15",
    customerSince: "2023-08-15",
    status: "active",
    favoriteItems: ["Coxinha de Frango", "Açaí Bowl"]
  },
  {
    id: 2,
    name: "João Silva",
    phone: "+1 (555) 234-5678",
    email: "joao.silva@email.com",
    totalOrders: 45,
    totalSpent: 892.25,
    lastOrder: "2024-01-15",
    customerSince: "2023-05-20",
    status: "vip",
    favoriteItems: ["Feijoada Completa", "Caipirinha Mocktail"]
  },
  {
    id: 3,
    name: "Ana Costa",
    phone: "+1 (555) 345-6789",
    email: "ana.costa@email.com",
    totalOrders: 12,
    totalSpent: 198.75,
    lastOrder: "2024-01-12",
    customerSince: "2023-11-10",
    status: "active",
    favoriteItems: ["Brigadeiro Box", "Pão de Açúcar"]
  },
  {
    id: 4,
    name: "Carlos Mendes",
    phone: "+1 (555) 456-7890",
    email: "carlos.mendes@email.com",
    totalOrders: 67,
    totalSpent: 1345.80,
    lastOrder: "2024-01-14",
    customerSince: "2023-03-12",
    status: "vip",
    favoriteItems: ["Coxinha de Frango", "Feijoada Completa"]
  },
  {
    id: 5,
    name: "Lucia Fernandez",
    phone: "+1 (555) 567-8901",
    email: "lucia.fernandez@email.com",
    totalOrders: 8,
    totalSpent: 134.90,
    lastOrder: "2024-01-08",
    customerSince: "2023-12-05",
    status: "new",
    favoriteItems: ["Açaí Bowl"]
  },
  {
    id: 6,
    name: "Roberto Lima",
    phone: "+1 (555) 678-9012",
    email: "roberto.lima@email.com",
    totalOrders: 31,
    totalSpent: 567.45,
    lastOrder: "2024-01-10",
    customerSince: "2023-07-18",
    status: "active",
    favoriteItems: ["Brigadeiro Box", "Caipirinha Mocktail"]
  }
];

const statusColors = {
  new: "default",
  active: "secondary",
  vip: "outline"
} as const;

const statusLabels = {
  new: "New Customer",
  active: "Active",
  vip: "VIP"
};

export default function Customers() {
  const [customers, setCustomers] = useState(customersData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getCustomerStats = () => {
    return {
      total: customers.length,
      new: customers.filter(c => c.status === "new").length,
      active: customers.filter(c => c.status === "active").length,
      vip: customers.filter(c => c.status === "vip").length,
      totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
      averageOrderValue: customers.reduce((sum, c) => sum + (c.totalSpent / c.totalOrders), 0) / customers.length
    };
  };

  const stats = getCustomerStats();

  const getCustomerSegmentation = () => {
    const thisMonth = customers.filter(c => {
      const lastOrderDate = new Date(c.lastOrder);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return lastOrderDate >= thirtyDaysAgo;
    }).length;

    const repeatCustomers = customers.filter(c => c.totalOrders > 5).length;

    return {
      activeThisMonth: thisMonth,
      repeatCustomers: repeatCustomers,
      repeatRate: Math.round((repeatCustomers / customers.length) * 100)
    };
  };

  const segmentation = getCustomerSegmentation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-muted-foreground">
          Manage your customer relationships and track loyalty
        </p>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {segmentation.activeThisMonth} active this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">VIP Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.vip}</div>
            <p className="text-xs text-muted-foreground">
              High-value customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Repeat Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{segmentation.repeatRate}%</div>
            <p className="text-xs text-muted-foreground">
              {segmentation.repeatCustomers} repeat customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${stats.totalRevenue.toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Avg: ${stats.averageOrderValue.toFixed(2)} per order
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Customers</CardTitle>
          <CardDescription>Search and filter customers by different criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, phone, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Customer Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="new">New Customers</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Database ({filteredCustomers.length})</CardTitle>
          <CardDescription>Complete customer information and order history</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Favorite Items</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Customer since {new Date(customer.customerSince).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">{customer.phone}</div>
                      <div className="text-xs text-muted-foreground">{customer.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="font-bold text-lg">{customer.totalOrders}</div>
                      <div className="text-xs text-muted-foreground">orders</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-green-600">
                      ${customer.totalSpent.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(customer.lastOrder).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColors[customer.status as keyof typeof statusColors]}>
                      {statusLabels[customer.status as keyof typeof statusLabels]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[150px]">
                      {customer.favoriteItems.map((item, index) => (
                        <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Phone className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <MessageCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Customer Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Customers by Spending</CardTitle>
            <CardDescription>Your most valuable customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customers
                .sort((a, b) => b.totalSpent - a.totalSpent)
                .slice(0, 5)
                .map((customer, index) => (
                  <div key={customer.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {customer.totalOrders} orders
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${customer.totalSpent.toFixed(2)}</p>
                      <Badge variant={statusColors[customer.status as keyof typeof statusColors]} className="text-xs">
                        {statusLabels[customer.status as keyof typeof statusLabels]}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent New Customers</CardTitle>
            <CardDescription>Welcome your newest customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customers
                .sort((a, b) => new Date(b.customerSince).getTime() - new Date(a.customerSince).getTime())
                .slice(0, 5)
                .map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <UserPlus className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Joined {new Date(customer.customerSince).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{customer.totalOrders} orders</p>
                      <p className="text-sm font-medium">${customer.totalSpent.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}