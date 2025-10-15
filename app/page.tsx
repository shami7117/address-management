"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Zap, CheckCircle, Lock, Clock, Sparkles } from 'lucide-react';
import ParticlesBackground from './ParticlesBackground';


// Floating Background Shapes
const FloatingShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-64 h-64 bg-purple-400/20 rounded-full "
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ top: '10%', left: '10%' }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-blue-400/20 rounded-full blur-xl md:blur-none"
        animate={{
          x: [0, -150, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ top: '40%', right: '10%' }}
      />
      <motion.div
        className="absolute w-72 h-72 bg-pink-400/20 rounded-full blur-xl md:blur-none"
        animate={{
          x: [0, 80, 0],
          y: [0, 150, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ bottom: '20%', left: '20%' }}
      />
    </div>
  );
};

// Code Input Boxes Component
const CodeInputBoxes = ({ onComplete, error }: { onComplete: (code: string) => void; error: boolean }) => {
  const [values, setValues] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^[A-Z0-9]*$/.test(value.toUpperCase())) return;

    const newValues = [...values];
    newValues[index] = value.toUpperCase().slice(-1);
    setValues(newValues);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newValues.every(v => v) && newValues.join('').length === 6) {
      onComplete(newValues.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').toUpperCase().slice(0, 6);
    const newValues = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setValues(newValues);
    if (newValues.every(v => v)) {
      onComplete(newValues.join(''));
    }
  };

  useEffect(() => {
    if (error) {
      setValues(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  }, [error]);

  return (
    <div className="flex gap-2 justify-center">
      {values.map((value, index) => (
        <motion.input
          key={index}
          // ref={el => inputRefs.current[index] = el}
          type="text"
          maxLength={1}
          value={value}
          onChange={e => handleChange(index, e.target.value)}
          onKeyDown={e => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none bg-white"
          animate={error ? {
            x: [0, -10, 10, -10, 10, 0],
          } : {}}
          transition={{ duration: 0.4 }}
          whileFocus={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        />
      ))}
    </div>
  );
};

// Code Form Component
const CodeForm = () => {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (code: string) => {
    setIsSubmitting(true);
    setError('');

    // Simulate validation
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (code === 'ABC123') {
      // Success - redirect or show success
      alert('Code verified successfully!');
    } else {
      setError('Invalid code. Please try again.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <CodeInputBoxes onComplete={handleSubmit} error={!!error} />
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      <motion.button
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold text-lg shadow-lg disabled:opacity-50"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Verifying...' : 'Submit Code'}
      </motion.button>
    </div>
  );
};

// Hero Section
const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* <FloatingShapes /> */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <motion.h1
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4"
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
              <CardDescription className="text-center">
                Enter the code you received via email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeForm />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <p className="text-sm text-gray-500">
            Didn't receive a code? <a href="#" className="text-purple-600 hover:underline">Resend code</a>
          </p>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="text-gray-400">↓ Scroll to learn more</div>
      </motion.div>
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
   <div className="min-h-screen ">
      {/* Three.js Particle Background - renders behind all content */}
      <ParticlesBackground />
      
      {/* All your existing sections with proper z-index layering */}
      <div className="relative z-10">
        <HeroSection />
        <HowItWorksSection />
        <FeatureSection />
        <CTASection />
        
        <footer className="py-8 text-center text-gray-500 text-sm bg-gray-50">
          <p>© 2025 COPARK rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}