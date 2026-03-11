import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/TaskContext'
import styles from './Navbar.module.css'

function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>✦</span>
          <span>taskflow</span>
        </Link>

        <div className={styles.right}>
          {location.pathname !== '/' && (
            <Link to="/" className={styles.backLink}>
              ← All tasks
            </Link>
          )}
          <button
            onClick={toggleTheme}
            className={styles.themeBtn}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
