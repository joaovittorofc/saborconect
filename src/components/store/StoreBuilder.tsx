import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StoreConfiguration } from "./StoreConfiguration";
import { MenuManagement } from "./MenuManagement";
import { LiveStorePreview } from "./LiveStorePreview";
import { PublishingControls } from "./PublishingControls";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export interface StoreConfig {
  id?: string;
  name: string;
  description: string;
  logo_url: string;
  banner_url: string;
  primary_color: string;
  button_color: string;
  language: string;
  gamified_ordering: boolean;
  is_published: boolean;
  store_url: string;
}

export interface Category {
  id: string;
  name: string;
  display_order: number;
  store_id: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_customizable: boolean;
  display_order: number;
  category_id: string;
}

export interface CustomOption {
  id: string;
  item_id: string;
  group_label: string;
  option_name: string;
  extra_cost: number;
}

export default function StoreBuilder() {
  const [isLoading, setIsLoading] = useState(true);
  const [storeConfig, setStoreConfig] = useState<StoreConfig>({
    name: "",
    description: "",
    logo_url: "",
    banner_url: "",
    primary_color: "#22c55e",
    button_color: "#eab308",
    language: "en",
    gamified_ordering: false,
    is_published: false,
    store_url: ""
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [customOptions, setCustomOptions] = useState<CustomOption[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadStoreData();
  }, []);

  const loadStoreData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load store configuration
      const { data: stores } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', user.id)
        .limit(1);

      if (stores && stores.length > 0) {
        setStoreConfig(stores[0]);
        
        // Load categories
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('*')
          .eq('store_id', stores[0].id)
          .order('display_order');

        if (categoriesData) {
          setCategories(categoriesData);
        }

        // Load menu items
        const { data: menuItemsData } = await supabase
          .from('menu_items')
          .select('*')
          .in('category_id', categoriesData?.map(c => c.id) || [])
          .order('display_order');

        if (menuItemsData) {
          setMenuItems(menuItemsData);
        }

        // Load custom options
        const { data: customOptionsData } = await supabase
          .from('custom_options')
          .select('*')
          .in('item_id', menuItemsData?.map(i => i.id) || []);

        if (customOptionsData) {
          setCustomOptions(customOptionsData);
        }
      }
    } catch (error) {
      console.error('Error loading store data:', error);
      toast({
        title: "Error",
        description: "Failed to load store data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStoreConfigChange = async (field: keyof StoreConfig, value: any) => {
    const updatedConfig = { ...storeConfig, [field]: value };
    setStoreConfig(updatedConfig);

    // Auto-save to database
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (storeConfig.id) {
        // Update existing store
        await supabase
          .from('stores')
          .update({ [field]: value })
          .eq('id', storeConfig.id);
      } else {
        // Create new store
        const { data: newStore } = await supabase
          .from('stores')
          .insert({
            user_id: user.id,
            ...updatedConfig
          })
          .select()
          .single();

        if (newStore) {
          setStoreConfig(newStore);
        }
      }
    } catch (error) {
      console.error('Error saving store config:', error);
    }
  };

  const handlePublish = async () => {
    try {
      if (!storeConfig.id) {
        toast({
          title: "Error",
          description: "Please save your store configuration first",
          variant: "destructive"
        });
        return;
      }

      await supabase
        .from('stores')
        .update({ is_published: true })
        .eq('id', storeConfig.id);

      setStoreConfig(prev => ({ ...prev, is_published: true }));
      
      toast({
        title: "Store Published!",
        description: "Your store is now live and accessible to customers",
      });
    } catch (error) {
      console.error('Error publishing store:', error);
      toast({
        title: "Error",
        description: "Failed to publish store",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gradient-brazil mb-2">Store Builder</h1>
        <p className="text-muted-foreground">
          Create and customize your Brazilian food ordering experience
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="store" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="store">Store Setup</TabsTrigger>
              <TabsTrigger value="menu">Menu & Products</TabsTrigger>
              <TabsTrigger value="publish">Publish</TabsTrigger>
            </TabsList>

            <TabsContent value="store" className="space-y-6">
              <StoreConfiguration
                storeConfig={storeConfig}
                onStoreConfigChange={handleStoreConfigChange}
              />
            </TabsContent>

            <TabsContent value="menu" className="space-y-6">
              <MenuManagement
                storeId={storeConfig.id || ""}
                categories={categories}
                menuItems={menuItems}
                customOptions={customOptions}
                onCategoriesChange={setCategories}
                onMenuItemsChange={setMenuItems}
                onCustomOptionsChange={setCustomOptions}
              />
            </TabsContent>

            <TabsContent value="publish" className="space-y-6">
              <PublishingControls
                storeConfig={storeConfig}
                onPublish={handlePublish}
                categories={categories}
                menuItems={menuItems}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel - Live Preview */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Live Preview</CardTitle>
              <p className="text-sm text-muted-foreground">
                See how your store will look to customers
              </p>
            </CardHeader>
            <CardContent>
              <LiveStorePreview
                storeConfig={storeConfig}
                categories={categories}
                menuItems={menuItems}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}