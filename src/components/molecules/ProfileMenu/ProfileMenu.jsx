import { ChevronDown, LogOut, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Avatar from '../../atoms/Avatar/Avatar'

const ProfileMenu = ({
  name = 'Restaurant Owner',
  role = 'Owner',
  image,
  onLogout,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return undefined

    const handlePointerDown = (event) => {
      if (!menuRef.current?.contains(event.target)) setIsOpen(false)
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center gap-2 rounded-lg p-2 text-left transition-colors hover:bg-stone-100 sm:gap-3"
      >
        <Avatar src={image} name={name} size="md" />
        <div className="hidden min-w-0 sm:block">
          <p className="max-w-36 truncate text-sm font-semibold text-text-primary">
            {name}
          </p>
          <p className="text-xs text-text-secondary">{role}</p>
        </div>
        <ChevronDown size={16} className="hidden shrink-0 text-text-secondary sm:block" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-52 rounded-2xl border border-orange-200 bg-white p-2 shadow-xl shadow-stone-900/10"
        >
          <div className="flex items-start justify-between gap-2 border-b border-orange-100 px-2 py-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text-primary">{name}</p>
              <p className="text-xs text-text-secondary">{role}</p>
            </div>
            <button
              type="button"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              aria-label="Close profile menu"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-stone-500 transition hover:bg-orange-50 hover:text-orange-800"
            >
              <X size={17} />
            </button>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false)
              onLogout?.()
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-text-primary transition hover:bg-orange-50 hover:text-orange-800"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfileMenu