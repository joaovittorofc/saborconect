import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import type { Category, MenuItem, CustomOption } from "./StoreBuilder"

interface MenuManagementProps {
  storeId: string
  categories: Category[]
  menuItems: MenuItem[]
  customOptions: CustomOption[]
  onCategoriesChange: (categories: Category[]) => void
  onMenuItemsChange: (items: MenuItem[]) => void
  onCustomOptionsChange: (options: CustomOption[]) => void
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
  const { toast } = useToast()
  const [loadingCategory, setLoadingCategory] = useState(false)
  const [loadingItem, setLoadingItem] = useState(false)

  const handleAddCategory = async () => {
    try {
      setLoadingCategory(true)

      const { data, error } = await supabase.from("categories").insert({
        name: "New Category",
        display_order: categories.length,
        store_id: storeId
      }).select().single()

      if (error) throw error

      onCategoriesChange([...categories, data])
      toast({ title: "Category created!" })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive"
      })
    } finally {
      setLoadingCategory(false)
    }
  }

  const handleAddMenuItem = async () => {
    if (categories.length === 0) {
      toast({
        title: "No categories found",
        description: "You must create a category first",
        variant: "destructive"
      })
      return
    }

    try {
      setLoadingItem(true)

      const { data, error } = await supabase.from("menu_items").insert({
        name: "New Item",
        description: "",
        price: 0,
        image_url: "",
        is_customizable: false,
        display_order: menuItems.length,
        category_id: categories[0].id
      }).select().single()

      if (error) throw error

      onMenuItemsChange([...menuItems, data])
      toast({ title: "Item created!" })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create item",
        variant: "destructive"
      })
    } finally {
      setLoadingItem(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Categories
            <Button size="sm" className="btn-brazil" onClick={handleAddCategory} disabled={loadingCategory}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
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
            <Button size="sm" className="btn-brazil" onClick={handleAddMenuItem} disabled={loadingItem}>
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
  )
}
// MenuManagement allows store owners to manage menu categories and items.
// It provides UI to add categories/items and updates data via Supabase.
// The component displays the current categories and menu items, and notifies users of actions.