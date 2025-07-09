// Update this page (the content is just a fallback if you fail to update the page)

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold mb-4">🇧🇷 Sabor Brasileiro</h1>
        <p className="text-xl text-muted-foreground">Authentic Brazilian Cuisine SaaS Platform</p>
        <div className="flex gap-4 justify-center">
          <Link to="/order">
            <Button size="lg">Customer Order Page</Button>
          </Link>
          <Link to="/admin">
            <Button variant="outline" size="lg">Admin Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
