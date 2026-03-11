import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useTasks } from '../context/TaskContext'
import styles from './TaskCard.module.css'

const PRIORITY_LABELS = { low: 'Low', medium: 'Med', high: 'High' }
const PRIORITY_CLASS = { low: 'low', medium: 'med', high: 'high' }

function TaskCard({ task }) {
  const { toggleTask, deleteTask } = useTasks()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date()

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    setDeleting(true)
    try {
      await deleteTask(task.id)
    } catch {
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  return (
    <div className={`${styles.card} ${task.completed ? styles.completed : ''} ${deleting ? styles.fadeOut : ''}`}>
      <div className={styles.left}>
        <button
          className={`${styles.checkbox} ${task.completed ? styles.checked : ''}`}
          onClick={() => toggleTask(task.id)}
          aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.completed && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>

      <div className={styles.body}>
        <Link to={`/tasks/${task.id}`} className={styles.title}>
          {task.title}
        </Link>
        {task.description && (
          <p className={styles.desc}>{task.description}</p>
        )}
        <div className={styles.meta}>
          <span className={`${styles.badge} ${styles[PRIORITY_CLASS[task.priority] || 'med']}`}>
            {PRIORITY_LABELS[task.priority] || 'Med'}
          </span>
          {task.dueDate && (
            <span className={`${styles.due} ${isOverdue ? styles.overdue : ''}`}>
              {isOverdue ? '⚠ ' : ''}
              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
          <span className={`${styles.status} ${task.completed ? styles.done : styles.pending}`}>
            {task.completed ? 'Done' : 'Pending'}
          </span>
        </div>
      </div>

      <div className={styles.actions}>
        <Link to={`/tasks/${task.id}`} className={styles.editBtn} title="Edit task">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </Link>
        {confirmDelete ? (
          <div className={styles.confirmRow}>
            <button onClick={handleDelete} className={styles.confirmYes} disabled={deleting}>
              {deleting ? '...' : 'Yes'}
            </button>
            <button onClick={() => setConfirmDelete(false)} className={styles.confirmNo}>No</button>
          </div>
        ) : (
          <button onClick={handleDelete} className={styles.deleteBtn} title="Delete task">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14H6L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4h6v2"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default TaskCard
