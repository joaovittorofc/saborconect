import {
  StoreConfig,
  Category,
  MenuItem,
  CustomOption
} from "@/types/store";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface MenuManagementProps {
  storeId: string;
  categories: Category[];
  menuItems: MenuItem[];
  customOptions: CustomOption[];
  onCategoriesChange: (categories: Category[]) => void;
  onMenuItemsChange: (items: MenuItem[]) => void;
  onCustomOptionsChange: (options: CustomOption[]) => void;
}

export function MenuManagement({ 
  storeId, 
  categories, 
  menuItems, 
  customOptions, 
  onCategoriesChange, 
  onMenuItemsChange, 
  onCustomOptionsChange 
}: MenuManagementProps) {
  const { toast } = useToast();
  const [newCategoryName, setNewCategoryName] = useState("");

 const handleAddCategory = async () => {
  if (!newCategoryName || !storeId) {
    toast({
      title: "Error",
      description: "Category name and store ID are required",
      variant: "destructive"
    });
    return;
  }

  try {
    const { data: newCategory, error } = await supabase
      .from("categories")
      .insert({
        name: newCategoryName,
        store_id: storeId,
        display_order: categories.length
      })
      .select()
      .single();

    if (error) throw error;

    onCategoriesChange([...categories, newCategory]);
    setNewCategoryName("");

    toast({
      title: "Success",
      description: "Category created successfully"
    });
  } catch (error) {
    console.error("Add Category Error:", error);
    toast({
      title: "Error",
      description: "Failed to create category",
      variant: "destructive"
    });
  }
};

      // The following code is already present above, so you can remove this duplicate block.
      // The logic for adding a category and handling errors is already implemented in handleAddCategory.

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Categories
            <Button size="sm" className="btn-brazil" onClick={handleAddCategory}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
            />
          </div>

          {categories.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No categories yet. Add your first category to get started.
            </p>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <Input value={category.name} readOnly />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Menu Items
            <Button size="sm" className="btn-brazil">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {menuItems.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No menu items yet. Add categories first, then add your delicious items.
            </p>
          ) : (
            <div className="space-y-4">
              {menuItems.map((item) => (
                <div key={item.id} className="p-4 border rounded-lg">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <p className="font-semibold text-primary">${item.price}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
