import { Provider } from 'react-redux';
import { store } from './store/store';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import Layout from './containers/Layout';
import Landing from './containers/Landing';
import Login from './containers/Login';
import CreateProfile from './containers/CreateProfile';
import ProfileSummary from './containers/ProfileSummary';
import Profile from './containers/Profile';
import Matrix from './containers/Matrix';
import './app.css';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="create-profile" element={<CreateProfile />} />
          <Route path="user-profile" element={<ProfileSummary />} />
          <Route path="profile" element={<Profile />} />
          <Route path="matrix" element={<Matrix />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>
);
