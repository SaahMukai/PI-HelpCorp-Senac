import type { User } from '../types'

export function Avatar({ user, size = 'normal' }: { user?: User; size?: 'small' | 'normal' }) {
  return <span className={`avatar avatar-${size}`} title={user?.name}>{user?.initials ?? '??'}</span>
}
