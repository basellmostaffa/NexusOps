import { FormEvent, useMemo, useState } from 'react'
import { Filter, Plus, Search, Trash2, X } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, ApiCustomer } from '../services/api'
import { Badge } from '../components/Badge'

async function getCustomers() {
  const response = await api.get<{ data: ApiCustomer[] }>('/customers')
  return response.data.data
}

export function Customers() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All status')
  const [editing, setEditing] = useState<ApiCustomer | null>(null)
  const [creating, setCreating] = useState(false)
  const queryClient = useQueryClient()
  const customers = useQuery({ queryKey: ['customers'], queryFn: getCustomers, retry: 1 })
  const remove = useMutation({ mutationFn: (id: string) => api.delete(`/customers/${id}`), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers'] }) })
  const filtered = useMemo(() => (customers.data ?? []).filter((customer) => `${customer.name} ${customer.email} ${customer.company ?? ''}`.toLowerCase().includes(query.toLowerCase()) && (status === 'All status' || customer.status === status)), [customers.data, query, status])
  return <div className="page"><div className="page-heading"><div><p className="eyebrow">Relationship management</p><h1>Customers</h1><p className="page-subtitle">Manage your customer relationships and account health.</p></div><button className="button primary" onClick={() => setCreating(true)}><Plus size={16} /> Add customer</button></div><section className="panel table-panel"><div className="table-toolbar"><div className="search-box"><Search size={16} /><input placeholder="Search customers..." value={query} onChange={(event) => setQuery(event.target.value)} /></div><div className="toolbar-actions"><select className="native-select" value={status} onChange={(event) => setStatus(event.target.value)}><option>All status</option><option>ACTIVE</option><option>TRIAL</option><option>CHURNED</option></select><button className="button secondary"><Filter size={15} /> Filters</button></div></div>{customers.isLoading && <div className="empty-state"><span className="loading-spinner" /><p>Loading customers...</p></div>}{customers.isError && <div className="empty-state"><Search size={24} /><h3>Unable to load customers</h3><p>Check the API connection and try again.</p></div>}{customers.isSuccess && <div className="table-wrap"><table className="wide-table"><thead><tr><th>Customer</th><th>Company</th><th>Status</th><th>Joined</th><th /></tr></thead><tbody>{filtered.map((customer) => <tr key={customer.id}><td><div className="person"><div className="avatar avatar-pink">{customer.name.slice(0, 2).toUpperCase()}</div><div><strong>{customer.name}</strong><small>{customer.email}</small></div></div></td><td>{customer.company ?? '—'}</td><td><Badge status={customer.status} /></td><td className="muted-cell">{new Date(customer.createdAt).toLocaleDateString()}</td><td><button className="ghost-icon" aria-label={`Edit ${customer.name}`} onClick={() => setEditing(customer)}>Edit</button><button className="ghost-icon" aria-label={`Delete ${customer.name}`} onClick={() => { if (window.confirm(`Delete ${customer.name}?`)) remove.mutate(customer.id) }}><Trash2 size={15} /></button></td></tr>)}</tbody></table>{filtered.length === 0 && <div className="empty-state"><Search size={24} /><h3>No customers found</h3><p>Try adjusting your search or filters.</p></div>}</div>}<div className="pagination"><span>Showing <strong>{filtered.length}</strong> of <strong>{customers.data?.length ?? 0}</strong> customers</span></div></section>{(creating || editing) && <CustomerDialog customer={editing} close={() => { setCreating(false); setEditing(null) }} />}</div>
}

function CustomerDialog({ customer, close }: { customer: ApiCustomer | null; close: () => void }) {
  const queryClient = useQueryClient()
  const [name, setName] = useState(customer?.name ?? '')
  const [email, setEmail] = useState(customer?.email ?? '')
  const [company, setCompany] = useState(customer?.company ?? '')
  const [phone, setPhone] = useState(customer?.phone ?? '')
  const [error, setError] = useState('')
  const save = useMutation({ mutationFn: async () => customer ? api.patch(`/customers/${customer.id}`, { name, email, company, phone }) : api.post('/customers', { name, email, company, phone }), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['customers'] }); close() }, onError: () => setError('Could not save this customer. Check the fields and try again.') })
  const submit = (event: FormEvent) => { event.preventDefault(); setError(''); if (name.trim().length < 2 || !email.includes('@')) { setError('Enter a valid name and email.'); return } save.mutate() }
  return <div className="drawer-backdrop" onClick={close}><form className="modal-card" onClick={(event) => event.stopPropagation()} onSubmit={submit}><div className="modal-head"><h2>{customer ? 'Edit customer' : 'Add customer'}</h2><button type="button" className="ghost-icon" onClick={close}><X size={18} /></button></div><label>Name<input value={name} onChange={(event) => setName(event.target.value)} /></label><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>Company<input value={company} onChange={(event) => setCompany(event.target.value)} /></label><label>Phone<input value={phone} onChange={(event) => setPhone(event.target.value)} /></label>{error && <p className="form-error">{error}</p>}<div className="modal-actions"><button type="button" className="button secondary" onClick={close}>Cancel</button><button className="button primary" disabled={save.isPending}>{save.isPending ? 'Saving...' : 'Save customer'}</button></div></form></div>
}
