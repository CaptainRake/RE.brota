import { Routes, Route } from 'react-router-dom';

import Splash from './pages/Splash';
import Enter from './pages/Enter';
import Login from './pages/Login';
import Home from './pages/Home';
import AR from './pages/AR';
import Discovery from './pages/Discovery';
import Guide from './pages/Guide';
import Backpack from './pages/Backpack';
import Challenges from './pages/Challenges';
import Profile from './pages/Profile';
import Game from './pages/Game';
import BackpackSelect from './pages/BackpackSelect';
import Intro from './pages/Intro';
import Shop from './pages/Shop';
import MissionNotifications from './components/MissionNotifications';
import ExplorerSetup from './pages/ExplorerSetup';
import Privacy from './pages/Privacy';
import PrivacyConsent from './components/ui/PrivacyConsent';
import Settings from './pages/Settings';

export default function App() {
  return (
    <>
    <MissionNotifications />

    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/enter" element={<Enter />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Game />} />
      <Route path="/ar" element={<AR />} />
      <Route path="/discovery" element={<Discovery />} />
      <Route path="/guide" element={<Guide />} />
      <Route path="/backpack" element={<Backpack />} />
      <Route path="/challenges" element={<Challenges />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/home-old" element={<Home />} />
      <Route path="/backpack-select" element={<BackpackSelect />} />
      <Route path="/intro" element={<Intro />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/explorer-setup" element={<ExplorerSetup />} />
      <Route path="/privacidade" element={<Privacy />} />
      <Route path="/settings" element={<Settings />} />

    </Routes>

    return (
    <>
      <PrivacyConsent />

      <Routes>
        {/* Todas as suas rotas existentes */}
      </Routes>
    </>
  );
    </>
  );
}