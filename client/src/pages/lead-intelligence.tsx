import { useState } from "react";
import { motion } from "framer-motion";
import ParallaxBackground from "@/components/parallax-background";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AppleStyleCard, { AppleButton } from "@/components/ui/apple-style-card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Search, 
  Building2, 
  Users, 
  TrendingUp, 
  Globe, 
  Mail, 
  Phone,
  Target,
  Zap,
  Filter,
  Star,
  ArrowRight,
  Database,
  Brain,
  Rocket
} from "lucide-react";
import PartnerTechLogo from "@/components/ui/partnertech-logo";
import { PremiumCookinLogo } from "@/components/ui/logo-components";

interface LeadIntelligence {
  id: string;
  companyName: string;
  domain: string;
  industry: string;
  employeeCount: number;
  revenue: number;
  location: string;
  description: string;
  leadScore: number;
  intent: string;
  source: string;
  contactInfo: any;
  technologies: string[];
  enrichedAt: string;
}

export default function LeadIntelligence() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [selectedIntent, setSelectedIntent] = useState("all");
  const [companySize, setCompanySize] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch lead intelligence data
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['/api/leads/intelligence'],
  });

  // Fetch search campaigns
  const { data: campaigns = [] } = useQuery({
    queryKey: ['/api/leads/campaigns'],
  });

  // Search mutation
  const searchMutation = useMutation({
    mutationFn: async (searchData: any) => {
      return apiRequest('/api/leads/search', {
        method: 'POST',
        body: searchData
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads/intelligence'] });
      toast({
        title: "Search Complete",
        description: `Found ${data.results?.length || 0} leads matching your criteria`
      });
      setIsSearching(false);
    },
  });

  // Enrich lead mutation  
  const enrichMutation = useMutation({
    mutationFn: async (leadId: string) => {
      return apiRequest(`/api/leads/enrich/${leadId}`, {
        method: 'POST'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads/intelligence'] });
      toast({
        title: "Lead Enriched",
        description: "Additional data has been gathered for this lead"
      });
    },
  });

  // Push to CRM mutation
  const pushToCrmMutation = useMutation({
    mutationFn: async (leadId: string) => {
      return apiRequest(`/api/leads/push-crm/${leadId}`, {
        method: 'POST'
      });
    },
    onSuccess: () => {
      toast({
        title: "Pushed to CRM",
        description: "Lead has been added to GoHighLevel CRM"
      });
    },
  });

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    searchMutation.mutate({
      query: searchQuery,
      industry: selectedIndustry !== "all" ? selectedIndustry : null,
      intent: selectedIntent !== "all" ? selectedIntent : null,
      companySize: companySize !== "all" ? companySize : null,
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400 bg-green-400/10";
    if (score >= 60) return "text-yellow-400 bg-yellow-400/10";
    return "text-red-400 bg-red-400/10";
  };

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case "buying": return "text-green-400 bg-green-400/10";
      case "hiring": return "text-blue-400 bg-blue-400/10";
      case "expanding": return "text-purple-400 bg-purple-400/10";
      case "fundraising": return "text-orange-400 bg-orange-400/10";
      default: return "text-gray-400 bg-gray-400/10";
    }
  };

  return (
    <ParallaxBackground className="min-h-screen">
      <div className="min-h-screen bg-charcoal/90 text-white p-6">
        <div className="max-w-7xl mx-auto">
        
        {/* Premium Cookin' Knowledge Wall Logo - Top Left */}
        <div className="absolute top-6 left-6 z-50">
          <PremiumCookinLogo size="lg" animated={true} />
        </div>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 mt-40"
        >
          <div className="flex items-center space-x-4 mb-4">
            <PartnerTechLogo size="lg" animated={true} />
            <div>
              <h1 className="text-3xl font-bold">Lead Intelligence</h1>
              <p className="text-gray-400">Powered by SuperSal™ • OpenAI-level intelligence meets Apple-grade experience</p>
            </div>
          </div>
        </motion.div>

        {/* Search Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <AppleStyleCard glow={true}>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <PartnerTechLogo size="sm" showText={false} />
                <span className="ml-2">Intelligence Engine</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Ask PartnerTech.ai: Find SaaS companies with hiring intent..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/5 border-gray-600 focus:border-primary text-white placeholder-gray-400"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <AppleButton
                  onClick={handleSearch}
                  disabled={isSearching || !searchQuery.trim()}
                  variant="primary"
                  className="px-8"
                >
                  {isSearching ? (
                    <>
                      <Database className="w-4 h-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4 mr-2" />
                      Find Leads
                    </>
                  )}
                </AppleButton>
              </div>

              {/* Advanced Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                  <SelectTrigger className="bg-white/5 border-gray-600">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedIntent} onValueChange={setSelectedIntent}>
                  <SelectTrigger className="bg-white/5 border-gray-600">
                    <SelectValue placeholder="Intent Signal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Intents</SelectItem>
                    <SelectItem value="buying">Buying Intent</SelectItem>
                    <SelectItem value="hiring">Hiring Intent</SelectItem>
                    <SelectItem value="expanding">Expansion Intent</SelectItem>
                    <SelectItem value="fundraising">Fundraising Intent</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={companySize} onValueChange={setCompanySize}>
                  <SelectTrigger className="bg-white/5 border-gray-600">
                    <SelectValue placeholder="Company Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sizes</SelectItem>
                    <SelectItem value="startup">Startup (1-50)</SelectItem>
                    <SelectItem value="mid">Mid-size (51-500)</SelectItem>
                    <SelectItem value="enterprise">Enterprise (500+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </AppleStyleCard>
        </motion.div>

        {/* Results Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {leads.map((lead: LeadIntelligence, index: number) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="bg-black/40 backdrop-blur-xl border-primary/20 h-full hover:border-primary/40 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-5 h-5 text-primary" />
                      <Badge className={getScoreColor(lead.leadScore)}>
                        Score: {lead.leadScore}
                      </Badge>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {lead.source}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg line-clamp-1">{lead.companyName}</CardTitle>
                  <p className="text-sm text-gray-400">{lead.domain}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Industry:</span>
                      <span>{lead.industry}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Employees:</span>
                      <span>{lead.employeeCount?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Revenue:</span>
                      <span>${lead.revenue?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Location:</span>
                      <span>{lead.location}</span>
                    </div>
                  </div>

                  {lead.intent && (
                    <Badge className={getIntentColor(lead.intent)}>
                      <Target className="w-3 h-3 mr-1" />
                      {lead.intent.charAt(0).toUpperCase() + lead.intent.slice(1)} Intent
                    </Badge>
                  )}

                  {lead.description && (
                    <p className="text-xs text-gray-400 line-clamp-3">
                      {lead.description}
                    </p>
                  )}

                  {lead.technologies && lead.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {lead.technologies.slice(0, 3).map((tech: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {lead.technologies.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{lead.technologies.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex space-x-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => enrichMutation.mutate(lead.id)}
                      disabled={enrichMutation.isPending}
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      Enrich
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-primary hover:bg-primary/80 text-black"
                      onClick={() => pushToCrmMutation.mutate(lead.id)}
                      disabled={pushToCrmMutation.isPending}
                    >
                      <ArrowRight className="w-3 h-3 mr-1" />
                      Push CRM
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {leads.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Database className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              PartnerTech.ai Ready
            </h3>
            <p className="text-gray-500 mb-6">
              Ask our AI to discover high-intent prospects for you
            </p>
            <Button
              onClick={() => setSearchQuery("Find technology companies expanding their sales teams")}
              className="bg-primary hover:bg-primary/80 text-black"
            >
              <Brain className="w-4 h-4 mr-2" />
              Try AI Search
            </Button>
          </motion.div>
        )}

        {/* Active Campaigns */}
        {campaigns.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <Card className="bg-black/40 backdrop-blur-xl border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Target className="w-5 h-5 mr-2" />
                  Active Search Campaigns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {campaigns.slice(0, 3).map((campaign: any) => (
                    <div key={campaign.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                      <div>
                        <p className="font-medium">{campaign.name}</p>
                        <p className="text-sm text-gray-400">{campaign.searchQuery}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{campaign.resultsCount} leads</p>
                        <p className="text-xs text-gray-400">
                          {campaign.lastRun ? new Date(campaign.lastRun).toLocaleDateString() : 'Never run'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        </div>
      </div>
    </ParallaxBackground>
  );
}