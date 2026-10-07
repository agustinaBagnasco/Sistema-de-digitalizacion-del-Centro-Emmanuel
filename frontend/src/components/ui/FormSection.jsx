import "./Forms.css";

export default function FormSection({
  title,
  subtitle,
  children,
  className = "",
}) {
  return (
    <section className={`form-section ${className}`}>
      {(title || subtitle) && (
        <div className="form-section-header">

          {title && (
            <h3 className="form-section-title">
              {title}
            </h3>
          )}

          {subtitle && (
            <p className="form-section-subtitle">
              {subtitle}
            </p>
          )}

        </div>
      )}

      <div className="form-section-body">
        {children}
      </div>
    </section>
  );
}