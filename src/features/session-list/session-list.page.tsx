import { ROUTES } from "@/shared/model/routes";
import { Link } from "react-router-dom";

function SessionListPage() {
  return (
    <div>
      <h1>Session List</h1>
      <Link to={ROUTES.SESSION.replace(":sessionId", "1")}>Session 1</Link>
    </div>
  );
}

export const Component = SessionListPage;
