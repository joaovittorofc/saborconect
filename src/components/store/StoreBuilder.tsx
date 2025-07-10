"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import { StoreConfig, Category, MenuItem, CustomOption } from "@/types/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StoreConfiguration } from "./StoreConfiguration";
import { MenuManagement } from "./MenuManagement";
import { LiveStorePreview } from "./LiveStorePreview";
import { PublishingControls } from "./PublishingControls";
import { Loader2 } from "lucide-react";

export default function StoreBuilder() {
  const [isLoading, setIsLoading] = useState(true);
  const [storeConfig, setStoreConfig] = useState<StoreConfig | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [customOptions, setCustomOptions] = useState<CustomOption[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadStoreData();
  }, []);

  const loadStoreData = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Usuário não autenticado");

      // 1. Buscar ou criar loja
      let { data: storeData, error: storeError } = await supabase
        .from("stores")
        .select("*")
        .eq("user_id", user.id)
        .limit(1)
        .single();

      if (!storeData) {
        const { data: newStore, error: insertError } = await supabase
          .from("stores")
          .insert({
            user_id: user.id,
            name: "Nova Loja",
            description: "",
            logo_url: "",
            banner_url: "",
            primary_color: "#22c55e",
            button_color: "#eab308",
            language: "en",
            gamified_ordering: false,
            is_published: false,
            store_url: ""
          })
          .select()
          .single();

        if (insertError) throw insertError;
        storeData = newStore;
      }

      setStoreConfig(storeData);

      // 2. Categorias
      const { data: categoriesData } = await supabase
        .from("categories")
        .select("*")
        .eq("store_id", storeData.id)
        .order("display_order");

      if (categoriesData) setCategories(categoriesData);

      // 3. Menu items
      const { data: menuItemsData } = await supabase
        .from("menu_items")
        .select("*")
        .in("category_id", categoriesData?.map(c => c.id) || [])
        .order("display_order");

      if (menuItemsData) setMenuItems(menuItemsData);

      // 4. Custom options
      const { data: customOptionsData } = await supabase
        .from("custom_options")
        .select("*")
        .in("item_id", menuItemsData?.map(i => i.id) || []);

      if (customOptionsData) setCustomOptions(customOptionsData);

    } catch (error) {
      console.error("Erro ao carregar os dados:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados da loja.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStoreConfigChange = async (field: keyof StoreConfig, value: any) => {
    if (!storeConfig) return;

    const updatedConfig = { ...storeConfig, [field]: value };
    setStoreConfig(updatedConfig);

    try {
      await supabase
        .from("stores")
        .update({ [field]: value })
        .eq("id", storeConfig.id);
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
    }
  };

  const handlePublish = async () => {
    if (!storeConfig) return;

    try {
      await supabase
        .from("stores")
        .update({ is_published: true })
        .eq("id", storeConfig.id);

      setStoreConfig({ ...storeConfig, is_published: true });

      toast({
        title: "Loja publicada!",
        description: "Sua loja está disponível para os clientes."
      });
    } catch (error) {
      console.error("Erro ao publicar:", error);
      toast({
        title: "Erro",
        description: "Não foi possível publicar a loja.",
        variant: "destructive"
      });
    }
  };

  if (isLoading || !storeConfig) {
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
        {/* Painel esquerdo */}
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
                storeId={storeConfig.id}
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

        {/* Painel direito - Preview */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Live Preview</CardTitle>
              <p className="text-sm text-muted-foreground">
                Veja como sua loja será exibida para os clientes.
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
