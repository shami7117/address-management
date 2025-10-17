// ============================================================================
// 7. RESET PASSWORD PAGE - app/(auth)/reset-password/page.tsx
// ============================================================================
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/hooks/useSupabase';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validationSchemas';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setSessionReady(true);
      } else {
        setError('Invalid or expired reset link. Please request a new one.');
      }
    };
    checkSession();
  }, []);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (updateError) throw updateError;

      setSuccess('Password updated successfully! Redirecting to login...');
      setTimeout(() => {
        supabase.auth.signOut();
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!sessionReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#003732] via-[#003732] to-[#1a5c56]">
        <Card className="border-[#11b27c]/30 bg-white/95">
          <CardContent className="pt-6">
            <Alert className="bg-red-50 border-red-200 text-red-700">
              <AlertDescription>Loading reset page...</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <p className="text-[#f0f2f7]/70">Set your new password</p>
        </div>

        <Card className="border-[#11b27c]/30 bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-[#003732]">Set New Password</CardTitle>
            <CardDescription className="text-[#003732]/60">Enter your new password</CardDescription>
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
                <label className="text-sm font-medium text-[#003732]">New Password</label>
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#003732]">Confirm Password</label>
                <Input
                  {...register('confirmPassword')}
                  type="password"
                  placeholder="••••••••"
                  className="border-[#11b27c]/30 text-[#003732] placeholder:text-[#003732]/40 focus:border-[#11b27c] focus:ring-[#11b27c]/20"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#11b27c] hover:bg-[#0d8b5f] text-white font-semibold transition-all duration-200"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-[#f0f2f7]/50 text-xs mt-6">© 2025 COPARK. All rights reserved.</p>
      </motion.div>
    </div>
  );
} 