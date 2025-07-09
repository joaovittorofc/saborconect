import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ShoppingCart, Plus, Minus, Phone, User, CheckCircle, Sparkles, Trophy, Target } from "lucide-react";
import { toast } from "sonner";

const menuItems = [
  {
    id: 1,
    name: "Coxinha de Frango",
    description: "Traditional Brazilian chicken croquette with creamy filling",
    price: 4.50,
    image: "🍗",
    category: "Appetizers",
    points: 10
  },
  {
    id: 2,
    name: "Pão de Açúcar",
    description: "Sweet Brazilian bread with condensed milk glaze",
    price: 3.25,
    image: "🍞",
    category: "Bakery",
    points: 8
  },
  {
    id: 3,
    name: "Açaí Bowl",
    description: "Fresh açaí topped with granola, banana, and honey",
    price: 8.99,
    image: "🍓",
    category: "Healthy",
    points: 15
  },
  {
    id: 4,
    name: "Brigadeiro Box",
    description: "Set of 6 traditional chocolate truffles",
    price: 12.00,
    image: "🍫",
    category: "Desserts",
    points: 20
  },
  {
    id: 5,
    name: "Feijoada Completa",
    description: "Traditional black bean stew with pork and rice",
    price: 16.99,
    image: "🍲",
    category: "Main Dishes",
    points: 25
  },
  {
    id: 6,
    name: "Caipirinha Mocktail",
    description: "Non-alcoholic version of Brazil's national cocktail",
    price: 5.75,
    image: "🍹",
    category: "Beverages",
    points: 12
  }
];

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  points: number;
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
}

