import config from "config";
import connect from "./utils/connect";
import createServer from "./utils/server";

// Esto esta bien pero en vez de sacarlo del config sacalo del .env
const port = config.get<number>("port");
const app = createServer();

app.listen(port, async () => {
    console.log(`App is running at htpp://localhost:${port}`);
    await connect();
});
