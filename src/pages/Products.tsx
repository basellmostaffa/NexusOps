import { useMemo, useState } from 'react'
import { Edit3, Package, Plus, Search, Trash2, X } from 'lucide-react'
import type { FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, ApiProduct, getProducts } from '../services/api'

export function Products() {
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<ApiProduct | null>(null)
  const [creating, setCreating] = useState(false)
  const queryClient = useQueryClient()
  const products = useQuery({ queryKey: ['products'], queryFn: getProducts, retry: 1 })
  const remove = useMutation({ mutationFn: (id: string) => api.delete(`/products/${id}`), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }) })
  const filtered = useMemo(() => (products.data ?? []).filter((product) => `${product.name} ${product.category ?? ''}`.toLowerCase().includes(query.toLowerCase())), [products.data, query])
  return <div className="page"><div className="page-heading"><div><p className="eyebrow">Catalog management</p><h1>Products</h1><p className="page-subtitle">Keep your catalog, inventory, and pricing in sync.</p></div><button className="button primary" onClick={() => setCreating(true)}><Plus size={16} /> Add product</button></div><section className="panel table-panel"><div className="table-toolbar"><div className="search-box"><Search size={16} /><input placeholder="Search products..." value={query} onChange={(event) => setQuery(event.target.value)} /></div></div>{products.isLoading && <div className="empty-state"><span className="loading-spinner" /><p>Loading products...</p></div>}{products.isError && <div className="empty-state"><Package size={24} /><h3>Unable to load products</h3><p>Start the NexusOps API or check your connection.</p></div>}{products.isSuccess && <div className="table-wrap"><table className="wide-table"><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Created</th><th /></tr></thead><tbody>{filtered.map((product: ApiProduct) => <tr key={product.id}><td><div className="person"><span className="product-table-icon"><Package size={15} /></span><strong>{product.name}</strong></div></td><td>{product.category ?? 'General'}</td><td><strong>${Number(product.price).toFixed(2)}</strong></td><td>{product.stock}</td><td><span className="badge badge-green"><span className="badge-dot" />{product.status ?? (product.stock > 0 ? 'In stock' : 'Out of stock')}</span></td><td className="muted-cell">{new Date(product.createdAt).toLocaleDateString()}</td><td><button className="ghost-icon" aria-label={`Edit ${product.name}`} onClick={() => setEditing(product)}><Edit3 size={14} /></button><button className="ghost-icon" aria-label={`Delete ${product.name}`} onClick={() => { if (window.confirm(`Delete ${product.name}?`)) remove.mutate(product.id) }}><Trash2 size={14} /></button></td></tr>)}</tbody></table>{filtered.length === 0 && <div className="empty-state"><Search size={24} /><h3>No products found</h3><p>Try a different product or category.</p></div>}</div>}</section>{(creating || editing) && <ProductDialog product={editing} close={() => { setCreating(false); setEditing(null) }} />}</div>
}

function ProductDialog({ product, close }: { product: ApiProduct | null; close: () => void }) {
  const queryClient = useQueryClient()
  const [name, setName] = useState(product?.name ?? '')
  const [sku, setSku] = useState(product?.name.toUpperCase().replace(/ /g, '-') ?? '')
  const [price, setPrice] = useState(String(product?.price ?? ''))
  const [stock, setStock] = useState(String(product?.stock ?? '0'))
  const [error, setError] = useState('')
  const save = useMutation({ mutationFn: () => product ? api.patch(`/products/${product.id}`, { name, sku, price: Number(price), stock: Number(stock) }) : api.post('/products', { name, sku, price: Number(price), stock: Number(stock) }), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['products'] }); close() }, onError: () => setError('Could not save product. SKU may already exist.') })
  const submit = (event: FormEvent) => { event.preventDefault(); if (name.trim().length < 2 || !Number.isFinite(Number(price)) || Number(price) < 0 || !Number.isInteger(Number(stock)) || Number(stock) < 0) { setError('Enter a name, non-negative price, and whole-number stock.'); return } save.mutate() }
  return <div className="drawer-backdrop" onClick={close}><form className="modal-card" onClick={(event) => event.stopPropagation()} onSubmit={submit}><div className="modal-head"><h2>{product ? 'Edit product' : 'Add product'}</h2><button type="button" className="ghost-icon" onClick={close}><X size={18} /></button></div><label>Name<input value={name} onChange={(event) => setName(event.target.value)} /></label><label>SKU<input value={sku} onChange={(event) => setSku(event.target.value)} /></label><label>Price<input type="number" min="0" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} /></label><label>Stock<input type="number" min="0" step="1" value={stock} onChange={(event) => setStock(event.target.value)} /></label>{error && <p className="form-error">{error}</p>}<div className="modal-actions"><button type="button" className="button secondary" onClick={close}>Cancel</button><button className="button primary" disabled={save.isPending}>{save.isPending ? 'Saving...' : 'Save product'}</button></div></form></div>
}
