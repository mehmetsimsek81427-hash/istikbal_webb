import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
    },
    datasource: {
        // DATABASE_URL .env dosyasından okunur
        url: process.env.DATABASE_URL!,
    },
});
