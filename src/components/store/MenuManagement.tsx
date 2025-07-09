import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Category, MenuItem, CustomOption } from "@/types/store";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  onCategoriesChange, 
  menuItems, 
  onMenuItemsChange 
}: MenuManagementProps) {
  const { toast } = useToast();
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({ title: "Error", description: "Category name cannot be empty", variant: "destructive" });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("categories")
        .insert({
          name: newCategoryName,
          store_id: storeId,
          display_order: categories.length
        })
        .select()
        .single();

      if (error) throw error;

      onCategoriesChange([...categories, data]);
      setNewCategoryName("");
      toast({ title: "Category added successfully!" });
    } catch (error) {
      console.error("Add Category Error:", error);
      toast({ title: "Error", description: "Failed to create category", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="New category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <Button onClick={handleAddCategory} className="btn-brazil">
              <Plus className="w-4 h-4 mr-2" /> Add Category
            </Button>
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

      {/* Menu Items Card será refatorado depois */}
    </div>
  );
}
