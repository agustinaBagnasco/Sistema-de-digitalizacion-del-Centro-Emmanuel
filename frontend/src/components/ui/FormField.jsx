import "./Forms.css";

export default function FormField({
  children,
  columns = 2,
  className = "",
}) {
  return (
    <div
      className={`form-field columns-${columns} ${className}`}
    >
      {children}
    </div>
  );
}