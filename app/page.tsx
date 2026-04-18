"use client"

import type React from "react"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Calculator, RotateCcw, ChevronDown, ChevronUp, Info, Shield, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Footer } from "@/components/footer"
import { usePositionCalculator } from "@/hooks/use-position-calculator"

export default function PositionSizeCalculator() {
  const {
    inputs,
    results,
    riskLevel,
    updateInput,
    updateRiskFromPercent,
    updateRiskFromDollar,
    updateAccountBalance,
    reset,
  } = usePositionCalculator()

  const {
    assetClass,
    isLong,
    accountBalance,
    riskPercent,
    riskDollar,
    entryPrice,
    stopLoss,
    leverage,
    showAdvanced,
    addTakeProfit,
    takeProfitPrice,
    includeFees,
    tradingFee,
    slippage,
  } = inputs

  const {
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
    potentialLoss,
    potentialGain,
    netPosition,
    breakEven,
  } = results

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js")
    }
  }, [])

  const preventScrollChange = (e: React.WheelEvent<HTMLInputElement>) => {
    e.currentTarget.blur()
  }

  return (
    <div className="flex flex-col min-h-svh bg-background text-foreground">
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-5 md:p-8">
        {/* Header */}
        <header className="mb-5 md:mb-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 md:gap-3 min-w-0">
              <div className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/20 shrink-0">
                <Calculator className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-2 md:gap-2.5">
                  <h1 className="text-lg md:text-2xl font-bold text-foreground leading-tight">Riskal</h1>
                  <span className="hidden md:inline text-[#374151]/60 text-sm font-light">/</span>
                  <h2 className="hidden md:inline text-base font-normal text-[#9ca3af] leading-tight">Position Size Calculator</h2>
                </div>
                <p className="text-[11px] md:text-xs text-muted-foreground mt-0.5 leading-snug">
                  Calculate your optimal position size in seconds
                </p>
              </div>
            </div>
            <Button
              className="bg-[#ef4444]/10 hover:bg-[#ef4444]/20 border border-[#ef4444]/30 text-[#f87171] hover:text-[#fca5a5] shrink-0 h-8 md:h-10 px-3 md:px-4 rounded-lg transition-all duration-200"
              onClick={reset}
            >
              <RotateCcw className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5" />
              <span className="text-xs md:text-sm font-medium">Reset</span>
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Left Panel - Inputs */}
          <div className="bg-card border border-border/60 rounded-xl p-4 md:p-6 space-y-4 md:space-y-5">
            <div>
              <Label className="text-foreground mb-2 block">Asset Class</Label>
              <div className="bg-input border border-border rounded-md px-3 py-2 text-foreground">{assetClass}</div>
            </div>

            {/* Long/Short Toggle */}
            <div className="flex gap-2">
              <Button
                className={cn(
                  "flex-1 h-12 font-semibold",
                  isLong
                    ? "bg-success hover:bg-success/90 text-success-foreground font-semibold"
                    : "bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border",
                )}
                onClick={() => updateInput("isLong", true)}
              >
                Long
              </Button>
              <Button
                className={cn(
                  "flex-1 h-12 font-semibold",
                  !isLong
                    ? "bg-destructive hover:bg-destructive/90 text-foreground font-semibold"
                    : "bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border",
                )}
                onClick={() => updateInput("isLong", false)}
              >
                Short
              </Button>
            </div>

            <div>
              <Label className="text-foreground mb-2 flex items-center gap-2">
                Account Balance
                <Info className="w-3 h-3 text-gray-400" />
              </Label>
              <div className="flex gap-2">
                <div className="w-14 bg-input border border-border rounded-md flex items-center justify-center text-foreground">
                  $
                </div>
                <Input
                  type="number"
                  value={accountBalance}
                  onChange={(e) => updateAccountBalance(e.target.value)}
                  onWheel={preventScrollChange}
                  placeholder="50"
                  className="bg-input border-border text-foreground placeholder:text-[#848992]"
                />
              </div>
            </div>

            {/* Risk Per Trade */}
            <div>
              <Label className="text-foreground mb-2 flex items-center gap-2">
                Risk Per Trade
                <Info className="w-3 h-3 text-gray-400" />
              </Label>
              <div className="flex gap-2">
                {/* Percentage input */}
                <div className="flex-1 relative">
                  <Input
                    type="number"
                    value={riskPercent}
                    onChange={(e) => updateRiskFromPercent(e.target.value)}
                    onWheel={preventScrollChange}
                    placeholder="5"
                    className="bg-input border-border text-foreground placeholder:text-[#848992] pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">%</span>
                </div>
                {/* Dollar input */}
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">$</span>
                  <Input
                    type="number"
                    value={riskDollar}
                    onChange={(e) => updateRiskFromDollar(e.target.value)}
                    onWheel={preventScrollChange}
                    placeholder="2.5"
                    className="bg-input border-border text-foreground placeholder:text-[#848992] pl-8"
                  />
                </div>
              </div>
            </div>

            {/* Entry Price */}
            <div>
              <Label className="text-foreground mb-2 flex items-center gap-2">
                Entry Price
                <Info className="w-3 h-3 text-gray-400" />
              </Label>
              <Input
                type="number"
                step="0.0001"
                value={entryPrice}
                onChange={(e) => updateInput("entryPrice", e.target.value)}
                onWheel={preventScrollChange}
                className="bg-input border-border text-foreground placeholder:text-[#848992]"
                placeholder="Eg. 1.0777"
              />
            </div>

            {/* Stop Loss */}
            <div>
              <Label className="text-foreground mb-2 flex items-center gap-2">
                Stop Loss
                <Info className="w-3 h-3 text-gray-400" />
              </Label>
              <Input
                type="number"
                step="0.0001"
                value={stopLoss}
                onChange={(e) => updateInput("stopLoss", e.target.value)}
                onWheel={preventScrollChange}
                className="bg-input border-border text-foreground placeholder:text-[#848992]"
                placeholder="Eg. 1.0659"
              />
            </div>

            <div>
              <Label className="text-foreground mb-2 flex items-center gap-2">
                Leverage (Optional)
                <Info className="w-3 h-3 text-gray-400" />
              </Label>
              <Input
                type="number"
                min="1"
                max="125"
                value={leverage}
                onChange={(e) => updateInput("leverage", e.target.value)}
                onWheel={preventScrollChange}
                className="bg-input border-border text-foreground placeholder:text-[#848992]"
                placeholder="1"
              />
            </div>

            <div className="bg-card border border-border/60 rounded-xl p-4">
              <button
                onClick={() => updateInput("showAdvanced", !showAdvanced)}
                className="flex items-center justify-between w-full text-foreground hover:text-[#d1d5db] transition-colors"
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
                      onCheckedChange={(checked) => updateInput("addTakeProfit", checked as boolean)}
                    />
                    <Label className="text-foreground">Add Take Profit (R:R Analysis)</Label>
                  </div>

                  {addTakeProfit && (
                    <div>
                      <Label className="text-foreground mb-2 flex items-center gap-2">
                        Take Profit Price
                        <Info className="w-3 h-3 text-gray-400" />
                      </Label>
                      <Input
                        type="number"
                        step="0.0001"
                        value={takeProfitPrice}
                        onChange={(e) => updateInput("takeProfitPrice", e.target.value)}
                        onWheel={preventScrollChange}
                        className="bg-input border-border text-foreground placeholder:text-[#848992]"
                        placeholder="0"
                      />
                    </div>
                  )}

                  {/* Include Trading Fees */}
                  <div className="flex items-center gap-2">
                    <Checkbox checked={includeFees} onCheckedChange={(checked) => updateInput("includeFees", checked as boolean)} />
                    <Label className="text-foreground">Include Trading Fees</Label>
                  </div>

                  {includeFees && (
                    <>
                      <div>
                        <Label className="text-foreground mb-2 flex items-center gap-2">
                          Trading Fee %
                          <Info className="w-3 h-3 text-gray-400" />
                        </Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={tradingFee}
                          onChange={(e) => updateInput("tradingFee", e.target.value)}
                          onWheel={preventScrollChange}
                          className="bg-input border-border text-foreground placeholder:text-[#848992]"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <Label className="text-foreground mb-2 flex items-center gap-2">
                          Slippage %
                          <Info className="w-3 h-3 text-gray-400" />
                        </Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={slippage}
                          onChange={(e) => updateInput("slippage", e.target.value)}
                          onWheel={preventScrollChange}
                          className="bg-input border-border text-foreground placeholder:text-[#848992]"
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
              <div className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Position Size</div>
              <div className="text-2xl md:text-4xl font-extrabold text-foreground mb-1">
                {positionSize > 0 ? `${positionSize.toFixed(6)} coins` : "-- coins"}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">
                {totalValue > 0 ? `Total $USD Value: $${totalValue.toFixed(2)}` : "Total $USD Value: $ --"}
              </div>
            </div>

            <div className="bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.25)] rounded-xl p-4 md:p-5 text-center">
              <div className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider mb-1.5 font-semibold">Required Margin</div>
              <div className="text-xl md:text-3xl font-extrabold text-success mb-1">
                {requiredMargin > 0 ? `$${requiredMargin.toFixed(2)}` : "$ --"}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground font-semibold">With {Number.parseFloat(leverage) || 1}X Leverage</div>
            </div>

            <div className="bg-card border border-border/60 rounded-xl p-4 md:p-6">
              <div className="space-y-2.5 md:space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Risk Amount:</span>
                  <span className="text-red-500 font-semibold">
                    {riskAmount > 0 ? `$${riskAmount.toFixed(2)}` : "$ --"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Risk Distance:</span>
                  <span className="text-foreground font-semibold">
                    {riskDistance > 0
                      ? `$${riskDistance.toFixed(4)} (${riskDistancePercent.toFixed(1)}%)`
                      : "$ -- (-- %)"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Position Value:</span>
                  <span className="text-foreground font-semibold">
                    {totalValue > 0 ? `$${totalValue.toFixed(2)}` : "$ --"}
                  </span>
                </div>
              </div>
            </div>

            {/* Risk Breakdown */}
            <div className="bg-card border border-border/60 rounded-xl p-4 md:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4" />
                <h3 className="font-semibold text-foreground">RISK BREAKDOWN</h3>
              </div>
              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Account Risk:</span>
                  <span className="text-foreground font-semibold">
                    {accountRisk > 0 ? `${accountRisk.toFixed(1)}%` : "-- %"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Position Risk:</span>
                  <span className="text-foreground font-semibold">
                    {positionRisk > 0 ? `${positionRisk.toFixed(1)}%` : "-- %"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Margin Used:</span>
                  <span className="text-foreground font-semibold">
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
                className={cn("text-3xl font-bold text-center", accountRisk > 0 ? riskLevel.color : "text-success")}
              >
                {accountRisk > 0 ? `${accountRisk.toFixed(1)}%` : "-- %"}
              </div>
              <div className="text-center text-sm mt-1 text-gray-400">
                {accountRisk > 0 ? riskLevel.label : "CONSERVATIVE"}
              </div>
            </div>

            {/* Risk Metrics */}
            <div className="bg-card border border-border/60 rounded-xl p-4 md:p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4" />
                <h3 className="font-semibold text-foreground">Risk Metrics</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-400 mb-1">Max Losses:</div>
                  <div className="text-2xl font-bold text-foreground">{maxLosses > 0 ? maxLosses : "--"}</div>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">Buying Power:</div>
                  <div className="text-2xl font-bold text-foreground">
                    {buyingPower > 0 ? `${buyingPower.toFixed(1)}%` : "-- %"}
                  </div>
                </div>
              </div>
            </div>

            {showAdvanced && addTakeProfit && (
              <div className="bg-card border border-border/60 rounded-xl p-4 md:p-6">
                <div className="text-gray-400 text-xs uppercase tracking-wider mb-3 text-center">Risk-Reward Ratio</div>
                <div className="text-4xl font-bold text-foreground text-center mb-4">
                  {rrRatio !== "0:0" ? rrRatio : "0:0"}
                </div>
                <div className="flex justify-between text-sm">
                  <div className="text-red-500">{potentialLoss > 0 ? `-$${potentialLoss.toFixed(2)}` : "-$--"}</div>
                  <div className="text-green-500">{potentialGain > 0 ? `+$${potentialGain.toFixed(2)}` : "+$--"}</div>
                </div>
              </div>
            )}

            {showAdvanced && includeFees && (
              <div className="bg-card border border-border/60 rounded-xl p-4 md:p-6">
                <div className="text-gray-400 text-xs uppercase tracking-wider mb-4 text-center">
                  After Trading Costs
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Net Position:</span>
                    <span className="text-foreground font-semibold">
                      {netPosition > 0 ? `${netPosition.toFixed(6)} coins` : "-- coins"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Break-even:</span>
                    <span className="text-foreground font-semibold">
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

