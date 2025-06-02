import Link from 'next/link';
import styles from './page.module.css'; // optional for styling

export default function Home() {
  return (
    <main className={styles.home}>
      <h1>Welcome to Word Games!</h1>
      <ul>
        <li>
          <Link href="/mangodle">Play Wordle</Link>
        </li>
        <li>
          <Link href="/mangobee">Play Spelling Bee</Link>
        </li>
      </ul>
    </main>
  );
}