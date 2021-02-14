import Link from 'next/link';

export default function AccountPage() {
  return (
    <div>
      <h1>Account</h1>
      <Link href="/orders">
        <button type="button">My orders</button>
      </Link>
    </div>
  );
}
