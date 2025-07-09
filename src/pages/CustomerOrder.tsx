import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Plus, Minus, Phone, User, Star, Trophy } from "lucide-react";

interface Store {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  banner_url: string;
  primary_color: string;
  button_color: string;
  gamified_ordering: boolean;
}

interface Category {
  id: string;
  name: string;
  display_order: number;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_customizable: boolean;
  category_id: string;
}

interface CustomOption {
  id: string;
  group_label: string;
  option_name: string;
  extra_cost: number;
  item_id: string;
}

interface CartItem extends MenuItem {
  quantity: number;
  customizations: CustomOption[];
  total_price: number;
}

export default function CustomerOrder() {
  const [searchParams] = useSearchParams();
  const storeUrl = searchParams.get("store");
  const { toast } = useToast();

  const [store, setStore] = useState<Store | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [customOptions, setCustomOptions] = useState<CustomOption[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [tempCustomizations, setTempCustomizations] = useState<CustomOption[]>([]);

  useEffect(() => {
    if (storeUrl) {
      loadStoreData();
    }
  }, [storeUrl]);

  const loadStoreData = async () => {
    try {
      // Load store by URL
      const { data: storeData } = await supabase
        .from('stores')
        .select('*')
        .eq('store_url', storeUrl)
        .eq('is_published', true)
        .single();

      if (!storeData) {
        toast({
          title: "Store not found",
          description: "The store you're looking for doesn't exist or isn't published.",
          variant: "destructive"
        });
        return;
      }

      setStore(storeData);

      // Load categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .eq('store_id', storeData.id)
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

  const addToCart = (item: MenuItem, customizations: CustomOption[] = []) => {
    const extraCost = customizations.reduce((sum, opt) => sum + (opt.extra_cost || 0), 0);
    const totalPrice = item.price + extraCost;

    setCart(prev => {
      const existingIndex = prev.findIndex(cartItem => 
        cartItem.id === item.id && 
        JSON.stringify(cartItem.customizations) === JSON.stringify(customizations)
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        updated[existingIndex].total_price = updated[existingIndex].quantity * totalPrice;
        return updated;
      } else {
        return [...prev, {
          ...item,
          quantity: 1,
          customizations,
          total_price: totalPrice
        }];
      }
    });

    toast({
      title: store?.gamified_ordering ? "🎉 Item added!" : "Added to cart",
      description: store?.gamified_ordering ? `+${Math.floor(item.price)} points earned!` : `${item.name} added to your order`,
    });
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.total_price, 0);
  };

  const getTotalPoints = () => {
    return cart.reduce((sum, item) => sum + (Math.floor(item.price) * item.quantity), 0);
  };

  const submitOrder = async () => {
    if (!customerName || !customerPhone || cart.length === 0) {
      toast({
        title: "Missing information",
        description: "Please fill in your details and add items to cart",
        variant: "destructive"
      });
      return;
    }

    try {
      const orderData = {
        customer_name: customerName,
        phone: customerPhone,
        items_json: cart as any,
        total: getTotalPrice(),
        store_id: store?.id
      };

      const { error } = await supabase
        .from('orders')
        .insert(orderData);

      if (error) throw error;

      // Create or update customer
      await supabase
        .from('customers')
        .upsert({
          name: customerName,
          phone: customerPhone,
          store_id: store?.id,
          last_order_at: new Date().toISOString()
        }, {
          onConflict: 'phone,store_id'
        });

      toast({
        title: store?.gamified_ordering ? "🏆 Order completed!" : "Order placed!",
        description: store?.gamified_ordering ? `You earned ${getTotalPoints()} points total!` : "Your order has been sent to the restaurant",
      });

      // Reset form
      setCart([]);
      setCustomerName("");
      setCustomerPhone("");

    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: "Error",
        description: "Failed to submit order. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getItemOptions = (itemId: string) => {
    return customOptions.filter(option => option.item_id === itemId);
  };

  const groupedOptions = (itemId: string) => {
    const options = getItemOptions(itemId);
    const groups: { [key: string]: CustomOption[] } = {};
    
    options.forEach(option => {
      if (!groups[option.group_label]) {
        groups[option.group_label] = [];
      }
      groups[option.group_label].push(option);
    });
    
    return groups;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading store...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Store not found</h1>
          <p className="text-muted-foreground">The store you're looking for doesn't exist or isn't available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Store Header */}
      <div 
        className="relative h-32 bg-cover bg-center"
        style={{ 
          backgroundColor: store.primary_color,
          backgroundImage: store.banner_url ? `url(${store.banner_url})` : undefined 
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="flex items-center space-x-4 text-white">
            {store.logo_url && (
              <img src={store.logo_url} alt={store.name} className="w-16 h-16 rounded-full bg-white/10 p-2" />
            )}
            <div>
              <h1 className="text-2xl font-bold">{store.name}</h1>
              <p className="text-white/90">{store.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Promotional Banners */}
      <div className="container mx-auto px-4 py-6">
        <Carousel className="w-full">
          <CarouselContent>
            <CarouselItem>
              <Card className="border-0 bg-gradient-to-r from-primary to-secondary">
                <CardContent className="flex items-center justify-center p-6 text-white">
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-2">Welcome to {store.name}!</h3>
                    <p>Authentic Brazilian flavors delivered fresh</p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
            {store.gamified_ordering && (
              <CarouselItem>
                <Card className="border-0 bg-gradient-to-r from-secondary to-accent">
                  <CardContent className="flex items-center justify-center p-6 text-white">
                    <div className="text-center">
                      <Trophy className="w-8 h-8 mx-auto mb-2" />
                      <h3 className="text-xl font-bold mb-2">Earn Points!</h3>
                      <p>Get points with every order and unlock rewards</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            )}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      <div className="container mx-auto px-4 pb-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Menu Items */}
          <div className="lg:col-span-2 space-y-6">
            {categories.map(category => {
              const categoryItems = menuItems.filter(item => item.category_id === category.id);
              
              if (categoryItems.length === 0) return null;

              return (
                <div key={category.id}>
                  <h2 className="text-xl font-bold mb-4">{category.name}</h2>
                  <div className="grid gap-4">
                    {categoryItems.map(item => (
                      <Card key={item.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex space-x-4">
                            {item.image_url && (
                              <img 
                                src={item.image_url} 
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                            )}
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold">{item.name}</h3>
                                <div className="text-right">
                                  <p className="font-bold text-lg">${item.price.toFixed(2)}</p>
                                  {store.gamified_ordering && (
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <Star className="w-3 h-3 mr-1" />
                                      {Math.floor(item.price)} pts
                                    </div>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                              
                              {item.is_customizable ? (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button 
                                      onClick={() => {
                                        setSelectedItem(item);
                                        setTempCustomizations([]);
                                      }}
                                      style={{ backgroundColor: store.button_color }}
                                      className="text-white hover:opacity-90"
                                    >
                                      <Plus className="w-4 h-4 mr-2" />
                                      Customize & Add
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-md">
                                    <DialogHeader>
                                      <DialogTitle>Customize {item.name}</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 max-h-96 overflow-y-auto">
                                      {Object.entries(groupedOptions(item.id)).map(([groupLabel, options]) => (
                                        <div key={groupLabel}>
                                          <h4 className="font-medium mb-2">{groupLabel}</h4>
                                          <div className="space-y-2">
                                            {options.map(option => (
                                              <div key={option.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                  id={option.id}
                                                  checked={tempCustomizations.some(c => c.id === option.id)}
                                                  onCheckedChange={(checked) => {
                                                    if (checked) {
                                                      setTempCustomizations(prev => [...prev, option]);
                                                    } else {
                                                      setTempCustomizations(prev => prev.filter(c => c.id !== option.id));
                                                    }
                                                  }}
                                                />
                                                <Label htmlFor={option.id} className="text-sm">
                                                  {option.option_name}
                                                  {option.extra_cost > 0 && (
                                                    <span className="text-muted-foreground ml-1">
                                                      (+${option.extra_cost.toFixed(2)})
                                                    </span>
                                                  )}
                                                </Label>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    <Button 
                                      onClick={() => {
                                        addToCart(item, tempCustomizations);
                                        setSelectedItem(null);
                                      }}
                                      className="w-full"
                                      style={{ backgroundColor: store.button_color }}
                                    >
                                      Add to Cart - ${(item.price + tempCustomizations.reduce((sum, opt) => sum + (opt.extra_cost || 0), 0)).toFixed(2)}
                                    </Button>
                                  </DialogContent>
                                </Dialog>
                              ) : (
                                <Button 
                                  onClick={() => addToCart(item)}
                                  style={{ backgroundColor: store.button_color }}
                                  className="text-white hover:opacity-90"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add to Cart
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart & Checkout */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Your Order
                  {store.gamified_ordering && cart.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      <Star className="w-3 h-3 mr-1" />
                      {getTotalPoints()} pts
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">Your cart is empty</p>
                ) : (
                  <>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {cart.map((item, index) => (
                        <div key={index} className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                            {item.customizations.length > 0 && (
                              <p className="text-xs text-muted-foreground">
                                + {item.customizations.map(c => c.option_name).join(', ')}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-sm">${item.total_price.toFixed(2)}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(index)}
                              className="p-0 h-auto text-red-500 hover:text-red-700"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold">Total:</span>
                        <span className="font-bold text-lg">${getTotalPrice().toFixed(2)}</span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="customer-name">Your Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="customer-name"
                              type="text"
                              placeholder="Enter your name"
                              value={customerName}
                              onChange={(e) => setCustomerName(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="customer-phone">WhatsApp Number</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="customer-phone"
                              type="tel"
                              placeholder="+1 (555) 000-0000"
                              value={customerPhone}
                              onChange={(e) => setCustomerPhone(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>

                        <Button 
                          onClick={submitOrder}
                          className="w-full"
                          style={{ backgroundColor: store.button_color }}
                          disabled={cart.length === 0 || !customerName || !customerPhone}
                        >
                          {store.gamified_ordering ? "🚀 Place Order" : "Place Order"}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}