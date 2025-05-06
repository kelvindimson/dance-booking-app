import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { AccountLayout } from './AccountLayout';

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return <AccountLayout user={session.user} />;
}