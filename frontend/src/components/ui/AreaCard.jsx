import { Link } from "react-router-dom";
import "./AreaCard.css";

export default function AreaCard({
  title,
  icon,
  color = "#3b82f6",
  to,
}) {
  return (
    <Link
      to={to}
      className="area-card"
      style={{
        "--color": color,
      }}
    >
      <div className="area-header">
        <div className="area-icon">
          {icon}
        </div>

        <h2>{title}</h2>
      </div>

      <hr />

      <button className="area-button">
        +
      </button>
    </Link>
  );
}