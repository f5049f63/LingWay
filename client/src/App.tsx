import { Route, Routes } from "react-router-dom";
import ComingSoon from "./components/ComingSoon";
import Layout from "./components/Layout";
import { GuestOnly, RequireAuth } from "./components/RouteGuards";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";

// Страницы ещё без дизайна, это заглушки. Когда делаешь настоящую страницу, замени element в нужном маршруте.
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Landing />} />
        <Route
          path="learn"
          element={<ComingSoon title="Путь обучения" description="Здесь будут ситуации и уроки." />}
        />
        <Route path="situation/:slug" element={<ComingSoon title="Ситуация" />} />
        <Route path="lesson/:id" element={<ComingSoon title="Урок" />} />
        <Route path="phrasebook" element={<ComingSoon title="Разговорник" />} />

        {/* Только для гостей */}
        <Route element={<GuestOnly />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Только для вошедших */}
        <Route element={<RequireAuth />}>
          <Route path="practice" element={<ComingSoon title="Практика" />} />
          <Route path="vocab" element={<ComingSoon title="Мой словарь" />} />
          <Route path="profile" element={<ComingSoon title="Профиль" />} />
          <Route path="settings" element={<ComingSoon title="Настройки" />} />
        </Route>

        <Route path="about" element={<ComingSoon title="О проекте" />} />
        <Route path="privacy" element={<ComingSoon title="Конфиденциальность" />} />
        <Route path="terms" element={<ComingSoon title="Условия использования" />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
