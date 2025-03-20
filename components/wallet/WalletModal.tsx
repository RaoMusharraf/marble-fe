'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import QRCode from 'react-qr-code';
import { Copy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [selectedCurrency, setSelectedCurrency] = useState('ETH');
  const walletAddress = 'UQA1w69-2B1MHYOTONCEXG6_juu6wQ22-1r5dhD jU7un';

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        description: "Address copied to clipboard",
      });
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#13131D] text-white border-0 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Wallet</h2>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('deposit')}
            className={cn(
              "flex-1 py-3 rounded-lg font-medium",
              activeTab === 'deposit' 
                ? "bg-purple-600 text-white" 
                : "text-gray-400"
            )}
          >
            {activeTab === 'deposit' && "✓"} Deposit
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className={cn(
              "flex-1 py-3 rounded-lg font-medium",
              activeTab === 'withdraw' 
                ? "bg-purple-600 text-white" 
                : "text-gray-400"
            )}
          >
            {activeTab === 'withdraw' && "○"} Withdraw
          </button>
        </div>

        {activeTab === 'deposit' && (
          <div className="space-y-6">
            <div>
              <p className="text-gray-400 mb-2">Select Currency</p>
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger className="w-full bg-[#1E1E2E] border-0 text-white h-12">
                  <SelectValue>{selectedCurrency}</SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-[#1E1E2E] border-gray-800">
                  <SelectItem value="ETH" className="text-white hover:bg-[#2a2a3a]">ETH</SelectItem>
                  <SelectItem value="BTC" className="text-white hover:bg-[#2a2a3a]">BTC</SelectItem>
                  <SelectItem value="USDT" className="text-white hover:bg-[#2a2a3a]">USDT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <p className="text-purple-500 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Deposit through Blockchain
              </p>
              
              <div className="flex justify-center">
                <QRCode 
                  value={walletAddress} 
                  size={180}
                  style={{ background: 'white', padding: '16px' }}
                />
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-2">Your personal {selectedCurrency} Deposit address</p>
                <div className="flex items-center gap-2 bg-[#1E1E2E] p-4 rounded-lg">
                  <p className="text-sm text-gray-300 flex-1 font-mono">{walletAddress}</p>
                  <button 
                    onClick={() => copyToClipboard(walletAddress)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              <div className="bg-[#2a1f00] p-4 rounded-lg flex items-start gap-2">
                <span className="text-yellow-500">⚠</span>
                <p className="text-yellow-500 text-sm">Please carefully check the deposit wallet address!</p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 