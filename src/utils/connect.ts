import mongoose from "mongoose";
import config from "config";

async function connect () {
  // Sacalo de la .env
    const dbUri = config.get<string>("dbUri");

    try {
        await mongoose.connect(dbUri);
        console.log("Db connected");
    } catch (error) {
        console.error("Could not connect to DB!");
        process.exit(1);
    }
}

export default connect;