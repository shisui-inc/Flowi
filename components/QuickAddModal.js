'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'

const DEFAULT_CATEGORIES = [
    { id: '__food', name: 'Comida', icon: '🍔', color: '#FF6B6B' },
    { id: '__transport', name: 'Transporte', icon: '🚌', color: '#7BE8D5' },
    { id: '__shopping', name: 'Compras', icon: '🛒', color: '#B8B8FF' },
    { id: '__health', name: 'Salud', icon: '💊', color: '#FFE66D' },
    { id: '__entertainment', name: 'Ocio', icon: '🎮', color: '#C8F44D' },
    { id: '__bills', name: 'Servicios', icon: '📄', color: '#FF9F43' },
    { id: '__education', name: 'Educación', icon: '📚', color: '#54A0FF' },
    { id: '__other', name: 'Otro', icon: '📦', color: '#888' },
]

export default function QuickAddModal({ onClose, onSaved }) {
    const supabase = createClient()
    const inputRef = useRef(null)
    const [amount, setAmount] = useState('')
    const [description, setDescription] = useState('')
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [type, setType] = useState('expense')
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [closing, setClosing] = useState(false)

    useEffect(() => {
        // Load user categories, fall back to defaults
        async function loadCategories() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return
            const { data: cats } = await supabase.from('categories').select('*').eq('user_id', user.id)
            if (cats && cats.length > 0) {
                const filtered = cats.filter(c => c.type === 'expense' || c.type === 'both')
                setCategories(filtered.length > 0 ? filtered : DEFAULT_CATEGORIES)
            } else {
                setCategories(DEFAULT_CATEGORIES)
            }
        }
        loadCategories()

        // Auto-focus amount input
        setTimeout(() => inputRef.current?.focus(), 350)
    }, [])

    const handleClose = () => {
        setClosing(true)
        setTimeout(() => onClose(), 280)
    }

    const handleSave = async () => {
        if (!amount || parseFloat(amount) <= 0) return
        setLoading(true)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const payload = {
            user_id: user.id,
            type,
            amount: parseFloat(amount),
            description: description || (selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'Gasto rápido'),
            category_id: selectedCategory && !selectedCategory.startsWith('__') ? selectedCategory : null,
            date: new Date().toISOString().slice(0, 10),
            notes: '',
        }

        const { error } = await supabase.from('transactions').insert(payload)
        setLoading(false)

        if (!error) {
            handleClose()
            setTimeout(() => onSaved(), 300)
        } else {
            alert(error.message)
        }
    }

    return (
        <div className={`quick-add-overlay ${closing ? 'quick-add-overlay--closing' : ''}`} onClick={handleClose}>
            <div
                className={`quick-add-sheet ${closing ? 'quick-add-sheet--closing' : ''}`}
                onClick={e => e.stopPropagation()}
            >
                {/* Drag handle */}
                <div className="quick-add-handle">
                    <div className="quick-add-handle__bar" />
                </div>

                {/* Type toggle */}
                <div className="quick-add-type-toggle">
                    <button
                        type="button"
                        className={`quick-add-type-btn ${type === 'expense' ? 'quick-add-type-btn--active-expense' : ''}`}
                        onClick={() => setType('expense')}
                    >
                        Gasto
                    </button>
                    <button
                        type="button"
                        className={`quick-add-type-btn ${type === 'income' ? 'quick-add-type-btn--active-income' : ''}`}
                        onClick={() => setType('income')}
                    >
                        Ingreso
                    </button>
                </div>

                {/* Amount input */}
                <div className="quick-add-amount">
                    <span className="quick-add-amount__currency">₲</span>
                    <input
                        ref={inputRef}
                        type="text"
                        inputMode="decimal"
                        pattern="[0-9]*"
                        placeholder="0"
                        value={amount}
                        onChange={e => {
                            const val = e.target.value.replace(/[^0-9.]/g, '')
                            setAmount(val)
                        }}
                        className={`quick-add-amount__input ${type === 'income' ? 'quick-add-amount__input--income' : ''}`}
                        aria-label="Monto"
                    />
                </div>

                {/* Description */}
                <div className="quick-add-desc">
                    <input
                        type="text"
                        placeholder="Descripción (opcional)"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="quick-add-desc__input"
                    />
                </div>

                {/* Category chips */}
                <div className="quick-add-chips-wrapper">
                    <div className="quick-add-chips" role="listbox" aria-label="Categorías">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                type="button"
                                role="option"
                                aria-selected={selectedCategory === cat.id}
                                className={`quick-add-chip ${selectedCategory === cat.id ? 'quick-add-chip--active' : ''}`}
                                style={{
                                    '--chip-color': cat.color,
                                }}
                                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                            >
                                <span className="quick-add-chip__icon">{cat.icon}</span>
                                <span className="quick-add-chip__label">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Save button */}
                <button
                    className="quick-add-save"
                    onClick={handleSave}
                    disabled={loading || !amount || parseFloat(amount) <= 0}
                >
                    {loading ? (
                        <span className="spinner" style={{ width: 20, height: 20 }} />
                    ) : (
                        type === 'expense' ? 'Guardar gasto' : 'Guardar ingreso'
                    )}
                </button>
            </div>
        </div>
    )
}
