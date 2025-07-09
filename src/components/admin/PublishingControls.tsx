import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Globe, Copy, Save } from "lucide-react";

interface StoreConfig {
  storeName: string;
  storeDescription: string;
  logo: string;
  banner: string;
  isPublished: boolean;
  storeUrl: string;
}

interface PublishingControlsProps {
  storeConfig: StoreConfig;
  onPublishStore: () => void;
  onCopyStoreLink: () => void;
}

export default function PublishingControls({ 
  storeConfig, 
  onPublishStore, 
  onCopyStoreLink 
}: PublishingControlsProps) {
  return (
    <>
      <Separator className="my-4" />
      
      {/* Publish Controls */}
      <div className="space-y-3">
        {!storeConfig.isPublished ? (
          <Button 
            onClick={onPublishStore}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            <Globe className="h-4 w-4 mr-2" />
            Publish Store
          </Button>
        ) : (
          <div className="space-y-2">
            <div className="text-sm font-medium text-success">🎉 Store is Live!</div>
            <div className="p-2 bg-muted rounded text-xs break-all">
              https://yourstore.link/{storeConfig.storeUrl}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onCopyStoreLink}
              className="w-full"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          </div>
        )}
        
        <Button variant="outline" className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </>
  );
}