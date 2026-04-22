'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Calculator, DollarSign, Percent, Calendar } from 'lucide-react'

export function MortgageCalculator({ defaultPrice = 50000000 }: { defaultPrice?: number }) {
  const [price, setPrice] = useState(defaultPrice)
  const [downPayment, setDownPayment] = useState(defaultPrice * 0.3)
  const [interestRate, setInterestRate] = useState(15.5) // Nigerian interest rates are higher
  const [loanTerm, setLoanTerm] = useState(20) // Shorter terms common in Nigeria
  const [monthlyPayment, setMonthlyPayment] = useState(0)

  useEffect(() => {
    const loanAmount = price - downPayment
    const monthlyRate = interestRate / 100 / 12
    const numberOfPayments = loanTerm * 12
    
    if (monthlyRate === 0) {
      setMonthlyPayment(loanAmount / (numberOfPayments || 1))
      return
    }

    const payment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    setMonthlyPayment(payment || 0)
  }, [price, downPayment, interestRate, loanTerm])

  return (
    <Card className="rounded-3xl border-none shadow-xl bg-white dark:bg-zinc-900 overflow-hidden">
      <CardHeader className="bg-indigo-600 text-white p-6">
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Mortgage Calculator (Nigeria)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="text-center p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
          <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-1">Estimated Monthly Payment</p>
          <h3 className="text-4xl font-bold text-indigo-900 dark:text-white">
            ₦{Math.round(monthlyPayment).toLocaleString()}
          </h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Property Price</Label>
              <span className="font-bold">₦{price.toLocaleString()}</span>
            </div>
            <Slider 
              value={[price]} 
              max={500000000} 
              step={1000000} 
              onValueChange={(val) => setPrice(val[0])} 
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Down Payment</Label>
              <span className="font-bold">₦{downPayment.toLocaleString()}</span>
            </div>
            <Slider 
              value={[downPayment]} 
              max={price} 
              step={500000} 
              onValueChange={(val) => setDownPayment(val[0])} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Interest Rate (%)</Label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input 
                  type="number" 
                  value={interestRate} 
                  onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                  className="pl-9 rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Loan Term (Years)</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input 
                  type="number" 
                  value={loanTerm} 
                  onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                  className="pl-9 rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Principal & Interest</span>
            <span className="font-medium">${Math.round(monthlyPayment).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Property Taxes (Est.)</span>
            <span className="font-medium">${Math.round(price * 0.001).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Home Insurance (Est.)</span>
            <span className="font-medium">$150</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

