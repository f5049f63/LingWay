import { createApp } from "./app";
import { env } from "./env";

createApp().listen(env.PORT, () => {
  console.log(`Сервер запущен: http://localhost:${env.PORT}`);
});
