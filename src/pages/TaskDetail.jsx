import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTasks } from '../context/TaskContext'
import styles from './TaskDetail.module.css'

function TaskDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getTask, updateTask, toggleTask } = useTasks()

  const task = getTask(id)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || '')
      setPriority(task.priority || 'medium')
      setDueDate(task.dueDate || '')
    }
  }, [task?.id])

  if (!task) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <span className={styles.code}>404</span>
          <h2>Task not found</h2>
          <p>The task you're looking for doesn't exist or may have been deleted.</p>
          <button onClick={() => navigate('/')} className={styles.backBtn}>
            ← Back to tasks
          </button>
        </div>
      </div>
    )
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) {
      setErr('Title cannot be empty.')
      return
    }

    setSaving(true)
    setErr('')
    try {
      await updateTask(task.id, {
        title: trimmed,
        description,
        priority,
        dueDate,
        completed: task.completed,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setErr('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const isOverdue = dueDate && !task.completed && new Date(dueDate) < new Date()

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumb}>
        <button onClick={() => navigate('/')} className={styles.backLink}>
          ← All tasks
        </button>
        <span className={styles.sep}>/</span>
        <span className={styles.crumb}>Task #{task.id}</span>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.headerLeft}>
            <span className={`${styles.statusBadge} ${task.completed ? styles.done : styles.pending}`}>
              {task.completed ? '✓ Completed' : '• Pending'}
            </span>
            {isOverdue && <span className={styles.overdueBadge}>⚠ Overdue</span>}
          </div>
          <button
            onClick={() => toggleTask(task.id)}
            className={`${styles.toggleBtn} ${task.completed ? styles.toggleUndo : ''}`}
          >
            {task.completed ? 'Mark incomplete' : 'Mark complete'}
          </button>
        </div>

        <form onSubmit={handleSave} noValidate>
          <div className={styles.field}>
            <label htmlFor="detail-title">Title <span className={styles.req}>*</span></label>
            <input
              id="detail-title"
              type="text"
              value={title}
              onChange={e => { setTitle(e.target.value); if (err) setErr('') }}
              className={err ? styles.inputError : ''}
            />
            {err && <span className={styles.errMsg}>{err}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="detail-desc">Description</label>
            <textarea
              id="detail-desc"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="No description yet..."
              rows={3}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="detail-priority">Priority</label>
              <select
                id="detail-priority"
                value={priority}
                onChange={e => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="detail-due">Due date</label>
              <input
                id="detail-due"
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.formFooter}>
            {saved && <span className={styles.savedMsg}>✓ Changes saved</span>}
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskDetail
