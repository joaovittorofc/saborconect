import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Eye, Smartphone, Monitor } from "lucide-react";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  points: number;
}

interface StoreConfig {
  storeName: string;
  storeDescription: string;
  logo: string;
  banner: string;
  isPublished: boolean;
  storeUrl: string;
}

interface LivePreviewProps {
  storeConfig: StoreConfig;
  products: Product[];
}

export default function LivePreview({ storeConfig, products }: LivePreviewProps) {
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Eye className="h-5 w-5 mr-2 text-primary" />
            Live Preview
          </span>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('mobile')}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('desktop')}
            >
              <Monitor className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
        {storeConfig.isPublished && (
          <Badge className="bg-success text-success-foreground w-fit">Published</Badge>
        )}
      </CardHeader>
      <CardContent>
        {/* Preview Container */}
        <div className={`border rounded-lg bg-white p-4 shadow-lg mx-auto ${
          viewMode === 'mobile' ? 'max-w-sm' : 'w-full max-w-2xl'
        }`}>
          {/* Store Header Preview */}
          <div className="text-center mb-4">
            <div className="text-2xl mb-2">{storeConfig.logo}</div>
            <h3 className="font-bold text-lg">{storeConfig.storeName}</h3>
            <p className="text-xs text-muted-foreground">{storeConfig.storeDescription}</p>
          </div>

          <Separator className="mb-4" />

          {/* Products Preview */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Featured Items</h4>
            {products.slice(0, 3).map((product) => (
              <div key={product.id} className="flex items-center space-x-3 p-2 border rounded">
                <div className="text-lg">{product.image}</div>
                <div className="flex-1">
                  <p className="text-xs font-medium">{product.name}</p>
                  <p className="text-xs text-primary font-bold">${product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-2">
                Total Products: {products.length}
              </div>
              <div className="bg-gradient-to-r from-primary to-secondary text-white text-xs py-2 px-3 rounded">
                Order Now
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}