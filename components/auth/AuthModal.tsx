'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerificationSuccess: (authToken: string) => void;
}

export function AuthModal({ isOpen, onClose, onVerificationSuccess }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<'email' | 'code'>('email');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const { setUser } = useAuth()
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleEmailSubmit = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3300/api/v1/auth/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      setAuthMode('code');
      toast({
        title: "Success",
        description: "Please check your email for the verification code",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to authenticate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async () => {
    if (!code) {
      toast({
        title: "Error",
        description: "Please enter the verification code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Sending verification request...');
      const response = await fetch('http://localhost:3300/api/v1/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          otp: code.trim()
        })
      });

      const data = await response.json();
      console.log('Verification response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      if (!data.accessToken) {
        throw new Error('No access token received');
      }

      console.log('Verification successful, access token received');
      toast({
        title: "Success",
        description: "Successfully verified!",
      });

      setUser(data.accessToken)
      onVerificationSuccess(data.accessToken);

      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to verify code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#13131D] text-white border-0 p-6" aria-describedby="auth-modal-description">
        <DialogTitle asChild>
          <h2 className="text-2xl font-semibold text-center">Welcome to Marble.io</h2>
        </DialogTitle>
        <div id="auth-modal-description" className="space-y-6">
          {/* Wallet Connections */}
          <div className="grid grid-cols-6 gap-4">
            <button className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#1E1E2E] hover:bg-[#2a2a3a] transition-colors">
              <Image src="/icons/telegram.svg" alt="Telegram" width={24} height={24} />
            </button>
            <button className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#1E1E2E] hover:bg-[#2a2a3a] transition-colors">
              <Image src="/icons/metamask.svg" alt="MetaMask" width={24} height={24} />
            </button>
            <button className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#1E1E2E] hover:bg-[#2a2a3a] transition-colors">
              <Image src="/icons/fox.svg" alt="Fox" width={24} height={24} />
            </button>
            <button className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#1E1E2E] hover:bg-[#2a2a3a] transition-colors">
              <Image src="/icons/h.svg" alt="H" width={24} height={24} />
            </button>
            <button className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#1E1E2E] hover:bg-[#2a2a3a] transition-colors">
              <Image src="/icons/shield.svg" alt="Shield" width={24} height={24} />
            </button>
            <button className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#1E1E2E] hover:bg-[#2a2a3a] transition-colors">
              <Image src="/icons/wave.svg" alt="Wave" width={24} height={24} />
            </button>
          </div>

          <div className="text-center text-gray-400">or</div>

          {/* Auth Form */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-purple-400 mb-2 block">{authMode === 'email' ? 'Email' : 'Code'}</label>
              <Input
                type={authMode === 'email' ? 'email' : 'text'}
                placeholder={`Type your ${authMode === 'email' ? 'email' : 'code'}`}
                className="bg-[#1E1E2E] border-0 text-white h-12"
                value={authMode === 'email' ? email : code}
                onChange={(e) => authMode === 'email' ? setEmail(e.target.value) : setCode(e.target.value)}
              />
            </div>

            {authMode === 'email' && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                  className="border-purple-600 data-[state=checked]:bg-purple-600"
                />
                <label htmlFor="terms" className="text-sm">
                  I confirm that I am 18 years old and I have read the{' '}
                  <a href="#" className="text-purple-600 hover:underline">Terms of Service</a>
                </label>
              </div>
            )}

            <Button
              className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white"
              disabled={(authMode === 'email' && !termsAccepted) || loading}
              onClick={authMode === 'email' ? handleEmailSubmit : handleCodeSubmit}
            >
              {loading ? 'Please wait...' : 'Sign in'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 