import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit3, Trash2, Star } from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  points: number;
}

interface ProductManagementProps {
  products: Product[];
  newProduct: Partial<Product>;
  selectedCategory: string;
  categories: string[];
  onProductChange: (field: keyof Product, value: string | number) => void;
  onAddProduct: () => void;
  onDeleteProduct: (id: number) => void;
  onCategorySelect: (category: string) => void;
}

export default function ProductManagement({
  products,
  newProduct,
  selectedCategory,
  categories,
  onProductChange,
  onAddProduct,
  onDeleteProduct,
  onCategorySelect
}: ProductManagementProps) {
  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="h-5 w-5 mr-2 text-primary" />
            Add New Product
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                value={newProduct.name}
                onChange={(e) => onProductChange("name", e.target.value)}
                placeholder="Delicious Brazilian Dish"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productCategory">Category</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newProduct.category}
                onChange={(e) => onProductChange("category", e.target.value)}
              >
                {categories.filter(c => c !== "All").map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <Label htmlFor="productDescription">Description</Label>
            <Textarea
              id="productDescription"
              value={newProduct.description}
              onChange={(e) => onProductChange("description", e.target.value)}
              placeholder="Mouth-watering description of your dish..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="productPrice">Price ($)</Label>
              <Input
                id="productPrice"
                type="number"
                step="0.01"
                value={newProduct.price}
                onChange={(e) => onProductChange("price", parseFloat(e.target.value))}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productImage">Image (Emoji/URL)</Label>
              <Input
                id="productImage"
                value={newProduct.image}
                onChange={(e) => onProductChange("image", e.target.value)}
                placeholder="🍗 or image URL"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productPoints">Flavor Points</Label>
              <Input
                id="productPoints"
                type="number"
                value={newProduct.points}
                onChange={(e) => onProductChange("points", parseInt(e.target.value))}
                placeholder="10"
              />
            </div>
          </div>

          <Button onClick={onAddProduct} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Edit3 className="h-5 w-5 mr-2 text-primary" />
              Manage Products
            </span>
            <div className="flex items-center space-x-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => onCategorySelect(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{product.image}</div>
                  <div>
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary">{product.category}</Badge>
                      <span className="text-sm font-bold text-primary">${product.price.toFixed(2)}</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-warning" />
                        <span className="text-xs text-warning">{product.points}pts</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => onDeleteProduct(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}