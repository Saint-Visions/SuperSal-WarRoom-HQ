import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Key,
  Database,
  Cloud,
  Shield,
  User,
  Bell,
  Palette,
  Globe,
  Zap,
  Mail,
  Phone,
  Calendar,
  Monitor,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Check,
  X,
  AlertTriangle,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Settings() {
  const [expandedSections, setExpandedSections] = useState<string[]>(['api-keys']);
  const [showSecrets, setShowSecrets] = useState<{ [key: string]: boolean }>({});
  const [formData, setFormData] = useState<any>({});
  const { toast } = useToast();

  // Fetch current settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['/api/settings'],
    initialData: {
      apiKeys: {
        openai: { configured: true, status: 'active' },
        azure: { configured: false, status: 'missing' },
        stripe: { configured: false, status: 'missing' },
        gohighlevel: { configured: false, status: 'missing' },
        microsoft: { configured: false, status: 'missing', 
          keys: ['MICROSOFT_CLIENT_ID', 'MICROSOFT_CLIENT_SECRET', 'MICROSOFT_TENANT_ID'] },
        twilio: { configured: false, status: 'missing' }
      },
      preferences: {
        theme: 'dark',
        notifications: true,
        autoRefresh: true,
        voiceMode: false,
        biometricAuth: false,
        compactMode: false
      },
      system: {
        refreshInterval: 30,
        maxChatHistory: 100,
        autoBackup: true,
        debugMode: false
      },
      integrations: {
        calendar: { enabled: false, provider: 'microsoft' },
        crm: { enabled: true, provider: 'gohighlevel' },
        payments: { enabled: false, provider: 'stripe' },
        sms: { enabled: false, provider: 'twilio' }
      }
    }
  });

  // Save settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/settings", data);
    },
    onSuccess: () => {
      toast({
        title: "Settings Saved",
        description: "Your configuration has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Save Failed",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Test API key mutation
  const testApiMutation = useMutation({
    mutationFn: async (data: { service: string; key: string }) => {
      return await apiRequest("POST", "/api/settings/test-api", data);
    },
    onSuccess: (data) => {
      toast({
        title: "API Test Result",
        description: data.status === 'success' ? 'Connection successful!' : data.message,
        variant: data.status === 'success' ? 'default' : 'destructive',
      });
    }
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const toggleSecret = (key: string) => {
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateFormData = (section: string, key: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value }
    }));
  };

  const handleSave = () => {
    saveSettingsMutation.mutate(formData);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Check className="w-4 h-4 text-green-400" />;
      case 'missing': return <X className="w-4 h-4 text-red-400" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default: return <RefreshCw className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'missing': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'error': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const SettingSection = ({ title, icon: Icon, section, children }: any) => {
    const isExpanded = expandedSections.includes(section);
    return (
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader 
          className="cursor-pointer hover:bg-slate-800/50 transition-colors"
          onClick={() => toggleSection(section)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon className="w-5 h-5 text-blue-400" />
              <CardTitle className="text-lg">{title}</CardTitle>
            </div>
            {isExpanded ? 
              <ChevronDown className="w-5 h-5" /> : 
              <ChevronRight className="w-5 h-5" />
            }
          </div>
        </CardHeader>
        {isExpanded && (
          <CardContent className="space-y-4">
            {children}
          </CardContent>
        )}
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
          <span>Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center space-x-3">
                <Monitor className="w-8 h-8 text-blue-400" />
                <span>SuperSal™ Settings</span>
              </h1>
              <p className="text-slate-400 mt-1">Configure your War Room command center</p>
            </div>
            <Button 
              onClick={handleSave}
              disabled={saveSettingsMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {saveSettingsMutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save All
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          
          {/* API Keys Section */}
          <SettingSection title="API Keys & Integrations" icon={Key} section="api-keys">
            <div className="grid gap-6">
              {Object.entries(settings?.apiKeys || {}).map(([service, config]: [string, any]) => (
                <div key={service} className="border border-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold capitalize">{service}</h3>
                      <Badge className={getStatusColor(config.status)}>
                        {getStatusIcon(config.status)}
                        <span className="ml-1 capitalize">{config.status}</span>
                      </Badge>
                    </div>
                    {config.configured && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => testApiMutation.mutate({ service, key: '' })}
                      >
                        Test Connection
                      </Button>
                    )}
                  </div>
                  
                  {/* Microsoft special case - multiple keys */}
                  {service === 'microsoft' && config.keys ? (
                    <div className="space-y-3">
                      {config.keys.map((keyName: string) => (
                        <div key={keyName} className="flex items-center space-x-2">
                          <Label className="w-48 text-xs text-slate-400">{keyName}</Label>
                          <div className="flex-1 relative">
                            <Input
                              type={showSecrets[keyName] ? "text" : "password"}
                              placeholder={`Enter your ${keyName}`}
                              className="bg-slate-800 border-slate-600 pr-10"
                              onChange={(e) => updateFormData('apiKeys', keyName, e.target.value)}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute right-1 top-1 h-8 w-8 p-0"
                              onClick={() => toggleSecret(keyName)}
                            >
                              {showSecrets[keyName] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                          </div>
                        </div>
                      ))}
                      <div className="text-xs text-slate-500 mt-2">
                        💡 Get these from Azure Portal → App registrations → Your app
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Label className="w-32 text-sm">API Key</Label>
                      <div className="flex-1 relative">
                        <Input
                          type={showSecrets[service] ? "text" : "password"}
                          placeholder={`Enter your ${service} API key`}
                          className="bg-slate-800 border-slate-600 pr-10"
                          onChange={(e) => updateFormData('apiKeys', service, e.target.value)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1 h-8 w-8 p-0"
                          onClick={() => toggleSecret(service)}
                        >
                          {showSecrets[service] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </SettingSection>

          {/* User Preferences */}
          <SettingSection title="User Preferences" icon={User} section="preferences">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="theme">Theme</Label>
                  <Select 
                    value={settings?.preferences?.theme || 'dark'}
                    onValueChange={(value) => updateFormData('preferences', 'theme', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">Notifications</Label>
                  <Switch 
                    id="notifications"
                    checked={settings?.preferences?.notifications}
                    onCheckedChange={(checked) => updateFormData('preferences', 'notifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoRefresh">Auto Refresh</Label>
                  <Switch 
                    id="autoRefresh"
                    checked={settings?.preferences?.autoRefresh}
                    onCheckedChange={(checked) => updateFormData('preferences', 'autoRefresh', checked)}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="voiceMode">Voice Commands</Label>
                  <Switch 
                    id="voiceMode"
                    checked={settings?.preferences?.voiceMode}
                    onCheckedChange={(checked) => updateFormData('preferences', 'voiceMode', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="biometricAuth">Biometric Auth</Label>
                  <Switch 
                    id="biometricAuth"
                    checked={settings?.preferences?.biometricAuth}
                    onCheckedChange={(checked) => updateFormData('preferences', 'biometricAuth', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="compactMode">Compact Mode</Label>
                  <Switch 
                    id="compactMode"
                    checked={settings?.preferences?.compactMode}
                    onCheckedChange={(checked) => updateFormData('preferences', 'compactMode', checked)}
                  />
                </div>
              </div>
            </div>
          </SettingSection>

          {/* System Configuration */}
          <SettingSection title="System Configuration" icon={Monitor} section="system">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="refreshInterval">Refresh Interval (seconds)</Label>
                  <Input
                    id="refreshInterval"
                    type="number"
                    min="5"
                    max="300"
                    value={settings?.system?.refreshInterval || 30}
                    onChange={(e) => updateFormData('system', 'refreshInterval', parseInt(e.target.value))}
                    className="bg-slate-800 border-slate-600 mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="maxChatHistory">Max Chat History</Label>
                  <Input
                    id="maxChatHistory"
                    type="number"
                    min="10"
                    max="1000"
                    value={settings?.system?.maxChatHistory || 100}
                    onChange={(e) => updateFormData('system', 'maxChatHistory', parseInt(e.target.value))}
                    className="bg-slate-800 border-slate-600 mt-1"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoBackup">Auto Backup</Label>
                  <Switch 
                    id="autoBackup"
                    checked={settings?.system?.autoBackup}
                    onCheckedChange={(checked) => updateFormData('system', 'autoBackup', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="debugMode">Debug Mode</Label>
                  <Switch 
                    id="debugMode"
                    checked={settings?.system?.debugMode}
                    onCheckedChange={(checked) => updateFormData('system', 'debugMode', checked)}
                  />
                </div>
              </div>
            </div>
          </SettingSection>

          {/* Integration Status */}
          <SettingSection title="Integration Status" icon={Globe} section="integrations">
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(settings?.integrations || {}).map(([service, config]: [string, any]) => (
                <div key={service} className="flex items-center justify-between p-4 border border-slate-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {service === 'calendar' && <Calendar className="w-5 h-5 text-blue-400" />}
                    {service === 'crm' && <Database className="w-5 h-5 text-green-400" />}
                    {service === 'payments' && <Zap className="w-5 h-5 text-yellow-400" />}
                    {service === 'sms' && <Phone className="w-5 h-5 text-purple-400" />}
                    <div>
                      <h4 className="font-medium capitalize">{service}</h4>
                      <p className="text-xs text-slate-400">{config.provider}</p>
                    </div>
                  </div>
                  <Switch 
                    checked={config.enabled}
                    onCheckedChange={(checked) => updateFormData('integrations', service, { ...config, enabled: checked })}
                  />
                </div>
              ))}
            </div>
          </SettingSection>

        </div>
      </div>
    </div>
  );
}