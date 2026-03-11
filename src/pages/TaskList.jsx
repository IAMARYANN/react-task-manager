import { useState, useMemo } from 'react'
import { useTasks } from '../context/TaskContext'
import TaskCard from '../components/TaskCard'
import AddTaskForm from '../components/AddTaskForm'
import styles from './TaskList.module.css'

const FILTERS = ['all', 'pending', 'completed']

function TaskList() {
  const { tasks, loading, error } = useTasks()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('default')

  const filtered = useMemo(() => {
    let list = [...tasks]

    // search
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(t => t.title.toLowerCase().includes(q))
    }

    // filter
    if (filter === 'completed') list = list.filter(t => t.completed)
    if (filter === 'pending')   list = list.filter(t => !t.completed)

    // sort
    if (sort === 'priority') {
      const order = { high: 0, medium: 1, low: 2 }
      list.sort((a, b) => (order[a.priority] ?? 1) - (order[b.priority] ?? 1))
    } else if (sort === 'due') {
      list.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate) - new Date(b.dueDate)
      })
    }

    return list
  }, [tasks, search, filter, sort])

  const counts = useMemo(() => ({
    all: tasks.length,
    pending: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
  }), [tasks])

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1>My Tasks</h1>
        </div>
        <div className={styles.skeletonList}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeleton} style={{ animationDelay: `${i * 0.07}s` }} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.errorBox}>
          <span>⚠</span>
          <div>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try again</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>My Tasks</h1>
          <p className={styles.subtitle}>
            {counts.pending} pending · {counts.completed} done
          </p>
        </div>
      </div>

      <AddTaskForm />

      <div className={styles.controls}>
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          {search && (
            <button className={styles.clearSearch} onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        <div className={styles.filterGroup}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className={styles.count}>{counts[f]}</span>
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className={styles.sortSelect}
        >
          <option value="default">Default order</option>
          <option value="priority">Sort by priority</option>
          <option value="due">Sort by due date</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <span>🔍</span>
          <p>No tasks found</p>
          <small>
            {search ? `No results for "${search}"` : `No ${filter} tasks yet`}
          </small>
        </div>
      ) : (
        <div className={styles.list}>
          {filtered.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  )
}

export default TaskList
