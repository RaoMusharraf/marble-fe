"use client"

import { useState } from "react"
import { Check, ChevronDown, Copy, X, AlertTriangle } from "lucide-react"
import QRCode from "react-qr-code"

interface WalletModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit")
  const [selectedCurrency, setSelectedCurrency] = useState("ETH")
  const [copied, setCopied] = useState(false)

  // Example wallet address
  const walletAddress = "UQA1w69-2B1MHYOTONCEXGX6_juu6wQ22-1r5d9hDjU7un"

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-[#1e1e2d] text-white rounded-lg shadow-xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Wallet</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <div className="flex rounded-full bg-[#2a2a3a] p-1 mb-6">
            <button
              className={`flex items-center justify-center gap-2 flex-1 py-2 px-4 rounded-full transition-colors ${
                activeTab === "deposit" ? "bg-purple-600 text-white" : "text-gray-400"
              }`}
              onClick={() => setActiveTab("deposit")}
            >
              <Check size={18} className={activeTab === "deposit" ? "opacity-100" : "opacity-0"} />
              Deposit
            </button>
            <button
              className={`flex items-center justify-center gap-2 flex-1 py-2 px-4 rounded-full transition-colors ${
                activeTab === "withdraw" ? "bg-purple-600 text-white" : "text-gray-400"
              }`}
              onClick={() => setActiveTab("withdraw")}
            >
              <Check size={18} className={activeTab === "withdraw" ? "opacity-100" : "opacity-0"} />
              Withdraw
            </button>
          </div>

          {activeTab === "deposit" ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Select Currency</label>
                <button className="w-full bg-[#2a2a3a] rounded px-4 py-3 flex justify-between items-center">
                  <span>{selectedCurrency}</span>
                  <ChevronDown size={20} />
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                  <span className="text-purple-500">Deposit through Blockchain</span>
                </div>

                <div className="flex justify-center mb-4">
                  <div className="bg-white p-2 rounded">
                    <QRCode value={walletAddress} size={180} />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Your personal ETH Deposit address</p>
                  <div className="flex items-center bg-[#2a2a3a] rounded p-3">
                    <p className="text-sm flex-1 truncate mr-2">{walletAddress}</p>
                    <button onClick={handleCopy} className="text-gray-400 hover:text-white">
                      {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>

                <div className="mt-6 bg-[#332b00] text-yellow-400 p-3 rounded flex items-start gap-3">
                  <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                  <p className="text-sm">Please carefully check the deposit wallet address!</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-400">
              <p>Withdraw functionality would go here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

