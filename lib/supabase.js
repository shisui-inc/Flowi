'use client'
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

// Helper: get current user
export async function getUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Currency formatter
export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('es', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount || 0)
}

// Export transactions to CSV
export function exportToCSV(transactions, categories) {
  const catMap = Object.fromEntries(categories.map(c => [c.id, c]))
  const headers = ['Fecha', 'Tipo', 'Descripción', 'Categoría', 'Monto', 'Notas']
  const rows = transactions.map(t => [
    t.date,
    t.type === 'income' ? 'Ingreso' : 'Gasto',
    `"${t.description}"`,
    catMap[t.category_id]?.name || 'Sin categoría',
    t.amount,
    `"${t.notes || ''}"`,
  ])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `flowi-transacciones-${new Date().toISOString().slice(0,10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
