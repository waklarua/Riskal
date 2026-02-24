import { Calculator, Github } from "lucide-react"

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}

const socialLinks = [
  {
    name: "Telegram",
    href: "https://t.me/waklarua",
    icon: TelegramIcon,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/waklarua",
    icon: TwitterIcon,
  },
  {
    name: "GitHub",
    href: "https://github.com/waklarua",
    icon: Github,
  },
]

export function Footer() {
  return (
    <footer className="w-full mt-16">
      <div className="w-full border-t border-[#374151]/60" />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col items-center gap-8">
          {/* Brand */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-7 h-7 rounded-md bg-[#3b82f6]/10 border border-[#3b82f6]/20">
                <Calculator className="w-3.5 h-3.5 text-[#3b82f6]" />
              </div>
              <span className="text-sm font-semibold text-[#f3f4f6] tracking-wide font-sans">
                Riskal
              </span>
            </div>
            <p className="text-xs text-[#6b7280] text-center max-w-[280px] leading-relaxed font-sans">
              Professional position sizing for smarter trading decisions.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow on ${link.name}`}
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#1e293b] border border-[#374151]/60 text-[#6b7280] hover:text-[#3b82f6] hover:border-[#3b82f6]/40 hover:bg-[#3b82f6]/5 transition-all duration-200"
              >
                <link.icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="w-full max-w-[120px] h-px bg-gradient-to-r from-transparent via-[#374151] to-transparent" />

          {/* Attribution */}
          <p className="text-xs text-[#6b7280] font-sans">
            Made by{" "}
            <a
              href="https://github.com/waklarua"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3b82f6] hover:text-[#60a5fa] transition-colors duration-200 font-medium"
            >
              @Waklarua
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
