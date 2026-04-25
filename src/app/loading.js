export default function Loading() {
  return (
    <div className="page-loading">
      <div className="container">
        <div className="skeleton-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-image" />
              <div className="skeleton-text skeleton-title" />
              <div className="skeleton-text skeleton-subtitle" />
              <div className="skeleton-text skeleton-price" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
