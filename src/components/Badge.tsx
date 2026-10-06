import type { Status } from '../data'

export function Badge({ status }: { status: Status | string }) {
  const styles: Record<string, string> = {
    Active: 'badge-green', ACTIVE: 'badge-green', Paid: 'badge-green', Trial: 'badge-amber', TRIAL: 'badge-amber', Pending: 'badge-amber', PENDING: 'badge-amber', Churned: 'badge-slate', CHURNED: 'badge-slate', Failed: 'badge-red', CANCELLED: 'badge-red',
  }
  return <span className={`badge ${styles[status] ?? 'badge-slate'}`}><span className="badge-dot" />{status}</span>
}
