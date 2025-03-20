"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface DepositFormProps {
  onDeposit: (amount: number) => void
}

export function DepositForm({ onDeposit }: DepositFormProps) {
  const [amount, setAmount] = useState("")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const depositAmount = Number.parseFloat(amount)

    if (isNaN(depositAmount) || depositAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid positive number",
        variant: "destructive",
      })
      return
    }

    onDeposit(depositAmount)
    setAmount("")

    toast({
      title: "Deposit successful",
      description: `$${depositAmount.toFixed(2)} has been added to your account`,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="deposit-amount">Amount</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-gray-500">$</span>
          </div>
          <Input
            id="deposit-amount"
            type="number"
            placeholder="0.00"
            min="0.01"
            step="0.01"
            className="pl-8"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
      </div>
      <Button type="submit" className="w-full">
        Deposit Funds
      </Button>
    </form>
  )
}

