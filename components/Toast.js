'use client'
import { useState, useCallback, useEffect } from 'react'

let toastCallback = null

export function useToast() {
  const [toasts, setToasts] = useState([])

  const show = useCallback((message, type = 'default', duration = 3000) => {
    const id = Date.now()
    setToasts(t => [...t, { id, message, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), duration)
  }, [])

  return { toasts, show }
}

export function ToastContainer({ toasts }) {
  if (!toasts?.length) return null
  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>{t.message}</div>
      ))}
    </div>
  )
}
