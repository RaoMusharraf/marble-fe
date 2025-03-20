"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface WithdrawFormProps {
  onWithdraw: (amount: number) => boolean
  balance: number
}

export function WithdrawForm({ onWithdraw, balance }: WithdrawFormProps) {
  const [amount, setAmount] = useState("")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const withdrawAmount = Number.parseFloat(amount)

    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid positive number",
        variant: "destructive",
      })
      return
    }

    if (withdrawAmount > balance) {
      toast({
        title: "Insufficient funds",
        description: `Your current balance is $${balance.toFixed(2)}`,
        variant: "destructive",
      })
      return
    }

    const success = onWithdraw(withdrawAmount)

    if (success) {
      setAmount("")
      toast({
        title: "Withdrawal successful",
        description: `$${withdrawAmount.toFixed(2)} has been withdrawn from your account`,
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="withdraw-amount">Amount</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-gray-500">$</span>
          </div>
          <Input
            id="withdraw-amount"
            type="number"
            placeholder="0.00"
            min="0.01"
            step="0.01"
            max={balance}
            className="pl-8"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <p className="text-sm text-muted-foreground">Available balance: ${balance.toFixed(2)}</p>
      </div>
      <Button type="submit" className="w-full">
        Withdraw Funds
      </Button>
    </form>
  )
}

