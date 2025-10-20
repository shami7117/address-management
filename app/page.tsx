"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Zap, CheckCircle, Lock, Clock, Sparkles } from 'lucide-react';
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
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
              validationResult === 'success'
                ? 'border-[#11b27c] bg-[#11b27c]/10'
                : validationResult === 'error'
                ? 'border-red-500 bg-red-50 shake'
                : 'border-[#f0f2f7] focus:border-[#11b27c] focus:ring-[#11b27c]/30 bg-white'
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
          className="flex items-center justify-center gap-2"
          style={{ color: '#11b27c' }}
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
          <Alert className="border-[#11b27c]" style={{ backgroundColor: '#11b27c/10' }}>
            <CheckCircle2 className="h-4 w-4" style={{ color: '#11b27c' }} />
            <AlertDescription style={{ color: '#003732' }}>
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

      <p className="text-sm text-center" style={{ color: '#003732' }}>
        Enter your 6-character registration code
      </p>
    </div>
  );
};

// Hero Section
const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{ backgroundColor: '#003732' }}></div>
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-4"
            style={{ color: '#003732' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring", bounce: 0.4 }}
          >
Indtast din kode
          </motion.h1>
          
          <motion.p
            className="text-xl"
            style={{ color: '#003732' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Indtast venligst din 6-tegns registreringskode for at fortsætte
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Card className="shadow-2xl border-0 backdrop-blur-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
            <CardHeader>
              <CardTitle className="text-2xl text-center" style={{ color: '#003732' }}>Registration Code</CardTitle>
            </CardHeader>
            <CardContent>
              <CodeForm />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Animated Gradient Orbs */}
      <div className="absolute top-10 right-10 w-64 h-64 opacity-30 " style={{ backgroundColor: '#11b27c' }}></div>
      <div className="absolute bottom-10 left-10 w-64 h-64 opacity-20 " style={{ backgroundColor: '#003732' }}></div>
      <motion.div 
        className="absolute top-1/3 left-1/4 w-48 h-48 rounded-full opacity-20 "
        style={{ backgroundColor: '#11b27c' }}
        animate={{ 
          x: [0, 30, -30, 0],
          y: [0, -30, 30, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      ></motion.div>
    </section>
  );
};

// Main Page Component
export default function RegistrationPage() {
  return (
   <div className="min-h-screen relative" style={{ backgroundColor: '#f0f2f7' }}>
      {/* All your existing sections with proper z-index layering */}
      <div className="relative z-10">
        <HeroSection />
       
        
        <footer className="py-8 text-center text-sm" style={{ backgroundColor: '#ffffff', color: '#003732', borderTop: '1px solid #f0f2f7' }}>
          <p>© 2025 COPARK rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}