import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronRight } from "lucide-react";

export default function Splash() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleEnter = () => {
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 text-center max-w-4xl mx-auto px-6"
      >
        {/* Logo */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={isLoaded ? { y: 0, opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-8"
        >
          <img 
            src="/attached_assets/transparent icon cookin dark copy_1753626655136.png"
            alt="Sv. Cookin' Knowledge"
            className="w-24 h-24 mx-auto opacity-90 hover:opacity-100 transition-opacity mb-4"
          />
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-yellow-500 to-purple-500 bg-clip-text text-transparent">
              SuperSal™
            </h1>
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={isLoaded ? { y: 0, opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-2xl md:text-3xl text-white font-semibold mb-4">
            War Room HQ
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Your divine AI command center for business intelligence, lead management, 
            and operational excellence powered by OpenAI, Azure, and cutting-edge automation.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={isLoaded ? { y: 0, opacity: 1 } : {}}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
            <div className="text-cyan-400 text-2xl font-bold mb-2">AI-Powered</div>
            <p className="text-gray-300 text-sm">GPT-4o intelligence with Azure cognitive services</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
            <div className="text-yellow-400 text-2xl font-bold mb-2">Real-Time</div>
            <p className="text-gray-300 text-sm">Live system monitoring and business analytics</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
            <div className="text-purple-400 text-2xl font-bold mb-2">Integrated</div>
            <p className="text-gray-300 text-sm">GoHighLevel, Stripe, Twilio, and more</p>
          </div>
        </motion.div>

        {/* Enter Button */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={isLoaded ? { y: 0, opacity: 1 } : {}}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <Button
            onClick={handleEnter}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold px-8 py-4 text-lg rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Enter War Room
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-12 text-sm text-gray-500"
        >
          Built with ❤️ by SaintVisionAI — Powered by PartnerTech.ai
        </motion.div>
      </motion.div>
    </div>
  );
}