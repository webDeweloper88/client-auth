import { CONFIG } from "@/shared/model/config";

function HomePage() {
  return (
    <div>
      <h1>Home prilojeniya zapustilsya:{CONFIG.API_BASE_URL}</h1>
    </div>
  );
}

export const Component = HomePage;
