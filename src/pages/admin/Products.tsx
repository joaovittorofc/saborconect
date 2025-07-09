import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  emoji: string;
  status: "active" | "inactive";
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Coxinha de Frango",
    description: "Traditional Brazilian chicken croquette with creamy filling",
    price: 4.50,
    category: "Appetizers",
    emoji: "🍗",
    status: "active"
  },
  {
    id: 2,
    name: "Pão de Açúcar",
    description: "Sweet Brazilian bread with condensed milk glaze",
    price: 3.25,
    category: "Bakery",
    emoji: "🍞",
    status: "active"
  },
  {
    id: 3,
    name: "Açaí Bowl",
    description: "Fresh açaí topped with granola, banana, and honey",
    price: 8.99,
    category: "Healthy",
    emoji: "🍓",
    status: "active"
  },
  {
    id: 4,
    name: "Brigadeiro Box",
    description: "Set of 6 traditional chocolate truffles",
    price: 12.00,
    category: "Desserts",
    emoji: "🍫",
    status: "active"
  },
  {
    id: 5,
    name: "Feijoada Completa",
    description: "Traditional black bean stew with pork and rice",
    price: 16.99,
    category: "Main Dishes",
    emoji: "🍲",
    status: "active"
  },
  {
    id: 6,
    name: "Caipirinha Mocktail",
    description: "Non-alcoholic version of Brazil's national cocktail",
    price: 5.75,
    category: "Beverages",
    emoji: "🍹",
    status: "inactive"
  }
];

export default function Products() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: "",
    description: "",
    price: 0,
    category: "",
    emoji: "",
    status: "active"
  });

  const categories = ["Appetizers", "Main Dishes", "Desserts", "Beverages", "Bakery", "Healthy"];

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.description || newProduct.price <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    const product: Product = {
      ...newProduct,
      id: Math.max(...products.map(p => p.id)) + 1
    };

    setProducts(prev => [...prev, product]);
    setNewProduct({
      name: "",
      description: "",
      price: 0,
      category: "",
      emoji: "",
      status: "active"
    });
    setIsAddModalOpen(false);
    toast.success("Product added successfully");
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleSaveEdit = () => {
    if (!editingProduct) return;

    setProducts(prev => 
      prev.map(p => p.id === editingProduct.id ? editingProduct : p)
    );
    setEditingProduct(null);
    toast.success("Product updated successfully");
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    toast.success("Product deleted successfully");
  };

  const toggleProductStatus = (id: number) => {
    setProducts(prev => 
      prev.map(p => 
        p.id === id 
          ? { ...p, status: p.status === "active" ? "inactive" : "active" }
          : p
      )
    );
  };

  const getProductStats = () => {
    return {
      total: products.length,
      active: products.filter(p => p.status === "active").length,
      inactive: products.filter(p => p.status === "inactive").length,
      categories: new Set(products.map(p => p.category)).size
    };
  };

  const stats = getProductStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage your menu items and pricing
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Create a new menu item for your restaurant
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter product name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the product"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newProduct.price || ""}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emoji">Emoji</Label>
                  <Input
                    id="emoji"
                    value={newProduct.emoji}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, emoji: e.target.value }))}
                    placeholder="🍗"
                    maxLength={2}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="w-full p-2 border rounded-md"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddProduct}>
                Add Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Product Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.categories}</div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Menu Items</CardTitle>
          <CardDescription>Manage your restaurant's menu and pricing</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{product.emoji}</div>
                      <div>
                        {editingProduct?.id === product.id ? (
                          <Input
                            value={editingProduct.name}
                            onChange={(e) => setEditingProduct(prev => 
                              prev ? { ...prev, name: e.target.value } : null
                            )}
                            className="font-medium"
                          />
                        ) : (
                          <div className="font-medium">{product.name}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {editingProduct?.id === product.id ? (
                      <select
                        className="p-1 border rounded"
                        value={editingProduct.category}
                        onChange={(e) => setEditingProduct(prev => 
                          prev ? { ...prev, category: e.target.value } : null
                        )}
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    ) : (
                      <Badge variant="outline">{product.category}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    {editingProduct?.id === product.id ? (
                      <Textarea
                        value={editingProduct.description}
                        onChange={(e) => setEditingProduct(prev => 
                          prev ? { ...prev, description: e.target.value } : null
                        )}
                        rows={2}
                      />
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        {product.description}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingProduct?.id === product.id ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={editingProduct.price}
                        onChange={(e) => setEditingProduct(prev => 
                          prev ? { ...prev, price: parseFloat(e.target.value) || 0 } : null
                        )}
                        className="w-20"
                      />
                    ) : (
                      <div className="font-medium">${product.price.toFixed(2)}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={product.status === "active" ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => toggleProductStatus(product.id)}
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {editingProduct?.id === product.id ? (
                        <>
                          <Button size="sm" onClick={handleSaveEdit}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setEditingProduct(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
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