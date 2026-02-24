# Riskal - Position Size Calculator

A professional-grade cryptocurrency trading calculator that helps traders determine optimal position sizes, manage risk, and analyze trade metrics in seconds.

## Overview

Riskal is a web-based position size calculator designed for cryptocurrency traders who need to quickly calculate position sizes based on their account balance, risk tolerance, and entry/exit points. The application provides real-time calculations, comprehensive risk metrics, and works offline as a Progressive Web App (PWA).

**URL**: https://riskal.vercel.app/

## Key Features

### Core Calculations
- **Position Size Calculator**: Automatically calculates the number of coins to trade based on your inputs
- **Required Margin Display**: Shows margin requirements based on leverage
- **Linked Risk Inputs**: Switch between percentage and dollar-based risk with automatic synchronization
- **Risk Metrics**: Account risk, position risk, and margin usage percentages

### Advanced Features
- **Risk-Reward Ratio Analysis**: Optional take-profit analysis to calculate risk:reward ratios
- **Trading Fees & Slippage**: Include real-world costs in your calculations
- **Risk Assessment Gauge**: Visual risk indicator with color-coded thresholds
  - Conservative: 0-3%
  - Moderate: 3-5%
  - Aggressive: 5-7%
  - High Risk: 7-10%
  - Extreme Risk: 10%+

### User Experience
- **Expandable Advanced Options**: Toggle advanced settings without cluttering the interface
- **One-Click Reset**: Clear all inputs and return to defaults instantly
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Offline Capable**: Full PWA support with offline functionality
- **Dark Theme**: Professional dark interface with optimal contrast

## Technology Stack

- **Frontend**: Next.js 16.0.10 with React 19.2.0
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript with strict mode
- **Build Tool**: Turbopack (Next.js default)
- **PWA**: Service Workers for offline support
- **Hosting**: Vercel

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Development

1. **Clone or download the project**
   ```bash
   git clone https://github.com/yourusername/riskal.git
   cd riskal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:3000`

### Build for Production
```bash
npm run build
npm run start
```

## Usage Guide

### Basic Workflow

1. **Enter Account Balance**: Your total trading capital (e.g., $1000)
2. **Set Risk Amount**: Choose percentage (%) or dollar ($) risk per trade
3. **Input Entry & Stop Loss**: Your planned entry and exit prices
4. **Adjust Leverage** (Optional): Set leverage multiplier (1-125X)
5. **View Results**: Position size and required margin update in real-time

### Advanced Options

Click "Advanced Options" to reveal:
- **Take Profit Analysis**: Add a take-profit price to calculate risk:reward ratio
- **Trading Fees**: Include commission and slippage in final calculations

### Reset
Click the reset button (top-right) to clear all inputs and return to default values:
- Account Balance: $1000
- Risk: 5%
- Leverage: 1X

## Input Specifications

| Field | Type | Range | Notes |
|-------|------|-------|-------|
| Account Balance | USD | $1+ | Your total trading capital |
| Risk % | Percentage | 0.1-100% | % of account at risk |
| Risk $ | Dollar | $0.01+ | Dollar amount at risk |
| Entry Price | Decimal | Any | Coin entry price |
| Stop Loss | Decimal | Any | Liquidation/exit price |
| Leverage | Multiple | 1-125X | Trading leverage (optional) |
| Take Profit | Decimal | Any | Exit for profit (optional) |
| Trading Fee | % | 0-10% | Exchange commission (optional) |
| Slippage | % | 0-10% | Market slippage (optional) |

## Progressive Web App (PWA)

Riskal is a fully functional PWA that can be installed on any device:

### iOS
1. Open Riskal in Safari
2. Tap Share → "Add to Home Screen"
3. Name it "Riskal" and tap "Add"

### Android
1. Open Riskal in Chrome
2. Tap menu (3 dots) → "Install app"
3. Confirm installation

### Desktop
1. Open Riskal in Chrome/Edge
2. Click install icon in address bar
3. Or: Menu → "Install Riskal"

### Offline Use
Once installed, Riskal works fully offline with cached assets and calculations.

## Calculation Formulas

### Position Size
```
Position Size = Risk Amount / (Entry Price - Stop Loss Price)
```

### Required Margin
```
Required Margin = (Position Size × Entry Price) / Leverage
```

### Account Risk %
```
Account Risk % = (Risk Amount / Account Balance) × 100
```

### Risk-Reward Ratio
```
R:R Ratio = (Take Profit Price - Entry Price) / (Entry Price - Stop Loss Price)
```

### Break-even with Fees
```
Break-even = Entry Price + (Total Fees / Position Size)
```

## Color Scheme

- **Primary Background**: #121c31
- **Input Fields**: #1f2937
- **Branding**: #3b82f6 (Riskal Blue)
- **Borders**: #374151
- **Text**: #ffffff (Active), #d1d5db (Inactive)

## Project Structure

```
riskal/
├── app/
│   ├── page.tsx              # Main calculator component
│   ├── layout.tsx            # Root layout with PWA setup
│   └── globals.css           # Global styles & Tailwind config
├── public/
│   ├── manifest.json         # PWA manifest
│   ├── sw.js                 # Service worker
│   └── icon-*.jpg            # App icons (192x192, 512x512, 180x180)
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript configuration
├── next.config.mjs           # Next.js configuration
└── README.md                 # This file
```

## Performance Features

- Server-side rendering with Next.js
- Optimized bundle with Turbopack
- Service Worker caching for offline support
- Responsive images and lazy loading
- Minimal dependencies for fast load times

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Environment Variables

Currently, Riskal doesn't require environment variables. If you plan to add features like analytics or error tracking, add them in Vercel's project settings:

1. Go to Project Settings → "Environment Variables"
2. Add your variables
3. Reference in code using `process.env.VARIABLE_NAME`

## Known Limitations

- No data persistence (calculations are stateless)
- No user accounts or cloud sync
- Calculations assume perpetual futures/leverage trading
- Does not account for slippage during entry/exit

## Future Roadmap

- User accounts with trade history
- Multiple asset classes (stocks, forex, commodities)
- Trade journal and backtesting
- Mobile app versions
- Multi-language support
- Dark/Light theme toggle

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is open source and available under the MIT License. See LICENSE file for details.

## Support

For issues, feature requests, or questions:
- Open an issue on GitHub
- Contact: support@riskal.app (maybe soon?)

## Disclaimer

Riskal is a calculation tool for educational and planning purposes. Always conduct your own research and consult with financial advisors before making trading decisions. Past performance does not guarantee future results. Trading cryptocurrencies involves substantial risk of loss.

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Maintainer**: Waklarua
