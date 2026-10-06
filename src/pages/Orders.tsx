import { Filter, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, ApiOrder } from '../services/api'

async function getOrders() {
  const response = await api.get<{ data: ApiOrder[] }>('/orders')
  return response.data.data
}

export function Orders() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All status')
  const queryClient = useQueryClient()
  const orders = useQuery({ queryKey: ['orders'], queryFn: getOrders, retry: 1 })
  const updateStatus = useMutation({ mutationFn: ({ id, value }: { id: string; value: string }) => api.patch(`/orders/${id}/status`, { status: value }), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }) })
  const filtered = useMemo(() => (orders.data ?? []).filter((order) => `${order.id} ${order.customer?.name ?? ''} ${order.items?.map((item) => item.product.name).join(' ') ?? ''}`.toLowerCase().includes(query.toLowerCase()) && (status === 'All status' || order.status === status)), [orders.data, query, status])
  return <div className="page"><div className="page-heading"><div><p className="eyebrow">Revenue operations</p><h1>Orders</h1><p className="page-subtitle">Track every transaction across your workspace.</p></div></div><section className="panel table-panel"><div className="table-toolbar"><div className="search-box"><Search size={16} /><input placeholder="Search orders..." value={query} onChange={(event) => setQuery(event.target.value)} /></div><div className="toolbar-actions"><select className="native-select" value={status} onChange={(event) => setStatus(event.target.value)}><option>All status</option><option>PENDING</option><option>PROCESSING</option><option>SHIPPED</option><option>DELIVERED</option><option>CANCELLED</option></select><button className="button secondary"><Filter size={15} /> Filters</button></div></div>{orders.isLoading && <div className="empty-state"><span className="loading-spinner" /><p>Loading orders...</p></div>}{orders.isError && <div className="empty-state"><Search size={24} /><h3>Unable to load orders</h3><p>Check the API connection and try again.</p></div>}{orders.isSuccess && <div className="table-wrap"><table className="wide-table"><thead><tr><th>Order</th><th>Customer</th><th>Product</th><th>Quantity</th><th>Total</th><th>Status</th><th>Date</th></tr></thead><tbody>{filtered.map((order) => { const firstItem = order.items?.[0]; return <tr key={order.id}><td><strong>#{order.id.slice(-8).toUpperCase()}</strong></td><td>{order.customer?.name ?? '—'}</td><td>{firstItem?.product.name ?? 'Multiple items'}</td><td>{firstItem?.quantity ?? '—'}</td><td><strong>${Number(order.total).toFixed(2)}</strong></td><td><select className="native-select" value={order.status} onChange={(event) => updateStatus.mutate({ id: order.id, value: event.target.value })}><option>PENDING</option><option>PROCESSING</option><option>SHIPPED</option><option>DELIVERED</option><option>CANCELLED</option></select></td><td className="muted-cell">{new Date(order.createdAt).toLocaleDateString()}</td></tr> })}</tbody></table>{filtered.length === 0 && <div className="empty-state"><Search size={24} /><h3>No orders found</h3><p>Try adjusting your search or status filter.</p></div>}</div>}<div className="pagination"><span>Showing <strong>{filtered.length}</strong> of <strong>{orders.data?.length ?? 0}</strong> orders</span></div></section></div>
}
