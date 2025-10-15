"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Zap, CheckCircle, Lock, Clock, Sparkles } from 'lucide-react';
import ParticlesBackground from './ParticlesBackground';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

// Code Input Form
const CodeForm = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const inputRefs:any = useRef([]);

  // Autofocus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index:any, value:any) => {
    if (value.length <= 1 && /^[a-zA-Z0-9]*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value.toUpperCase();
      setCode(newCode);

      // Auto-advance to next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      // Auto-validate when all 6 characters are entered
      if (newCode.every(char => char !== '') && newCode.join('').length === 6) {
        validateCode(newCode.join(''));
      }
    }
  };

  const handleKeyDown = (index:any, e:any) => {
    // Handle backspace to move to previous input
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Handle arrow keys for navigation
    else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e:any) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (pastedData.length === 6) {
      const newCode = pastedData.split('');
      setCode(newCode);
      validateCode(pastedData);
    }
  };

  const validateCode = async (codeString:any) => {
    setIsValidating(true);
    setValidationResult(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock validation logic
    const isValid:any = codeString === 'ABC123' || codeString === 'XYZ789';
    
    setValidationResult(isValid ? 'success' : 'error');
    setIsValidating(false);

    if (isValid) {
      setTimeout(() => {
        alert('Code validated! Redirecting...');
      }, 1000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-2" onPaste={handlePaste}>
        {code.map((digit, index) => (
          <motion.input
            key={index}
ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            // maxLength="1"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
              validationResult === 'success'
                ? 'border-green-500 bg-green-50'
                : validationResult === 'error'
                ? 'border-red-500 bg-red-50 shake'
                : 'border-gray-300 focus:border-purple-500 focus:ring-purple-200'
            }`}
            disabled={isValidating}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          />
        ))}
      </div>

      {isValidating && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 text-purple-600"
        >
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Validating code...</span>
        </motion.div>
      )}

      {validationResult === 'success' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Alert className="border-green-500 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Code validated successfully! Redirecting...
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {validationResult === 'error' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Alert className="border-red-500 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Invalid code. Please check and try again.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      <p className="text-sm text-gray-500 text-center">
        Enter your 6-character registration code
      </p>
    </div>
  );
};

// Hero Section
const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-black mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring", bounce: 0.4 }}
          >
            Enter Your Code
          </motion.h1>
          
          <motion.p
            className="text-xl text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Please enter your 6-character registration code to continue
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/90">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Registration Code</CardTitle>
            </CardHeader>
            <CardContent>
              <CodeForm />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

// Scroll Reveal Wrapper
const ScrollReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

// Feature Section
const FeatureSection = () => {
  const features = [
    {
      icon: Lock,
      title: "Secure",
      description: "Your code is encrypted and verified through secure channels"
    },
    {
      icon: Zap,
      title: "Fast",
      description: "Instant verification with real-time validation"
    },
    {
      icon: CheckCircle,
      title: "Simple",
      description: "Just enter your code and you're ready to go"
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <h2 className="text-4xl font-bold text-center mb-4">Why Use This?</h2>
          <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Our registration system is designed to be secure, fast, and incredibly easy to use
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <ScrollReveal key={index} delay={index * 0.2}>
              <motion.div
                className="text-center p-8 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 hover:shadow-xl transition-shadow"
                whileHover={{ y: -5 }}
              >
                <motion.div
                  className="inline-block p-4 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// How It Works Section
const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Enter Code",
      description: "Type or paste your 6-character registration code"
    },
    {
      number: "02",
      title: "Verify",
      description: "Our system validates your code in real-time"
    },
    {
      number: "03",
      title: "Continue",
      description: "Get instant access to your account or service"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <h2 className="text-4xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Three simple steps to complete your registration
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <ScrollReveal key={index} delay={index * 0.15}>
              <div className="relative">
                <motion.div
                  className="bg-white p-8 rounded-xl shadow-lg"
                  // whileHover={{ y: -5, shadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                >
                  <div className="text-6xl font-bold text-purple-200 mb-4">{step.number}</div>
                  <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </motion.div>
                
                {index < steps.length - 1 && (
                  <motion.div
                    className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ delay: 0.5 + index * 0.15, duration: 0.6 }}
                  />
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTASection = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <motion.div
            className="relative p-12 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 text-white text-center overflow-hidden"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              className="absolute inset-0 opacity-20"
              animate={{
                background: [
                  "radial-gradient(circle at 0% 0%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 100% 100%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 0% 0%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                ]
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            
            <div className="relative z-10">
              <Sparkles className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Got Your Code?</h2>
              <p className="text-lg mb-6 opacity-90">
                Enter it in the form above and get started in seconds!
              </p>
              <motion.button
                className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Enter Code Now
              </motion.button>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
};

// Main Page Component
export default function RegistrationPage() {
  return (
   <div className="min-h-screen relative">
      {/* Three.js Particle Background - renders behind all content */}
      <ParticlesBackground />
      
      {/* All your existing sections with proper z-index layering */}
      <div className="relative z-10">
        <HeroSection />
        {/* <HowItWorksSection />
        <FeatureSection />
        <CTASection /> */}
        
        <footer className="py-8 text-center text-gray-500 text-sm bg-gray-50">
          <p>© 2025 COPARK rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}