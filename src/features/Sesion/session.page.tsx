import type { PathParams, ROUTES } from "@/shared/model/routes";
import { useParams } from "react-router-dom";

function SessionPage() {
  const params = useParams<PathParams[typeof ROUTES.SESSION]>();
  return <div>Session {params.sessionId}</div>;
}

export const Component = SessionPage;
