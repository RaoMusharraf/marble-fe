export interface Transaction {
  id: string
  type: "deposit" | "withdrawal"
  amount: number
  date: string
}

