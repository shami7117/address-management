// ============================================================================
// app/(auth)/login/page.tsx - FIXED VERSION
// ============================================================================
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createClient } from '@/lib/supabase';
import { loginSchema, type LoginFormData } from '@/lib/validationSchemas';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const supabase = createClient();
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;

      console.log('Login successful:', authData);

      setSuccess('Login successful! Redirecting...');
      
      // Force a hard navigation to ensure middleware picks up the session
      window.location.href = '/user';
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#003732] via-[#003732] to-[#1a5c56] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">COPARK</h1>
          <p className="text-[#f0f2f7]/70">Welcome back</p>
        </div>

        <Card className="border-[#11b27c]/30 bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-[#003732]">Login</CardTitle>
            <CardDescription className="text-[#003732]/60">Sign in to your COPARK account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert className="bg-red-50 border-red-200 text-red-700">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="bg-[#11b27c]/10 border-[#11b27c]/50 text-[#11b27c]">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#003732]">Email</label>
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className="border-[#11b27c]/30 text-[#003732] placeholder:text-[#003732]/40 focus:border-[#11b27c] focus:ring-[#11b27c]/20"
                />
                {errors.email && (
                  <p className="text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#003732]">Password</label>
                <Input
                  {...register('password')}
                  type="password"
                  placeholder="••••••••"
                  className="border-[#11b27c]/30 text-[#003732] placeholder:text-[#003732]/40 focus:border-[#11b27c] focus:ring-[#11b27c]/20"
                />
                {errors.password && (
                  <p className="text-xs text-red-600">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#11b27c] hover:bg-[#0d8b5f] text-white font-semibold transition-all duration-200"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 space-y-3 text-center text-sm">
              <Link href="/forgot-password" className="block text-[#11b27c] hover:text-[#0d8b5f] font-medium transition-colors">
                Forgot password?
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-[#f0f2f7]/50 text-xs mt-6">© 2025 COPARK. All rights reserved.</p>
      </motion.div>
    </div>
  );
}