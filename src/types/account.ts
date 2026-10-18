import type { Provider } from '@/lib/auth-api';

export type SecureIntent =
  | { kind: 'link'; provider: Provider }
  | { kind: 'unlink'; identityId: string }
  | { kind: 'email' }
  | { kind: 'password' }
  | { kind: 'disable' }
  | { kind: 'delete' };
