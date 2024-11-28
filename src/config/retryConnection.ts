import { MysqlDataSource } from './database';

async function connectWithRetry() {
  let retries: number = 3;
  while (retries) {
    try {
      await MysqlDataSource.initialize();
      console.log(`Banco de dados reconectado!`);
      break;
    } catch (err) {
      console.log(`Erro ao reconectar ao banco de dados. Tentanto novamente... ${retries} tentativas restantes`);
      retries -= 1;
      await new Promise((res) => setTimeout(res, 3000));
    }
  }
}

export default connectWithRetry;
