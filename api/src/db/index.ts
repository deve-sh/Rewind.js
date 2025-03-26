import MemoryAdaptor from "./MemoryAdaptor";
import PostgresAdaptor from "./PostgresAdaptor";

const DB_TO_USE = process.env.DB_TO_USE || "memory";

let exportedModule: MemoryAdaptor | PostgresAdaptor = new MemoryAdaptor();

if (DB_TO_USE === "postgres") exportedModule = new PostgresAdaptor();

export default exportedModule;
