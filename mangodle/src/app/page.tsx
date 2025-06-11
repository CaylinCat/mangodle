import Link from 'next/link';
import styles from './page.module.css';

const GAMES = [
  {
    href: '/mangodle',
    title: 'Mangodle',
    description: 'Guess the mango word!',
    emoji: '🥭',
    bgColor: '#f0c651',
  },
  {
    href: '/mangobee',
    title: 'Mango Bee',
    description: 'Find words with mango letters!',
    emoji: '🐝',
    bgColor: '#f0db51',
  },
  {
    href: '/minimango',
    title: 'Mini Mango',
    description: 'A mini mango crossword to solve!',
    emoji: '🔲',
    bgColor: '#f0c651',
  },
  {
    href: '/mands',
    title: 'Mands',
    description: 'The strands of a mango!',
    emoji: '🧠',
    bgColor: '#f0db51',
  },
  {
    href: '/mangonections',
    title: 'Mangonections',
    description: 'Connect em mangos!',
    emoji: '🧩',
    bgColor: '#f0c651',
  },
];

export default function Home() {
  return (
    <main className={styles.home}>
      <h1 className={styles.title}>Mango Times Games</h1>
      <div className={styles.grid}>
        {GAMES.map(({ href, title, description, emoji, bgColor }) => (
          <Link href={href} key={href}>
            <a className={styles.card}>
              <div className={styles.cardTop} style={{ backgroundColor: bgColor }}>
                <div className={styles.emoji}>{emoji}</div>
              </div>
              <div className={styles.cardContent}>
                <h2>{title}</h2>
                <p>{description}</p>
              </div>
              <div className={styles.cardFooter}>Play</div>
            </a>
          </Link>
        ))}
      </div>
      <div className={styles.version}>v1.0</div>
    </main>
  );
}