export default function GamifiedOrderPage() {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const points = cart.reduce((total, item) => total + (item.points * item.quantity), 0);
    setTotalPoints(points);
    setLevel(Math.floor(points / 50) + 1);
  }, [cart]);

  const showConfetti = () => {
    const newConfetti = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: ['hsl(139 84% 45%)', 'hsl(45 93% 55%)', 'hsl(204 94% 55%)'][Math.floor(Math.random() * 3)]
    }));
    setConfetti(newConfetti);
    setTimeout(() => setConfetti([]), 1000);
  };

  const addToCart = (item: typeof menuItems[0]) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { 
        id: item.id, 
        name: item.name, 
        price: item.price, 
        quantity: 1,
        points: item.points 
      }];
    });
    
    showConfetti();
    toast.success(`${item.name} added! +${item.points} points!`, {
      icon: "🎉"
    });
  };

  const updateQuantity = (id: number, change: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + change);
          return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean) as OrderItem[];
    });
  };

  const getTotalPrice = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0);

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty! Start building your combo!");
      return;
    }
    setIsOrderModalOpen(true);
  };

  const submitOrder = () => {
    if (!customerName || !phoneNumber) {
      toast.error("Please fill in all fields");
      return;
    }

    setOrderPlaced(true);
    setIsOrderModalOpen(false);
    setCart([]);
    setCustomerName("");
    setPhoneNumber("");
    
    toast.success("🎊 Order placed! Level up complete!", {
      icon: "🏆"
    });
  };

  const getProgressWidth = () => {
    const pointsInLevel = totalPoints % 50;
    return (pointsInLevel / 50) * 100;
  };

  const OrderSuccessModal = () => (
    <Dialog open={orderPlaced} onOpenChange={setOrderPlaced}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary animate-pulse-grow">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-2xl">Level Up! 🎉</DialogTitle>
          <DialogDescription className="text-lg">
            Congratulations! Your Brazilian feast is on its way!
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg">Level {level} Achieved!</span>
            <Sparkles className="h-5 w-5 text-secondary" />
          </div>
          <p className="text-sm text-muted-foreground">
            You earned {totalPoints} flavor points! Our AI chef will contact you via WhatsApp within 5 minutes.
          </p>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={() => setOrderPlaced(false)} 
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            Continue Your Food Journey
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* Confetti Animation */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="fixed w-2 h-2 rounded-full animate-confetti pointer-events-none z-50"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            backgroundColor: piece.color,
          }}
        />
      ))}

      {/* Gamified Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-lg animate-pulse-grow">
                  SB
                </div>
                <div className="absolute -top-1 -right-1 bg-warning text-warning-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {level}
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Sabor Brasileiro
                </h1>
                <p className="text-sm text-muted-foreground">Level {level} Food Explorer</p>
              </div>
            </div>
            
            {/* Points & Cart */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full px-3 py-1">
                <Target className="h-4 w-4 text-primary" />
                <span className="font-bold text-sm">{totalPoints}</span>
                <span className="text-xs text-muted-foreground">pts</span>
              </div>
              
              <Button 
                variant="outline" 
                onClick={handlePlaceOrder}
                className="relative bg-gradient-to-r from-primary to-secondary text-white border-0 hover:from-primary/90 hover:to-secondary/90"
                disabled={cart.length === 0}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Order ({getTotalItems()})
                {cart.length > 0 && (
                  <Badge variant="secondary" className="ml-2 animate-bounce-in">
                    ${getTotalPrice().toFixed(2)}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Progress to Level {level + 1}</span>
              <span>{totalPoints % 50}/50 pts</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
                style={{ width: `${getProgressWidth()}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Featured Products Carousel */}
          <div className="lg:col-span-3">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Build Your Brazilian Combo!
              </h2>
              <p className="text-muted-foreground">
                Each item gives you flavor points. Collect points to level up! 🚀
              </p>
            </div>
            
            <Carousel className="w-full">
              <CarouselContent>
                {menuItems.map((item) => (
                  <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-primary/5">
                      <CardContent className="p-6">
                        <div className="text-center">
                          <div className="text-6xl mb-4 animate-bounce-in">{item.image}</div>
                          <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                          <p className="text-sm text-muted-foreground mb-4 h-12">
                            {item.description}
                          </p>
                          
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-2xl font-bold text-primary">
                              ${item.price.toFixed(2)}
                            </span>
                            <div className="flex items-center space-x-1 bg-warning/20 rounded-full px-2 py-1">
                              <Sparkles className="h-3 w-3 text-warning" />
                              <span className="text-xs font-bold text-warning">+{item.points}</span>
                            </div>
                          </div>
                          
                          <Button 
                            onClick={() => addToCart(item)}
                            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transform transition-all duration-200 hover:scale-105"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add to Combo
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-32 bg-gradient-to-br from-white to-secondary/5">
              <div className="p-4 bg-gradient-to-r from-primary to-secondary text-white rounded-t-lg">
                <h3 className="font-bold flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Your Combo
                </h3>
              </div>
              
              <CardContent className="p-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">🍽️</div>
                    <p className="text-muted-foreground">Start building your Brazilian combo!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between animate-slide-up">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <div className="flex items-center space-x-2 text-xs">
                            <span className="text-muted-foreground">${item.price.toFixed(2)}</span>
                            <span className="text-warning">+{item.points}pts</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="h-6 w-6 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="h-6 w-6 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center font-bold">
                        <span>Total:</span>
                        <span className="text-primary">${getTotalPrice().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Flavor Points:</span>
                        <span className="text-warning font-bold">{totalPoints} pts</span>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handlePlaceOrder} 
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                    >
                      Complete Order
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-primary" />
              Complete Your Order
            </DialogTitle>
            <DialogDescription>
              You're about to level up! Enter your details to receive confirmation via WhatsApp
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Full Name
              </Label>
              <Input
                id="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                WhatsApp Number
              </Label>
              <Input
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Level {level} Combo</span>
                <span className="text-warning font-bold">{totalPoints} pts</span>
              </div>
              <div className="space-y-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.name}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-primary">
                <span>Total:</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex-col-reverse sm:flex-row">
            <Button variant="outline" onClick={() => setIsOrderModalOpen(false)}>
              Back to Menu
            </Button>
            <Button 
              onClick={submitOrder}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirm Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <OrderSuccessModal />
    </div>
  );
}