import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";

interface StoreConfig {
  storeName: string;
  storeDescription: string;
  logo: string;
  banner: string;
  isPublished: boolean;
  storeUrl: string;
}

interface StoreConfigurationProps {
  storeConfig: StoreConfig;
  onStoreConfigChange: (field: keyof StoreConfig, value: string) => void;
}

export default function StoreConfiguration({ storeConfig, onStoreConfigChange }: StoreConfigurationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Globe className="h-5 w-5 mr-2 text-primary" />
          Store Configuration
        </CardTitle>
        <CardDescription>
          Set up your digital storefront
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="storeName">Store Name</Label>
            <Input
              id="storeName"
              value={storeConfig.storeName}
              onChange={(e) => onStoreConfigChange("storeName", e.target.value)}
              placeholder="Your Restaurant Name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="storeUrl">Store URL</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                yourstore.link/
              </span>
              <Input
                id="storeUrl"
                value={storeConfig.storeUrl}
                onChange={(e) => onStoreConfigChange("storeUrl", e.target.value)}
                className="rounded-l-none"
                placeholder="storename"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="storeDescription">Store Description</Label>
          <Textarea
            id="storeDescription"
            value={storeConfig.storeDescription}
            onChange={(e) => onStoreConfigChange("storeDescription", e.target.value)}
            placeholder="Describe your restaurant and cuisine..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="logo">Logo (Emoji or URL)</Label>
            <Input
              id="logo"
              value={storeConfig.logo}
              onChange={(e) => onStoreConfigChange("logo", e.target.value)}
              placeholder="🇧🇷 or image URL"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="banner">Banner Image URL</Label>
            <Input
              id="banner"
              value={storeConfig.banner}
              onChange={(e) => onStoreConfigChange("banner", e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}