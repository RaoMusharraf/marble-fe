import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Transaction } from "@/types/transaction"
import { formatDate } from "@/lib/utils"

interface TransactionHistoryProps {
  transactions: Transaction[]
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No transactions yet</p>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                <div>
                  <p className="font-medium capitalize">{transaction.type}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
                </div>
                <p className={`font-medium ${transaction.type === "deposit" ? "text-green-600" : "text-red-600"}`}>
                  {transaction.type === "deposit" ? "+" : "-"}${transaction.amount.toFixed(2)}
                </p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

