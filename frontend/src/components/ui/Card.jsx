import "./Forms.css";

export default function Card({ title, children, className = "" }) {
  return (
    <div className={`card ${className}`}>
      {title && (
        <div className="card-header">
          <h2>{title}</h2>
        </div>
      )}

      <div className="card-body">
        {children}
      </div>
    </div>
  );
}