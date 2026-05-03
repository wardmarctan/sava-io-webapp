import { ChevronDown, CircleUserRound, Globe } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useLanguage } from '@/hooks/use-language'
import { clearAuthTokens } from '@/lib/storage'

export function DashboardTopbar() {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()
  const { language, availableLanguages, changeLanguage } = useLanguage()
  const [switchAccountOpen, setSwitchAccountOpen] = useState(false)

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapperRef.current) return
      if (!wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
        setSwitchAccountOpen(false)
      }
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  function handleLogout() {
    clearAuthTokens()
    navigate('/login', { replace: true })
  }

  return (
    <header className="flex h-20 items-center justify-end border-b border-[#d8cbe6] bg-white px-8">
      <div className="relative" ref={wrapperRef}>
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-semibold text-slate-900"
        >
          <CircleUserRound size={36} strokeWidth={1.75} />
          <span>Admin</span>
          <ChevronDown size={18} />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-56 rounded bg-white border shadow-md z-50">
            <div className="py-1">
              <div
                className="relative"
                onMouseEnter={() => setSwitchAccountOpen(true)}
                onMouseLeave={() => setSwitchAccountOpen(false)}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-gray-50"
                >
                  <span className="flex items-center gap-2">
                    <Globe size={16} />
                    <span>Switch language</span>
                  </span>
                  <ChevronDown size={14} className="rotate-[-90deg] text-slate-400" />
                </button>

                {switchAccountOpen && (
                  <div className="absolute right-full top-0 mr-2 w-44 rounded border bg-white shadow-md z-50">
                    <div className="py-1">
                      {availableLanguages.map((l) => (
                        <button
                          key={l.code}
                          onClick={async () => {
                            await changeLanguage(l.code)
                            setSwitchAccountOpen(false)
                            setOpen(false)
                          }}
                          className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${l.code === language ? 'font-semibold' : ''}`}
                        >
                          {l.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t" />

              <button onClick={handleLogout} className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-50">
                Log out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}