import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.home}>
      <h1 className={styles.title}>Mango Times Games</h1>
      <div className={styles.grid}>
        <Link href="/mangodle" className={styles.card}>
          <h2>Mangodle &rarr;</h2>
          <p>Guess the mango word!</p>
        </Link>
        <Link href="/mangobee" className={styles.card}>
          <h2>Mango Bee &rarr;</h2>
          <p>Find words with mango letters!</p>
        </Link>
        <Link href="/minimango" className={styles.card}>
          <h2>Mini Mango &rarr;</h2>
          <p>A mini word puzzle to solve.</p>
        </Link>
        <Link href="/mands" className={styles.card}>
          <h2>Mands &rarr;</h2>
          <p>Another fun mango word game.</p>
        </Link>
        <Link href="/mangonections" className={styles.card}>
          <h2>Mangonections &rarr;</h2>
          <p>Group words by connections.</p>
        </Link>
      </div>
    </main>
  );
}