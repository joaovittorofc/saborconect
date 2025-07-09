import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StoreConfig, Category, MenuItem } from "@/types/store";

interface LiveStorePreviewProps {
  storeConfig: StoreConfig;
  categories: Category[];
  menuItems: MenuItem[];
}

export function LiveStorePreview({ storeConfig, categories, menuItems }: LiveStorePreviewProps) {
  return (
    <div className="store-preview p-4 max-h-[600px] overflow-y-auto">
      {/* Store Header */}
      <div className="text-center mb-6">
        {storeConfig.logo_url ? (
          <img 
            src={storeConfig.logo_url} 
            alt="Store Logo" 
            className="w-16 h-16 mx-auto rounded-full object-cover mb-4"
          />
        ) : (
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-brazil flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">
              {storeConfig.name ? storeConfig.name[0].toUpperCase() : '?'}
            </span>
          </div>
        )}
        <h2 className="text-xl font-bold">
          {storeConfig.name || "Your Store Name"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {storeConfig.description || "Your store description will appear here"}
        </p>
      </div>

      {/* Categories and Items */}
      {categories.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Add categories and menu items to see your store preview</p>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => {
            const categoryItems = menuItems.filter(item => item.category_id === category.id);
            
            return (
              <div key={category.id}>
                <h3 className="text-lg font-semibold mb-3">{category.name}</h3>
                <div className="space-y-3">
                  {categoryItems.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No items in this category yet</p>
                  ) : (
                    categoryItems.map((item) => (
                      <Card key={item.id} className="food-card">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                              <p className="text-lg font-bold text-primary mt-2">${item.price}</p>
                              {item.is_customizable && (
                                <Badge variant="secondary" className="mt-2">
                                  Customizable
                                </Badge>
                              )}
                            </div>
                            <Button 
                              size="sm" 
                              className={storeConfig.gamified_ordering ? "btn-gamified" : "btn-brazil"}
                            >
                              {storeConfig.gamified_ordering ? "Add to Combo" : "Add to Order"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}