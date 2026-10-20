import { useEffect, useState } from "react";
import "./styles.css";

type Habit = {
  id: number;
  title: string;
  completed: boolean;
};

type Filter = "all" | "completed" | "active";

const STORAGE_KEY = "habit-tracker-habits";

function App() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) as Habit[] : [];
    } catch {
      return [];
    }
  });

  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  function addHabit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) return;

    const newHabit: Habit = {
      id: Date.now(),
      title: trimmedTitle,
      completed: false,
    };

    setHabits((previous) => [newHabit, ...previous]);
    setTitle("");
  }

  function toggleHabit(id: number) {
    setHabits((previous) =>
      previous.map((habit) =>
        habit.id === id
          ? { ...habit, completed: !habit.completed }
          : habit
      )
    );
  }

  function deleteHabit(id: number) {
    setHabits((previous) =>
      previous.filter((habit) => habit.id !== id)
    );
  }

  const filteredHabits = habits.filter((habit) => {
    if (filter === "completed") return habit.completed;
    if (filter === "active") return !habit.completed;
    return true;
  });

  const completedCount = habits.filter(
    (habit) => habit.completed
  ).length;

  const progress = habits.length
    ? Math.round((completedCount / habits.length) * 100)
    : 0;

  return (
    <div className="app">
      <header className="header">
        <a className="logo" href="#">
          <span className="logo-icon">✓</span>
          habitly
        </a>
        <span className="header-label">YOUR DAILY ROUTINE</span>
      </header>

      <main className="container">
        <section className="intro">
          <span className="eyebrow">SMALL STEPS, BIG CHANGES</span>
          <h1>Build better habits.</h1>
          <p>
            Маленькие действия сегодня — большие результаты завтра
          </p>
        </section>

        <section className="progress-card">
          <div className="progress-top">
            <div>
              <span className="muted">Твой прогресс</span>
              <h2>{completedCount} из {habits.length} привычек</h2>
            </div>
            <div className="progress-number">{progress}%</div>
          </div>

          <div
            className="progress-track"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Общий прогресс"
          >
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="progress-caption">
            {habits.length === 0
              ? "Добавь первую привычку и начни свой путь"
              : progress === 100
                ? "Отличная работа! Все привычки выполнены"
                : "Продолжай двигаться к своей цели!"}
          </p>
        </section>

        <section className="habits-section">
          <div className="section-heading">
            <div>
              <h2>Мои привычки</h2>
              <p>Следи за своими ежедневными действиями</p>
            </div>
            <span className="habit-count">{habits.length}</span>
          </div>

          <form className="add-form" onSubmit={addHabit}>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Например, читать 20 минут..."
              maxLength={100}
              aria-label="Название привычки"
            />
            <button type="submit">+ Добавить</button>
          </form>

          <div className="filters" aria-label="Фильтр привычек">
            <button
              type="button"
              className={filter === "all" ? "filter active" : "filter"}
              onClick={() => setFilter("all")}
            >
              Все <span>{habits.length}</span>
            </button>
            <button
              type="button"
              className={
                filter === "active" ? "filter active" : "filter"
              }
              onClick={() => setFilter("active")}
            >
              Активные
            </button>
            <button
              type="button"
              className={
                filter === "completed" ? "filter active" : "filter"
              }
              onClick={() => setFilter("completed")}
            >
              Выполненные
            </button>
          </div>

          <div className="habit-list">
            {filteredHabits.map((habit) => (
              <article
                className={
                  habit.completed
                    ? "habit-item completed"
                    : "habit-item"
                }
                key={habit.id}
              >
                <button
                  type="button"
                  className="check-button"
                  onClick={() => toggleHabit(habit.id)}
                  aria-label={
                    habit.completed
                      ? `Отменить выполнение: ${habit.title}`
                      : `Выполнить: ${habit.title}`
                  }
                >
                  {habit.completed ? "✓" : ""}
                </button>

                <span className="habit-title">{habit.title}</span>

                <span className="status">
                  {habit.completed ? "Выполнено" : "В процессе"}
                </span>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() => deleteHabit(habit.id)}
                  aria-label={`Удалить: ${habit.title}`}
                  title="Удалить привычку"
                >
                  ×
                </button>
              </article>
            ))}

            {filteredHabits.length === 0 && (
              <div className="empty-state">
                <span className="empty-icon">✦</span>
                <h3>
                  {habits.length === 0
                    ? "Пока нет привычек"
                    : "Здесь пока пусто"}
                </h3>
                <p>
                  {habits.length === 0
                    ? "Добавь привычку, которую хочешь развить"
                    : "Попробуй выбрать другой фильтр"}
                </p>
              </div>
            )}
          </div>
        </section>

        <footer className="footer">
          <span>Один день за раз</span>
          <span>HABITLY © 2026</span>
        </footer>
      </main>
    </div>
  );
}

export default App;