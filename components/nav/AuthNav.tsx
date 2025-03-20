'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { WalletModal } from '@/components/wallet/WalletModal';
import { AuthModal } from '@/components/auth/AuthModal';

export function AuthNav() {
  const { user } = useAuth();
  const router = useRouter();
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  if (!user) {
    return (
      <>
        <Button
          onClick={() => setIsAuthOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          Get Started
        </Button>
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onVerificationSuccess={() => {
            setIsAuthOpen(false);
          }}
        />
      </>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Button
        onClick={() => setIsWalletOpen(true)}
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        Open Wallet
      </Button>
      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
      />
    </div>
  );
} 