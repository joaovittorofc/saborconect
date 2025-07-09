import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Brain, MessageCircle, TrendingUp, Users, Target, Lightbulb, Send, Zap, BarChart3, Clock } from "lucide-react";
import { toast } from "sonner";

// AI-generated insights data
const aiInsights = [
  {
    id: 1,
    type: "sales_trend",
    title: "Weekend Sales Surge Detected",
    description: "Your sales increase by 45% on weekends. Consider running weekend-specific promotions.",
    impact: "high",
    action: "Create weekend menu specials",
    confidence: 92
  },
  {
    id: 2,
    type: "product_recommendation",
    title: "Açaí Bowl Popularity Rising",
    description: "Açaí Bowl orders have increased 67% this month. Consider adding more healthy options.",
    impact: "medium",
    action: "Expand healthy menu section",
    confidence: 88
  },
  {
    id: 3,
    type: "customer_behavior",
    title: "Repeat Customer Pattern",
    description: "Customers who order Coxinha de Frango are 3x more likely to become repeat customers.",
    impact: "high",
    action: "Promote Coxinha to new customers",
    confidence: 94
  },
  {
    id: 4,
    type: "timing_optimization",
    title: "Optimal WhatsApp Campaign Time",
    description: "Your customers are most responsive to WhatsApp messages between 2-4 PM on weekdays.",
    impact: "medium",
    action: "Schedule campaigns for 2-4 PM",
    confidence: 85
  }
];

const campaignTemplates = [
  {
    id: 1,
    name: "Weekend Special",
    message: "🍽️ Weekend Special Alert! Get 20% off on all Brazilian main dishes this weekend. Order now through WhatsApp and taste the authentic flavors of Brazil! 🇧🇷",
    target: "all_customers",
    estimatedReach: 247
  },
  {
    id: 2,
    name: "VIP Customer Appreciation",
    message: "🌟 Thank you for being a valued customer! Enjoy a complimentary Brigadeiro Box with your next order of $25 or more. You're the reason we love what we do! ❤️",
    target: "vip_customers",
    estimatedReach: 45
  },
  {
    id: 3,
    name: "New Customer Welcome",
    message: "🎉 Welcome to Sabor Brasileiro! Try our signature Coxinha de Frango with 15% off your first order. Authentic Brazilian flavors await you!",
    target: "new_customers",
    estimatedReach: 12
  }
];

const performanceMetrics = [
  { label: "AI Recommendations Accuracy", value: 91, color: "bg-green-500" },
  { label: "Campaign Success Rate", value: 78, color: "bg-blue-500" },
  { label: "Customer Engagement", value: 84, color: "bg-purple-500" },
  { label: "Revenue Impact", value: 67, color: "bg-orange-500" }
];

export default function AIManager() {
  const [selectedCampaign, setSelectedCampaign] = useState<typeof campaignTemplates[0] | null>(null);
  const [customMessage, setCustomMessage] = useState("");
  const [isLaunching, setIsLaunching] = useState(false);

  const handleLaunchCampaign = async (campaign: typeof campaignTemplates[0]) => {
    setIsLaunching(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success(`Campaign "${campaign.name}" launched to ${campaign.estimatedReach} customers!`);
    setIsLaunching(false);
    setSelectedCampaign(null);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "text-red-600 bg-red-50";
      case "medium": return "text-orange-600 bg-orange-50";
      case "low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getImpactIcon = (type: string) => {
    switch (type) {
      case "sales_trend": return BarChart3;
      case "product_recommendation": return Target;
      case "customer_behavior": return Users;
      case "timing_optimization": return Clock;
      default: return Lightbulb;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <Brain className="h-8 w-8 mr-3 text-primary" />
          AI Manager
        </h1>
        <p className="text-muted-foreground">
          AI-powered insights and automated WhatsApp campaigns for your business
        </p>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold">{metric.value}%</span>
                <Badge variant="outline" className="text-xs">
                  AI Powered
                </Badge>
              </div>
              <Progress value={metric.value} className="h-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="h-5 w-5 mr-2" />
            AI-Generated Insights
          </CardTitle>
          <CardDescription>
            Smart recommendations based on your business data and customer behavior
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {aiInsights.map((insight) => {
              const IconComponent = getImpactIcon(insight.type);
              return (
                <div key={insight.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <IconComponent className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">{insight.title}</h3>
                    </div>
                    <Badge className={getImpactColor(insight.impact)} variant="outline">
                      {insight.impact} impact
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {insight.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">Confidence:</span>
                      <Progress value={insight.confidence} className="w-16 h-2" />
                      <span className="text-xs font-medium">{insight.confidence}%</span>
                    </div>
                    <Button size="sm" variant="outline">
                      {insight.action}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp Campaign Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Campaign Templates
            </CardTitle>
            <CardDescription>
              AI-optimized WhatsApp campaigns for different customer segments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaignTemplates.map((campaign) => (
                <div key={campaign.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{campaign.name}</h3>
                    <Badge variant="secondary">
                      {campaign.estimatedReach} customers
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                    {campaign.message}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Target: {campaign.target.replace('_', ' ')}
                    </span>
                    <Button 
                      size="sm" 
                      onClick={() => handleLaunchCampaign(campaign)}
                      disabled={isLaunching}
                    >
                      {isLaunching ? (
                        <>
                          <Zap className="h-4 w-4 mr-1 animate-spin" />
                          Launching...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-1" />
                          Launch Campaign
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custom Campaign</CardTitle>
            <CardDescription>
              Create a personalized WhatsApp campaign with AI assistance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Campaign Message</label>
                <Textarea
                  placeholder="Write your custom message here..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={6}
                  className="mt-1"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">AI Suggestions</label>
                <div className="space-y-2">
                  {[
                    "Add emojis to increase engagement (+23% open rate)",
                    "Mention specific products for better conversion",
                    "Include a clear call-to-action",
                    "Personalize with customer name"
                  ].map((suggestion, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <Brain className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button className="flex-1">
                  <Zap className="h-4 w-4 mr-2" />
                  AI Optimize
                </Button>
                <Button variant="outline" className="flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  Send Campaign
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Campaign Performance
          </CardTitle>
          <CardDescription>
            Recent WhatsApp campaign results and engagement metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                campaign: "Weekend Special (Jan 13)",
                sent: 247,
                opened: 189,
                clicked: 67,
                orders: 23,
                revenue: 445.50
              },
              {
                campaign: "New Year Promotion (Jan 1)",
                sent: 198,
                opened: 156,
                clicked: 89,
                orders: 34,
                revenue: 678.25
              },
              {
                campaign: "VIP Appreciation (Dec 28)",
                sent: 45,
                opened: 42,
                clicked: 28,
                orders: 19,
                revenue: 387.90
              }
            ].map((campaign, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-sm">{campaign.campaign}</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sent:</span>
                    <span className="font-medium">{campaign.sent}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Opened:</span>
                    <span className="font-medium">{campaign.opened} ({Math.round((campaign.opened/campaign.sent)*100)}%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Clicked:</span>
                    <span className="font-medium">{campaign.clicked} ({Math.round((campaign.clicked/campaign.opened)*100)}%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Orders:</span>
                    <span className="font-medium text-green-600">{campaign.orders}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t pt-2">
                    <span className="text-muted-foreground">Revenue:</span>
                    <span className="font-bold text-primary">${campaign.revenue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}