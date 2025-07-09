import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, ArrowRight, Users, ShoppingCart, Smartphone, TrendingUp } from "lucide-react";
import { PlanQuiz } from "@/components/landing/PlanQuiz";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: 20,
    description: "Perfect for small Brazilian food businesses starting their digital journey",
    features: [
      "Up to 50 products",
      "Basic store customization",
      "WhatsApp integration",
      "Mobile-responsive store",
      "Basic analytics",
      "Email support"
    ],
    popular: false,
    cta: "Start Building"
  },
  {
    name: "Growth",
    price: 100,
    description: "Ideal for growing businesses with multiple locations or higher volume",
    features: [
      "Up to 500 products",
      "Advanced customization",
      "WhatsApp + Instagram integration",
      "Gamified ordering experience",
      "Advanced analytics",
      "Multi-language support",
      "Priority support",
      "Custom domain"
    ],
    popular: true,
    cta: "Scale Your Business"
  },
  {
    name: "Pro",
    price: 200,
    description: "Enterprise solution for established Brazilian food chains",
    features: [
      "Unlimited products",
      "White-label solution",
      "Multi-platform integration",
      "Advanced gamification",
      "Real-time analytics",
      "API access",
      "Dedicated account manager",
      "Custom integrations"
    ],
    popular: false,
    cta: "Go Enterprise"
  }
];

const testimonials = [
  {
    name: "Maria Santos",
    business: "Casa da Açaí",
    location: "Miami, FL",
    content: "This platform transformed how we serve our community. Orders increased by 300% in just 2 months!",
    rating: 5
  },
  {
    name: "João Silva",
    business: "Pão de Açúcar Bakery",
    location: "Boston, MA",
    content: "Finally a solution that understands Brazilian businesses. The gamified experience keeps customers coming back.",
    rating: 5
  },
  {
    name: "Ana Costa",
    business: "Tropical Bites",
    location: "New York, NY",
    content: "The WhatsApp integration is perfect for our customers. Easy to use and manage.",
    rating: 5
  }
];

export default function LandingPage() {
  const [showQuiz, setShowQuiz] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-brazil rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient-brazil">FoodIa</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
            <Button className="btn-brazil" onClick={handleGetStarted}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/50">
        <div className="container mx-auto text-center max-w-6xl">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            🇧🇷 Built for Brazilian Food Businesses in the USA
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient-brazil animate-slide-up">
            Transform Your Brazilian Food Business
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto animate-slide-up">
            The only food ordering platform designed specifically for Brazilian-owned restaurants, 
            bakeries, and food businesses in the United States.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up">
            <Button size="lg" className="btn-brazil text-lg px-8 py-4" onClick={handleGetStarted}>
              Start Building Your Store
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="btn-outline-brazil text-lg px-8 py-4"
              onClick={() => setShowQuiz(true)}
            >
              Find My Perfect Plan
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-muted-foreground">Brazilian Businesses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">150%</div>
              <div className="text-muted-foreground">Average Order Increase</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-muted-foreground">WhatsApp Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">50+</div>
              <div className="text-muted-foreground">US Cities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Built for Brazilian Culture</h2>
            <p className="text-xl text-muted-foreground">
              Features designed specifically for how Brazilian businesses operate in America
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="card-hover">
              <CardHeader>
                <Smartphone className="w-12 h-12 text-primary mb-4" />
                <CardTitle>WhatsApp Native</CardTitle>
                <CardDescription>
                  Seamless integration with WhatsApp - the way your customers prefer to communicate
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <Users className="w-12 h-12 text-secondary mb-4" />
                <CardTitle>Portuguese Support</CardTitle>
                <CardDescription>
                  Full interface in Portuguese, English, and Spanish for your team and customers
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-accent mb-4" />
                <CardTitle>Gamified Experience</CardTitle>
                <CardDescription>
                  Fun, engaging ordering experience that keeps customers coming back for more
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Honest Pricing</h2>
            <p className="text-xl text-muted-foreground">
              No hidden fees. No setup costs. Cancel anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={plan.name} className={`card-hover relative ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-primary">
                    ${plan.price}
                    <span className="text-lg text-muted-foreground">/month</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'btn-brazil' : 'btn-outline-brazil'}`}
                    onClick={handleGetStarted}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Loved by Brazilian Business Owners</h2>
            <p className="text-xl text-muted-foreground">
              See how we're helping Brazilian entrepreneurs thrive in America
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-hover">
                <CardHeader>
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <CardDescription className="text-base italic">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.business} • {testimonial.location}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-brazil text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of Brazilian food businesses already using FoodIa to grow their customer base and increase orders.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4" onClick={handleGetStarted}>
              Start Your Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary"
              onClick={() => setShowQuiz(true)}
            >
              Take the Quiz First
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-card border-t">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-brazil rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient-brazil">FoodIa</span>
            </div>
            <div className="text-center text-muted-foreground">
              <p>© 2024 FoodIa. Made with ❤️ for Brazilian entrepreneurs in the USA.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Plan Quiz Modal */}
      {showQuiz && (
        <PlanQuiz 
          isOpen={showQuiz} 
          onClose={() => setShowQuiz(false)} 
          onPlanSelected={(planName) => {
            setShowQuiz(false);
            handleGetStarted();
          }}
        />
      )}
    </div>
  );
}