import { envs } from "./config";
import { MongoDatabase } from "./data/mongodb";
import { SeedRunner } from "./data/seed/seed";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";

(() => {
  main();
})();

async function main() {
  // Conectar ao banco de dados
  await MongoDatabase.connect({
    dbName: envs.MONGO_DB_NAME,
    mongoUrl: envs.MONGO_URL,
  });

  // Executar seeds (dados iniciais)
  await SeedRunner.run();

  // Iniciar o servidor
  new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  }).start();
}