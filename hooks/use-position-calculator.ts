"use client"

import { useState, useMemo, useCallback } from "react"

export interface CalculatorInputs {
  assetClass: string
  isLong: boolean
  accountBalance: string
  riskPercent: string
  riskDollar: string
  entryPrice: string
  stopLoss: string
  leverage: string
  showAdvanced: boolean
  addTakeProfit: boolean
  takeProfitPrice: string
  includeFees: boolean
  tradingFee: string
  slippage: string
}

export interface CalculatorResults {
  positionSize: number
  totalValue: number
  requiredMargin: number
  riskAmount: number
  riskDistance: number
  riskDistancePercent: number
  accountRisk: number
  positionRisk: number
  marginUsed: number
  maxLosses: number
  buyingPower: number
  rrRatio: string
  potentialLoss: number
  potentialGain: number
  netPosition: number
  breakEven: number
}

export interface RiskLevel {
  label: string
  color: string
  bgColor: string
}

const initialInputs: CalculatorInputs = {
  assetClass: "Cryptocurrency",
  isLong: true,
  accountBalance: "",
  riskPercent: "",
  riskDollar: "",
  entryPrice: "",
  stopLoss: "",
  leverage: "",
  showAdvanced: false,
  addTakeProfit: false,
  takeProfitPrice: "",
  includeFees: false,
  tradingFee: "",
  slippage: "",
}

const emptyResults: CalculatorResults = {
  positionSize: 0,
  totalValue: 0,
  requiredMargin: 0,
  riskAmount: 0,
  riskDistance: 0,
  riskDistancePercent: 0,
  accountRisk: 0,
  positionRisk: 0,
  marginUsed: 0,
  maxLosses: 0,
  buyingPower: 0,
  rrRatio: "0:0",
  potentialLoss: 0,
  potentialGain: 0,
  netPosition: 0,
  breakEven: 0,
}

export function usePositionCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>(initialInputs)

  // Derived calculations using useMemo instead of useState + useEffect
  const results = useMemo<CalculatorResults>(() => {
    const entryNum = Number.parseFloat(inputs.entryPrice)
    const stopNum = Number.parseFloat(inputs.stopLoss)
    const balanceNum = Number.parseFloat(inputs.accountBalance)
    const riskDollarNum = Number.parseFloat(inputs.riskDollar)
    const leverageNum = Number.parseFloat(inputs.leverage) || 1

    if (
      !entryNum ||
      entryNum <= 0 ||
      !stopNum ||
      stopNum <= 0 ||
      !balanceNum ||
      balanceNum <= 0 ||
      !riskDollarNum ||
      riskDollarNum <= 0
    ) {
      return emptyResults
    }

    const riskAmount = riskDollarNum
    const riskDistance = Math.abs(entryNum - stopNum)
    const riskDistancePercent = (riskDistance / entryNum) * 100

    const positionSize = riskDistance !== 0 ? riskAmount / riskDistance : 0
    const totalValue = positionSize * entryNum
    const requiredMargin = leverageNum !== 0 ? totalValue / leverageNum : totalValue

    const accountRisk = balanceNum !== 0 ? (riskAmount / balanceNum) * 100 : 0
    const positionRisk = riskDistancePercent
    const marginUsed = balanceNum !== 0 ? (requiredMargin / balanceNum) * 100 : 0
    const maxLosses = accountRisk !== 0 ? Math.floor(100 / accountRisk) : 0
    const buyingPower = marginUsed

    let rrRatio = "0:0"
    let potentialGain = 0
    if (inputs.addTakeProfit && inputs.takeProfitPrice) {
      const takeProfitNum = Number.parseFloat(inputs.takeProfitPrice)
      if (takeProfitNum > 0) {
        const profitDistance = Math.abs(takeProfitNum - entryNum)
        const ratio = riskDistance !== 0 ? profitDistance / riskDistance : 0
        rrRatio = `1:${ratio.toFixed(1)}`
        potentialGain = positionSize * profitDistance
      }
    }

    const tradingFeeNum = Number.parseFloat(inputs.tradingFee) || 0
    const slippageNum = Number.parseFloat(inputs.slippage) || 0
    const feeAmount = inputs.includeFees ? (totalValue * tradingFeeNum) / 100 : 0
    const slippageAmount = inputs.includeFees ? (totalValue * slippageNum) / 100 : 0
    const totalCosts = feeAmount + slippageAmount
    const netPosition = positionSize
    const breakEven = positionSize !== 0 ? entryNum + totalCosts / positionSize : 0

    return {
      positionSize,
      totalValue,
      requiredMargin,
      riskAmount,
      riskDistance,
      riskDistancePercent,
      accountRisk,
      positionRisk,
      marginUsed,
      maxLosses,
      buyingPower,
      rrRatio,
      potentialLoss: riskAmount,
      potentialGain,
      netPosition,
      breakEven,
    }
  }, [inputs])

  const riskLevel = useMemo<RiskLevel>(() => {
    const risk = results.accountRisk
    if (risk < 3) return { label: "CONSERVATIVE", color: "text-success", bgColor: "bg-success" }
    if (risk < 5) return { label: "MODERATE", color: "text-green-500", bgColor: "bg-green-500" }
    if (risk < 7) return { label: "AGGRESSIVE", color: "text-warning", bgColor: "bg-warning" }
    if (risk <= 10) return { label: "HIGH RISK", color: "text-orange-500", bgColor: "bg-orange-500" }
    return { label: "EXTREME RISK", color: "text-destructive", bgColor: "bg-destructive" }
  }, [results.accountRisk])

  const updateInput = useCallback(<K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }))
  }, [])

  const updateRiskFromPercent = useCallback((percent: string) => {
    const percentNum = Number.parseFloat(percent)
    const balanceNum = Number.parseFloat(inputs.accountBalance)
    
    setInputs((prev) => {
      const newInputs = { ...prev, riskPercent: percent }
      if (percentNum > 0 && balanceNum > 0) {
        newInputs.riskDollar = ((balanceNum * percentNum) / 100).toFixed(2)
      }
      return newInputs
    })
  }, [inputs.accountBalance])

  const updateRiskFromDollar = useCallback((dollar: string) => {
    const dollarNum = Number.parseFloat(dollar)
    const balanceNum = Number.parseFloat(inputs.accountBalance)
    
    setInputs((prev) => {
      const newInputs = { ...prev, riskDollar: dollar }
      if (dollarNum > 0 && balanceNum > 0) {
        newInputs.riskPercent = ((dollarNum / balanceNum) * 100).toFixed(2)
      }
      return newInputs
    })
  }, [inputs.accountBalance])

  const updateAccountBalance = useCallback((value: string) => {
    const balanceNum = Number.parseFloat(value)
    const percentNum = Number.parseFloat(inputs.riskPercent)
    const dollarNum = Number.parseFloat(inputs.riskDollar)

    setInputs((prev) => {
      const newInputs = { ...prev, accountBalance: value }
      if (balanceNum > 0 && percentNum > 0) {
        newInputs.riskDollar = ((balanceNum * percentNum) / 100).toFixed(2)
      } else if (balanceNum > 0 && dollarNum > 0) {
        newInputs.riskPercent = ((dollarNum / balanceNum) * 100).toFixed(2)
      }
      return newInputs
    })
  }, [inputs.riskPercent, inputs.riskDollar])

  const reset = useCallback(() => {
    setInputs(initialInputs)
  }, [])

  return {
    inputs,
    results,
    riskLevel,
    updateInput,
    updateRiskFromPercent,
    updateRiskFromDollar,
    updateAccountBalance,
    reset,
  }
}
