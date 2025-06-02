import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:4000", // Указываем порт вашего приложения
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}", // Указываем путь к тестовым файлам
    supportFile: false, // Отключаем supportFile, если он не используется
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  viewportWidth: 1280, // Опционально: задаём ширину viewport
  viewportHeight: 720, // Опционально: задаём высоту viewport
  defaultCommandTimeout: 10000, // Опционально: увеличиваем таймаут для команд
});