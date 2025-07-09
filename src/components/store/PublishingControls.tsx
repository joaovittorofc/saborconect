import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Globe, Copy } from "lucide-react";
import { StoreConfig, Category, MenuItem } from "./StoreBuilder";
import { useToast } from "@/hooks/use-toast";

interface PublishingControlsProps {
  storeConfig: StoreConfig;
  onPublish: () => void;
  categories: Category[];
  menuItems: MenuItem[];
}

export function PublishingControls({ storeConfig, onPublish, categories, menuItems }: PublishingControlsProps) {
  const { toast } = useToast();

  const copyStoreLink = () => {
    if (storeConfig.store_url) {
      navigator.clipboard.writeText(`${window.location.origin}/store/${storeConfig.store_url}`);
      toast({
        title: "Link Copied!",
        description: "Store link copied to clipboard",
      });
    }
  };

  const isReadyToPublish = storeConfig.name && categories.length > 0 && menuItems.length > 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Publish Your Store</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className={`w-5 h-5 ${storeConfig.name ? 'text-success' : 'text-muted-foreground'}`} />
              <span className={storeConfig.name ? 'text-foreground' : 'text-muted-foreground'}>
                Store name configured
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className={`w-5 h-5 ${categories.length > 0 ? 'text-success' : 'text-muted-foreground'}`} />
              <span className={categories.length > 0 ? 'text-foreground' : 'text-muted-foreground'}>
                Categories added ({categories.length})
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className={`w-5 h-5 ${menuItems.length > 0 ? 'text-success' : 'text-muted-foreground'}`} />
              <span className={menuItems.length > 0 ? 'text-foreground' : 'text-muted-foreground'}>
                Menu items added ({menuItems.length})
              </span>
            </div>
          </div>

          <div className="pt-4">
            {storeConfig.is_published ? (
              <div className="space-y-4">
                <Badge className="bg-success/10 text-success border-success/20">
                  <Globe className="w-4 h-4 mr-2" />
                  Store is Live
                </Badge>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={copyStoreLink} className="flex-1">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Store Link
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                className="w-full btn-brazil" 
                onClick={onPublish}
                disabled={!isReadyToPublish}
              >
                <Globe className="w-4 h-4 mr-2" />
                Publish Store
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}