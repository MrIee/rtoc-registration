import type { Route } from './+types/home';
import Landing from '../containers/Landing';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'RTOC Registration' },
  ];
}

export default function Home() {
  return <Landing />;
}
