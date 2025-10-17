// ============================================================================
// 6. FORGOT PASSWORD PAGE - app/(auth)/forgot-password/page.tsx
// ============================================================================
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/hooks/useSupabase';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validationSchemas';

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) throw resetError;

      setSuccess('Check your email for password reset instructions!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email. Please try again.');
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
          <p className="text-[#f0f2f7]/70">Reset your password</p>
        </div>

        <Card className="border-[#11b27c]/30 bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-[#003732]">Reset Password</CardTitle>
            <CardDescription className="text-[#003732]/60">Enter your email to receive reset instructions</CardDescription>
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

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#11b27c] hover:bg-[#0d8b5f] text-white font-semibold transition-all duration-200"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <Link href="/login" className="text-[#11b27c] hover:text-[#0d8b5f] font-medium transition-colors">
                Back to login
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-[#f0f2f7]/50 text-xs mt-6">© 2025 COPARK. All rights reserved.</p>
      </motion.div>
    </div>
  );
}