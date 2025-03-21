'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { Copy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChainData {
  chainId: string;
  chainName: string;
}



export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [selectedCurrency, setSelectedCurrency] = useState('ETH');
  const [availableChains, setAvailableChains] = useState<ChainData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // const walletAddress = 'UQA1w69-2B1MHYOTONCEXG6_juu6wQ22-1r5dhD jU7un';
  const [walletAddress, setWalletAddress] = useState<string>("");

  useEffect(() => {
    const fetchWalletAddress = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage or sessionStorage
        if (!token) {
          throw new Error('No authentication token found');
        }
        const response = await fetch('http://localhost:3300/api/v1/wallet/address', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok)
          throw new Error(`Failed to fetch wallet address: ${response.statusText}`);

        const data = await response.json();
        if (!data || !data.walletAddress)
          throw new Error('Invalid wallet address response');

        setWalletAddress(data.walletAddress);
      } catch (error) {
        console.error('Error fetching wallet address:', error);
        toast({
          title: 'Error',
          description: 'Unauthorized or failed to fetch wallet address',
          variant: 'destructive',
        });
      }
    };
    // const fetchWalletAddress = async () => {
    //   try {

    //     const response = await fetch('http://localhost:3300/api/v1/wallet/address');
    //     if (!response.ok) {
    //       throw new Error('Failed to fetch wallet address');
    //     }
    //     const data = await response.json();

    //     console.log("*******data", data);


    //     if (!data || !data.address) {
    //       throw new Error('Invalid wallet address response');
    //     }

    //     setWalletAddress(data.address);
    //   } catch (error) {
    //     console.error('Error fetching wallet address:', error);
    //     toast({
    //       title: 'Error',
    //       description: 'Failed to fetch wallet address',
    //       variant: 'destructive',
    //     });
    //   }
    // };

    const fetchChains = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:3300/api/v1/chain');
        if (!response.ok)
          throw new Error('Failed to fetch chains');

        const data = await response.json();
        if (!data || !data.data || !Array.isArray(data.data))
          throw new Error("Invalid response format: expected an array inside data.data");

        const validChains = data.data.filter((chain: unknown): chain is ChainData => {
          const isValid =
            typeof chain === "object" &&
            chain !== null &&
            "chainId" in chain &&
            "chainName" in chain &&
            typeof (chain as ChainData).chainId === "number" &&
            typeof (chain as ChainData).chainName === "string";
          return isValid;
        });

        setAvailableChains(validChains);
        if (validChains.length > 0) {
          setSelectedCurrency(validChains[0].chainName);
        }
      } catch (error) {
        console.error('Error fetching chains:', error);
        toast({
          title: "Error",
          description: "Failed to load available currencies",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchChains();
      fetchWalletAddress()
    }
  }, [isOpen, toast]);

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
        <DialogTitle className="sr-only">Wallet Modal</DialogTitle>
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
                  <SelectValue>{isLoading ? 'Loading...' : selectedCurrency}</SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-[#1E1E2E] border-gray-800">
                  {availableChains.map((chain) => (
                    <SelectItem
                      key={chain.chainId}
                      value={chain.chainName}
                      className="text-white hover:bg-[#2a2a3a]"
                    >
                      {chain.chainName}
                    </SelectItem>
                  ))}
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