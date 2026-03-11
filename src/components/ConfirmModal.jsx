import styles from './ConfirmModal.module.css'

export default function ConfirmModal({ message, subtext, onConfirm, onCancel, confirmLabel = 'Confirm', danger = false }) {
  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className={styles.modal}>
        <div className={styles.icon}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <p className={styles.message}>{message}</p>
        {subtext && <p className={styles.subtext}>{subtext}</p>}
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
          <button className={`${styles.confirmBtn} ${danger ? styles.danger : ''}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
