import "./Forms.css";

export default function Textarea({
  label,
  error,
  rows = 4,
  required = false,
  ...props
}) {
  return (
    <div className="textarea-group">

      {label && (
        <label>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}

      <textarea
        className="textarea"
        rows={rows}
        {...props}
      />

      {error && (
        <small className="input-error">
          {error}
        </small>
      )}

    </div>
  );
}