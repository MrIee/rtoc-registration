import type { Route } from "./+types/home";
import Landing from "../containers/Landing";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "RTOC Registration" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <Landing />;
}
