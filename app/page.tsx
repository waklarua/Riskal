"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Calculator, RotateCcw, ChevronDown, ChevronUp, Info, Shield, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Footer } from "@/components/footer"

export default function PositionSizeCalculator() {
  const [assetClass] = useState("Cryptocurrency")
  const [isLong, setIsLong] = useState(true)
  const [accountBalance, setAccountBalance] = useState("")
  const [riskPercent, setRiskPercent] = useState("")
  const [riskDollar, setRiskDollar] = useState("")
  const [entryPrice, setEntryPrice] = useState("")
  const [stopLoss, setStopLoss] = useState("")
  const [leverage, setLeverage] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [addTakeProfit, setAddTakeProfit] = useState(false)
  const [takeProfitPrice, setTakeProfitPrice] = useState("")
  const [includeFees, setIncludeFees] = useState(false)
  const [tradingFee, setTradingFee] = useState("")
  const [slippage, setSlippage] = useState("")

  // Calculated values
  const [positionSize, setPositionSize] = useState(0)
  const [totalValue, setTotalValue] = useState(0)
  const [requiredMargin, setRequiredMargin] = useState(0)
  const [riskAmount, setRiskAmount] = useState(0)
  const [riskDistance, setRiskDistance] = useState(0)
  const [riskDistancePercent, setRiskDistancePercent] = useState(0)
  const [accountRisk, setAccountRisk] = useState(0)
  const [positionRisk, setPositionRisk] = useState(0)
  const [marginUsed, setMarginUsed] = useState(0)
  const [maxLosses, setMaxLosses] = useState(0)
  const [buyingPower, setBuyingPower] = useState(0)
  const [rrRatio, setRrRatio] = useState("0:0")
  const [potentialLoss, setPotentialLoss] = useState(0)
  const [potentialGain, setPotentialGain] = useState(0)
  const [netPosition, setNetPosition] = useState(0)
  const [breakEven, setBreakEven] = useState(0)

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      // Unregister all existing service workers and clear caches to prevent stale HTML
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => registration.unregister())
      })
      caches.keys().then((names) => {
        names.forEach((name) => caches.delete(name))
      })
      // Register fresh service worker
      navigator.serviceWorker.register("/sw.js").catch(() => {})
    }
  }, [])

  const updateRiskDollar = (percent: number, balance: number) => {
    if (balance > 0 && percent > 0) {
      const dollar = (balance * percent) / 100
      setRiskDollar(dollar.toFixed(2))
    }
  }

  const updateRiskPercent = (dollar: number, balance: number) => {
    if (balance > 0 && dollar > 0) {
      const percent = (dollar / balance) * 100
      setRiskPercent(percent.toFixed(2))
    }
  }

  const handleAccountBalanceChange = (value: string) => {
    setAccountBalance(value)
    const balanceNum = Number.parseFloat(value)
    const percentNum = Number.parseFloat(riskPercent)
    const dollarNum = Number.parseFloat(riskDollar)

    if (balanceNum > 0 && percentNum > 0) {
      updateRiskDollar(percentNum, balanceNum)
    } else if (balanceNum > 0 && dollarNum > 0) {
      updateRiskPercent(dollarNum, balanceNum)
    }
  }

  const handleRiskPercentChange = (value: string) => {
    setRiskPercent(value)
    const percentNum = Number.parseFloat(value)
    const balanceNum = Number.parseFloat(accountBalance)
    if (percentNum > 0 && balanceNum > 0) {
      updateRiskDollar(percentNum, balanceNum)
    }
  }

  const handleRiskDollarChange = (value: string) => {
    setRiskDollar(value)
    const dollarNum = Number.parseFloat(value)
    const balanceNum = Number.parseFloat(accountBalance)
    if (dollarNum > 0 && balanceNum > 0) {
      updateRiskPercent(dollarNum, balanceNum)
    }
  }

  const handleReset = () => {
    setIsLong(true)
    setAccountBalance("")
    setRiskPercent("")
    setRiskDollar("")
    setEntryPrice("")
    setStopLoss("")
    setLeverage("")
    setShowAdvanced(false)
    setAddTakeProfit(false)
    setTakeProfitPrice("")
    setIncludeFees(false)
    setTradingFee("")
    setSlippage("")

    // Clear all calculated results
    setPositionSize(0)
    setTotalValue(0)
    setRequiredMargin(0)
    setRiskAmount(0)
    setRiskDistance(0)
    setRiskDistancePercent(0)
    setAccountRisk(0)
    setPositionRisk(0)
    setMarginUsed(0)
    setMaxLosses(0)
    setBuyingPower(0)
    setRrRatio("0:0")
    setPotentialLoss(0)
    setPotentialGain(0)
    setNetPosition(0)
    setBreakEven(0)
  }

  useEffect(() => {
    const entryNum = Number.parseFloat(entryPrice)
    const stopNum = Number.parseFloat(stopLoss)
    const balanceNum = Number.parseFloat(accountBalance)
    const riskDollarNum = Number.parseFloat(riskDollar)
    const leverageNum = Number.parseFloat(leverage) || 1

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
      // Clear calculations if inputs are empty or invalid
      setPositionSize(0)
      setTotalValue(0)
      setRequiredMargin(0)
      setRiskAmount(0)
      setRiskDistance(0)
      setRiskDistancePercent(0)
      setAccountRisk(0)
      setPositionRisk(0)
      setMarginUsed(0)
      setMaxLosses(0)
      setBuyingPower(0)
      setRrRatio("0:0")
      setPotentialLoss(0)
      setPotentialGain(0)
      setNetPosition(0)
      setBreakEven(0)
      return
    }

    const riskAmountCalc = riskDollarNum
    const riskDistanceCalc = Math.abs(entryNum - stopNum)
    const riskDistancePercentCalc = (riskDistanceCalc / entryNum) * 100

    const positionSizeCalc = riskDistanceCalc !== 0 ? riskAmountCalc / riskDistanceCalc : 0
    const totalValueCalc = positionSizeCalc * entryNum
    const requiredMarginCalc = leverageNum !== 0 ? totalValueCalc / leverageNum : totalValueCalc

    const accountRiskCalc = balanceNum !== 0 ? (riskAmountCalc / balanceNum) * 100 : 0
    const positionRiskCalc = riskDistancePercentCalc
    const marginUsedCalc = balanceNum !== 0 ? (requiredMarginCalc / balanceNum) * 100 : 0
    const maxLossesCalc = accountRiskCalc !== 0 ? Math.floor(100 / accountRiskCalc) : 0
    const buyingPowerCalc = marginUsedCalc

    let rrRatioCalc = "0:0"
    let potentialGainCalc = 0
    if (addTakeProfit && takeProfitPrice) {
      const takeProfitNum = Number.parseFloat(takeProfitPrice)
      if (takeProfitNum > 0) {
        const profitDistance = Math.abs(takeProfitNum - entryNum)
        const ratio = riskDistanceCalc !== 0 ? profitDistance / riskDistanceCalc : 0
        rrRatioCalc = `1:${ratio.toFixed(1)}`
        potentialGainCalc = positionSizeCalc * profitDistance
      }
    }

    const tradingFeeNum = Number.parseFloat(tradingFee) || 0
    const slippageNum = Number.parseFloat(slippage) || 0
    const feeAmount = includeFees ? (totalValueCalc * tradingFeeNum) / 100 : 0
    const slippageAmount = includeFees ? (totalValueCalc * slippageNum) / 100 : 0
    const totalCosts = feeAmount + slippageAmount
    const netPositionCalc = positionSizeCalc
    const breakEvenCalc = positionSizeCalc !== 0 ? entryNum + totalCosts / positionSizeCalc : 0

    setPositionSize(positionSizeCalc)
    setTotalValue(totalValueCalc)
    setRequiredMargin(requiredMarginCalc)
    setRiskAmount(riskAmountCalc)
    setRiskDistance(riskDistanceCalc)
    setRiskDistancePercent(riskDistancePercentCalc)
    setAccountRisk(accountRiskCalc)
    setPositionRisk(positionRiskCalc)
    setMarginUsed(marginUsedCalc)
    setMaxLosses(maxLossesCalc)
    setBuyingPower(buyingPowerCalc)
    setRrRatio(rrRatioCalc)
    setPotentialLoss(riskAmountCalc)
    setPotentialGain(potentialGainCalc)
    setNetPosition(netPositionCalc)
    setBreakEven(breakEvenCalc)
  }, [
    accountBalance,
    riskPercent,
    riskDollar,
    entryPrice,
    stopLoss,
    leverage,
    addTakeProfit,
    takeProfitPrice,
    includeFees,
    tradingFee,
    slippage,
  ])

  const getRiskLevel = (risk: number) => {
    if (risk < 3) return { label: "CONSERVATIVE", color: "text-[#10b981]", bgColor: "bg-[#10b981]" }
    if (risk < 5) return { label: "MODERATE", color: "text-[#22c55e]", bgColor: "bg-[#22c55e]" }
    if (risk < 7) return { label: "AGGRESSIVE", color: "text-[#f59e0b]", bgColor: "bg-[#f59e0b]" }
    if (risk <= 10) return { label: "HIGH RISK", color: "text-[#f97316]", bgColor: "bg-[#f97316]" }
    return { label: "EXTREME RISK", color: "text-[#ef4444]", bgColor: "bg-[#ef4444]" }
  }

  const riskLevel = getRiskLevel(accountRisk)

  const preventScrollChange = (e: React.WheelEvent<HTMLInputElement>) => {
    e.currentTarget.blur()
  }

  return (
    <div className="flex flex-col min-h-svh bg-[#121c31] text-white">
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-5 md:p-8">
        {/* Header */}
        <header className="mb-5 md:mb-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 md:gap-3 min-w-0">
              <div className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/20 shrink-0">
                <Calculator className="w-4 h-4 md:w-5 md:h-5 text-[#3b82f6]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-2 md:gap-2.5">
                  <h1 className="text-lg md:text-2xl font-bold text-[#f3f4f6] leading-tight">Riskal</h1>
                  <span className="hidden md:inline text-[#374151]/60 text-sm font-light">/</span>
                  <h2 className="hidden md:inline text-base font-normal text-[#9ca3af] leading-tight">Position Size Calculator</h2>
                </div>
                <p className="text-[11px] md:text-xs text-[#6b7280] mt-0.5 leading-snug">
                  Calculate your optimal position size in seconds
                </p>
              </div>
            </div>
            <Button
              className="bg-[#ef4444]/10 hover:bg-[#ef4444]/20 border border-[#ef4444]/30 text-[#f87171] hover:text-[#fca5a5] shrink-0 h-8 md:h-10 px-3 md:px-4 rounded-lg transition-all duration-200"
              onClick={handleReset}
            >
              <RotateCcw className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5" />
              <span className="text-xs md:text-sm font-medium">Reset</span>
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Left Panel - Inputs */}
          <div className="bg-[#0d1626] border border-[#374151]/60 rounded-xl p-4 md:p-6 space-y-4 md:space-y-5">
            <div>
              <Label className="text-[#e5e7eb] mb-2 block">Asset Class</Label>
              <div className="bg-[#1f2937] border border-[#374151] rounded-md px-3 py-2 text-white">{assetClass}</div>
            </div>

            {/* Long/Short Toggle */}
            <div className="flex gap-2">
              <Button
                className={cn(
                  "flex-1 h-12 font-semibold",
                  isLong
                    ? "bg-[#10b981] hover:bg-[#059669] text-white font-semibold"
                    : "bg-[#1f2937] hover:bg-[#374151] text-[#d1d5db] border border-[#374151]",
                )}
                onClick={() => setIsLong(true)}
              >
                Long
              </Button>
              <Button
                className={cn(
                  "flex-1 h-12 font-semibold",
                  !isLong
                    ? "bg-[#ef4444] hover:bg-[#dc2626] text-white font-semibold"
                    : "bg-[#1f2937] hover:bg-[#374151] text-[#d1d5db] border border-[#374151]",
                )}
                onClick={() => setIsLong(false)}
              >
                Short
              </Button>
            </div>

            <div>
              <Label className="text-[#e5e7eb] mb-2 flex items-center gap-2">
                Account Balance
                <Info className="w-3 h-3 text-gray-400" />
              </Label>
              <div className="flex gap-2">
                <div className="w-14 bg-[#1f2937] border border-[#374151] rounded-md flex items-center justify-center text-white">
                  $
                </div>
                <Input
                  type="number"
                  value={accountBalance}
                  onChange={(e) => handleAccountBalanceChange(e.target.value)}
                  onWheel={preventScrollChange}
                  placeholder="50"
                  className="bg-[#1f2937] border-[#374151] text-white placeholder:text-[#848992]"
                />
              </div>
            </div>

            {/* Risk Per Trade */}
            <div>
              <Label className="text-[#e5e7eb] mb-2 flex items-center gap-2">
                Risk Per Trade
                <Info className="w-3 h-3 text-gray-400" />
              </Label>
              <div className="flex gap-2">
                {/* Percentage input */}
                <div className="flex-1 relative">
                  <Input
                    type="number"
                    value={riskPercent}
                    onChange={(e) => handleRiskPercentChange(e.target.value)}
                    onWheel={preventScrollChange}
                    placeholder="5"
                    className="bg-[#1f2937] border-[#374151] text-white placeholder:text-[#848992] pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">%</span>
                </div>
                {/* Dollar input */}
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">$</span>
                  <Input
                    type="number"
                    value={riskDollar}
                    onChange={(e) => handleRiskDollarChange(e.target.value)}
                    onWheel={preventScrollChange}
                    placeholder="2.5"
                    className="bg-[#1f2937] border-[#374151] text-white placeholder:text-[#848992] pl-8"
                  />
                </div>
              </div>
            </div>

            {/* Entry Price */}
            <div>
              <Label className="text-[#e5e7eb] mb-2 flex items-center gap-2">
                Entry Price
                <Info className="w-3 h-3 text-gray-400" />
              </Label>
              <Input
                type="number"
                step="0.0001"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                onWheel={preventScrollChange}
                className="bg-[#1f2937] border-[#374151] text-white placeholder:text-[#848992]"
                placeholder="Eg. 1.0777"
              />
            </div>

            {/* Stop Loss */}
            <div>
              <Label className="text-[#e5e7eb] mb-2 flex items-center gap-2">
                Stop Loss
                <Info className="w-3 h-3 text-gray-400" />
              </Label>
              <Input
                type="number"
                step="0.0001"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                onWheel={preventScrollChange}
                className="bg-[#1f2937] border-[#374151] text-white placeholder:text-[#848992]"
                placeholder="Eg. 1.0659"
              />
            </div>

            <div>
              <Label className="text-[#e5e7eb] mb-2 flex items-center gap-2">
                Leverage (Optional)
                <Info className="w-3 h-3 text-gray-400" />
              </Label>
              <Input
                type="number"
                min="1"
                max="125"
                value={leverage}
                onChange={(e) => setLeverage(e.target.value)}
                onWheel={preventScrollChange}
                className="bg-[#1f2937] border-[#374151] text-white placeholder:text-[#848992]"
                placeholder="20"
              />
            </div>

            <div className="bg-[#0d1626] border border-[#374151]/60 rounded-xl p-4">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center justify-between w-full text-white hover:text-[#d1d5db] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">Advanced Options</span>
                </div>
                {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showAdvanced && (
                <div className="mt-4 space-y-4">
                  {/* Take Profit */}
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={addTakeProfit}
                      onCheckedChange={(checked) => setAddTakeProfit(checked as boolean)}
                    />
                    <Label className="text-[#e5e7eb]">Add Take Profit (R:R Analysis)</Label>
                  </div>

                  {addTakeProfit && (
                    <div>
                      <Label className="text-[#e5e7eb] mb-2 flex items-center gap-2">
                        Take Profit Price
                        <Info className="w-3 h-3 text-gray-400" />
                      </Label>
                      <Input
                        type="number"
                        step="0.0001"
                        value={takeProfitPrice}
                        onChange={(e) => setTakeProfitPrice(e.target.value)}
                        onWheel={preventScrollChange}
                        className="bg-[#1f2937] border-[#374151] text-white placeholder:text-[#848992]"
                        placeholder="0"
                      />
                    </div>
                  )}

                  {/* Include Trading Fees */}
                  <div className="flex items-center gap-2">
                    <Checkbox checked={includeFees} onCheckedChange={(checked) => setIncludeFees(checked as boolean)} />
                    <Label className="text-[#e5e7eb]">Include Trading Fees</Label>
                  </div>

                  {includeFees && (
                    <>
                      <div>
                        <Label className="text-[#e5e7eb] mb-2 flex items-center gap-2">
                          Trading Fee %
                          <Info className="w-3 h-3 text-gray-400" />
                        </Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={tradingFee}
                          onChange={(e) => setTradingFee(e.target.value)}
                          onWheel={preventScrollChange}
                          className="bg-[#1f2937] border-[#374151] text-white placeholder:text-[#848992]"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <Label className="text-[#e5e7eb] mb-2 flex items-center gap-2">
                          Slippage %
                          <Info className="w-3 h-3 text-gray-400" />
                        </Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={slippage}
                          onChange={(e) => setSlippage(e.target.value)}
                          onWheel={preventScrollChange}
                          className="bg-[#1f2937] border-[#374151] text-white placeholder:text-[#848992]"
                          placeholder="0"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="space-y-4 md:space-y-6">
            <div className="bg-[rgba(37,99,235,0.08)] border border-[rgba(37,99,235,0.25)] rounded-xl p-4 md:p-6 text-center">
              <div className="text-[10px] md:text-xs text-[#6b7280] uppercase tracking-wider mb-1.5">Position Size</div>
              <div className="text-2xl md:text-4xl font-extrabold text-white mb-1">
                {positionSize > 0 ? `${positionSize.toFixed(6)} coins` : "-- coins"}
              </div>
              <div className="text-xs md:text-sm text-[#6b7280]">
                {totalValue > 0 ? `Total $USD Value: $${totalValue.toFixed(2)}` : "Total $USD Value: $ --"}
              </div>
            </div>

            <div className="bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.25)] rounded-xl p-4 md:p-5 text-center">
              <div className="text-[10px] md:text-xs text-[#6b7280] uppercase tracking-wider mb-1.5 font-semibold">Required Margin</div>
              <div className="text-xl md:text-3xl font-extrabold text-[#10b981] mb-1">
                {requiredMargin > 0 ? `$${requiredMargin.toFixed(2)}` : "$ --"}
              </div>
              <div className="text-xs md:text-sm text-[#6b7280] font-semibold">with {leverage}X Leverage</div>
            </div>

            <div className="bg-[#0d1626] border border-[#374151]/60 rounded-xl p-4 md:p-6">
              <div className="space-y-2.5 md:space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Risk Amount:</span>
                  <span className="text-red-500 font-semibold">
                    {riskAmount > 0 ? `$${riskAmount.toFixed(2)}` : "$ --"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Risk Distance:</span>
                  <span className="text-white font-semibold">
                    {riskDistance > 0
                      ? `$${riskDistance.toFixed(4)} (${riskDistancePercent.toFixed(1)}%)`
                      : "$ -- (-- %)"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Position Value:</span>
                  <span className="text-white font-semibold">
                    {totalValue > 0 ? `$${totalValue.toFixed(2)}` : "$ --"}
                  </span>
                </div>
              </div>
            </div>

            {/* Risk Breakdown */}
            <div className="bg-[#0d1626] border border-[#374151]/60 rounded-xl p-4 md:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4" />
                <h3 className="font-semibold text-[#f3f4f6]">RISK BREAKDOWN</h3>
              </div>
              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Account Risk:</span>
                  <span className="text-white font-semibold">
                    {accountRisk > 0 ? `${accountRisk.toFixed(1)}%` : "-- %"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Position Risk:</span>
                  <span className="text-white font-semibold">
                    {positionRisk > 0 ? `${positionRisk.toFixed(1)}%` : "-- %"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Margin Used:</span>
                  <span className="text-white font-semibold">
                    {marginUsed > 0 ? `${marginUsed.toFixed(1)}%` : "-- %"}
                  </span>
                </div>
              </div>
              <div className="relative h-8 bg-gradient-to-r from-[#10b981] via-[#f59e0b] to-[#ef4444] rounded mb-2">
                <div
                  className="absolute top-0 h-full w-1 bg-white shadow-lg"
                  style={{ left: `${accountRisk > 0 ? Math.min(accountRisk * 10, 100) : 0}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mb-4">
                <span>0</span>
                <span>3</span>
                <span>5</span>
                <span>7</span>
                <span>≥10</span>
              </div>
              <div
                className={cn("text-3xl font-bold text-center", accountRisk > 0 ? riskLevel.color : "text-[#10b981]")}
              >
                {accountRisk > 0 ? `${accountRisk.toFixed(1)}%` : "-- %"}
              </div>
              <div className="text-center text-sm mt-1 text-gray-400">
                {accountRisk > 0 ? riskLevel.label : "CONSERVATIVE"}
              </div>
            </div>

            {/* Risk Metrics */}
            <div className="bg-[#0d1626] border border-[#374151]/60 rounded-xl p-4 md:p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4" />
                <h3 className="font-semibold text-[#f3f4f6]">Risk Metrics</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-400 mb-1">Max Losses:</div>
                  <div className="text-2xl font-bold text-white">{maxLosses > 0 ? maxLosses : "--"}</div>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">Buying Power:</div>
                  <div className="text-2xl font-bold text-white">
                    {buyingPower > 0 ? `${buyingPower.toFixed(1)}%` : "-- %"}
                  </div>
                </div>
              </div>
            </div>

            {showAdvanced && addTakeProfit && (
              <div className="bg-[#0d1626] border border-[#374151]/60 rounded-xl p-4 md:p-6">
                <div className="text-gray-400 text-xs uppercase tracking-wider mb-3 text-center">Risk-Reward Ratio</div>
                <div className="text-4xl font-bold text-white text-center mb-4">
                  {rrRatio !== "0:0" ? rrRatio : "0:0"}
                </div>
                <div className="flex justify-between text-sm">
                  <div className="text-red-500">{potentialLoss > 0 ? `-$${potentialLoss.toFixed(2)}` : "-$--"}</div>
                  <div className="text-green-500">{potentialGain > 0 ? `+$${potentialGain.toFixed(2)}` : "+$--"}</div>
                </div>
              </div>
            )}

            {showAdvanced && includeFees && (
              <div className="bg-[#0d1626] border border-[#374151]/60 rounded-xl p-4 md:p-6">
                <div className="text-gray-400 text-xs uppercase tracking-wider mb-4 text-center">
                  After Trading Costs
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Net Position:</span>
                    <span className="text-white font-semibold">
                      {netPosition > 0 ? `${netPosition.toFixed(6)} coins` : "-- coins"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Break-even:</span>
                    <span className="text-white font-semibold">
                      {breakEven > 0 ? `$${breakEven.toFixed(4)}` : "$--"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

