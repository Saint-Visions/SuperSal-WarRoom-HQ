import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Fingerprint, Eye, EyeOff, Shield, Cpu } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Check for biometric support on mount
  useState(() => {
    if (typeof window !== 'undefined' && 'navigator' in window) {
      setBiometricSupported(!!(navigator as any).credentials && !!(window as any).PublicKeyCredential);
    }
  });

  const handleBiometricLogin = async () => {
    if (!biometricSupported) {
      toast({
        title: "Biometric Not Supported",
        description: "Your device doesn't support biometric authentication",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Mock biometric authentication - in production this would use WebAuthn
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Biometric Authentication Successful",
        description: "Welcome to SuperSal™ War Room HQ",
      });
      
      // Redirect to command center
      window.location.href = "/command";
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: "Please try again or use email/password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Mock login - in production this would validate credentials
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (email && password) {
        toast({
          title: "Login Successful",
          description: "Accessing SuperSal™ War Room HQ",
        });
        
        window.location.href = "/command";
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="bg-black/60 backdrop-blur-xl border-primary/20 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mx-auto"
            >
              <img 
                src="/attached_assets/transparent icon cookin dark copy_1753626655136.png" 
                alt="Sv. Cookin' Knowledge" 
                className="w-32 h-32 mx-auto opacity-90 hover:opacity-100 transition-opacity"
              />
            </motion.div>
            
            <div>
              <CardTitle className="text-2xl font-bold text-white mb-2">
                SuperSal™ War Room HQ
              </CardTitle>
              <p className="text-gray-400 text-sm">
                Divine AI Command Center Access
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Biometric Login */}
            {biometricSupported && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  onClick={handleBiometricLogin}
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/80 text-black font-semibold py-3 h-auto"
                >
                  <Fingerprint className="w-5 h-5 mr-2" />
                  {isLoading ? "Authenticating..." : "Biometric Access"}
                </Button>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-black px-2 text-gray-400">Or continue with</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Email/Password Login */}
            <motion.form
              onSubmit={handleEmailLogin}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: biometricSupported ? 0.6 : 0.4 }}
              className="space-y-4"
            >
              <div>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-gray-600 text-white placeholder:text-gray-400 focus:border-primary"
                  required
                />
              </div>
              
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border-gray-600 text-white placeholder:text-gray-400 focus:border-primary pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </Button>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <Cpu className="w-4 h-4 mr-2 animate-spin" />
                    Accessing...
                  </div>
                ) : (
                  "Enter War Room"
                )}
              </Button>
            </motion.form>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center text-xs text-gray-500"
            >
              Powered by PartnerTech.ai
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}