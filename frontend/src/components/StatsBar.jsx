import './StatsBar.css';

const DIFFICULTY_COLORS = {
  Easy: 'var(--green)',
  Medium: 'var(--accent)',
  Advanced: '#1e40af',
};

export default function StatsBar({ stats }) {
  return (
    <div className="stats-bar">
      <div className="stats-bar__inner">
        <div className="stats-bar__total">
          <span className="stats-bar__number">{stats.total}</span>
          <span className="stats-bar__label">recipes</span>
        </div>
        <div className="stats-bar__categories">
          {Object.entries(stats.byCategory).map(([cat, count]) => (
            <span key={cat} className="stats-bar__chip">
              {cat} <strong>{count}</strong>
            </span>
          ))}
        </div>
        <div className="stats-bar__difficulty">
          {Object.entries(stats.byDifficulty).map(([level, count]) => (
            <span
              key={level}
              className="stats-bar__diff"
              style={{ '--diff-color': DIFFICULTY_COLORS[level] }}
            >
              {level}: {count}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
