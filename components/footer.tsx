import { Calculator } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t border-[#374151] mt-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col items-center gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-[#3b82f6]" />
            <span className="text-sm font-semibold text-[#f3f4f6] tracking-wide">
              Riskal
            </span>
          </div>

          {/* Tagline */}
          <p className="text-xs text-[#6b7280] text-center max-w-xs leading-relaxed">
            Professional position sizing for smarter trading decisions.
          </p>

          {/* Divider */}
          <div className="w-12 h-px bg-[#374151]" />

          {/* Attribution */}
          <p className="text-xs text-[#6b7280]">
            Made by{" "}
            <a
              href="https://github.com/waklarua"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3b82f6] hover:text-[#60a5fa] transition-colors font-medium"
            >
              @Waklarua
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
