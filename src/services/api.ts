import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nexusops-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('nexusops-token')
    window.dispatchEvent(new Event('nexusops-auth'))
  }
  return Promise.reject(error)
})

export type ApiCustomer = { id: string; name: string; email: string; phone: string | null; company: string | null; status: string; createdAt: string }
export type ApiProduct = { id: string; name: string; category?: string; price: number; stock: number; status?: string; createdAt: string }
export type ApiOrder = { id: string; total: number; status: string; createdAt: string; customer: { name: string }; items?: Array<{ quantity: number; product: { name: string } }> }
export type Overview = { customers: number; products: number; orders: number; revenue: number; orderStatuses: Array<{ status: string; _count: { _all: number } }> }

export async function login(email: string, password: string) {
  const response = await api.post<{ token: string; user: { id: string; name: string; email: string; avatar: string | null; createdAt: string } }>('/auth/login', { email, password })
  return response.data
}

export async function getProducts() {
  const response = await api.get<{ data: ApiProduct[] }>('/products')
  return response.data.data
}

export async function getOverview() {
  const response = await api.get<Overview>('/analytics/overview')
  return response.data
}