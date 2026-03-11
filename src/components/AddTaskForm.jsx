import { useState } from 'react'
import { useTasks } from '../context/TaskContext'
import styles from './AddTaskForm.module.css'

function AddTaskForm() {
  const { addTask } = useTasks()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [err, setErr] = useState('')

  const reset = () => {
    setTitle('')
    setDescription('')
    setPriority('medium')
    setDueDate('')
    setErr('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) {
      setErr('Task title is required.')
      return
    }

    setLoading(true)
    setErr('')
    try {
      await addTask({ title: trimmed, description, priority, dueDate })
      reset()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      setOpen(false)
    } catch {
      setErr('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      {success && (
        <div className={styles.successBanner}>
          ✓ Task added successfully
        </div>
      )}

      {!open ? (
        <button className={styles.openBtn} onClick={() => setOpen(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add new task
        </button>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.formHeader}>
            <h3>New task</h3>
            <button type="button" onClick={() => { setOpen(false); reset() }} className={styles.closeBtn}>✕</button>
          </div>

          <div className={styles.field}>
            <label htmlFor="task-title">Title <span className={styles.req}>*</span></label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={e => { setTitle(e.target.value); if (err) setErr('') }}
              placeholder="What needs to be done?"
              className={err ? styles.inputError : ''}
              autoFocus
            />
            {err && <span className={styles.errMsg}>{err}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="task-desc">Description <span className={styles.opt}>(optional)</span></label>
            <textarea
              id="task-desc"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add some details..."
              rows={2}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                value={priority}
                onChange={e => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="task-due">Due date <span className={styles.opt}>(optional)</span></label>
              <input
                id="task-due"
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={() => { setOpen(false); reset() }}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Adding...' : 'Add task'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default AddTaskForm
