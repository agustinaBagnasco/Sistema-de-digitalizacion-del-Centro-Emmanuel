import "./Forms.css";

export default function Select({
  label,
  options = [],
  error,
  required = false,
  placeholder = "Seleccione una opción",
  ...props
}) {
  return (
    <div className="select-group">

      {label && (
        <label>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}

      <select className="select" {...props}>
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <small className="input-error">
          {error}
        </small>
      )}

    </div>
  );
}