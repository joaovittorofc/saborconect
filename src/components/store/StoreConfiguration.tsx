import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { StoreConfig } from "./StoreBuilder";

interface StoreConfigurationProps {
  storeConfig: StoreConfig;
  onStoreConfigChange: (field: keyof StoreConfig, value: any) => void;
}

export function StoreConfiguration({ storeConfig, onStoreConfigChange }: StoreConfigurationProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="store-name">Store Name</Label>
            <Input
              id="store-name"
              value={storeConfig.name}
              onChange={(e) => onStoreConfigChange('name', e.target.value)}
              placeholder="Your Brazilian Restaurant"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={storeConfig.description}
              onChange={(e) => onStoreConfigChange('description', e.target.value)}
              placeholder="Authentic Brazilian cuisine..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="language">Language</Label>
            <Select value={storeConfig.language} onValueChange={(value) => onStoreConfigChange('language', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="pt">Português</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="gamified">Enable Gamified Ordering</Label>
            <Switch
              id="gamified"
              checked={storeConfig.gamified_ordering}
              onCheckedChange={(checked) => onStoreConfigChange('gamified_ordering', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}