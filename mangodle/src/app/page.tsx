import Link from 'next/link';
import styles from './page.module.css'; // optional for styling

export default function Home() {
  return (
    <main className={styles.home}>
      <h1>Welcome to Word Games!</h1>
      <ul>
        <li>
          <Link href="/mangodle">Play Mangodle</Link>
        </li>
        <li>
          <Link href="/mangobee">Play Mango Bee</Link>
        </li>
        <li>
          <Link href="/minimango">Play Mini Mango</Link>
        </li>
      </ul>
    </main>
  );
}