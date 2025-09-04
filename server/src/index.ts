import express from "express";
import expressLayouts from 'express-ejs-layouts';
import { AppDataSource } from "./database/data-source";
import logger from "./logger";

import path from "path";
import configRoutes from "./controller/configuration.controller";
import homeRoutes from "./controller/home.controller";

AppDataSource.initialize().then(() => {
    logger.info("Database connection established successfully");
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Set up view engine if needed
    app.set("view engine", "ejs");
    app.set("views", "./src/views/pages");
    app.use(expressLayouts);
    app.set('layout', '../layout/layout');
    app.use('/bootstrap', express.static(path.join(__dirname, '..', 'node_modules', 'bootstrap', 'dist')));

    app.use("/", homeRoutes);
    app.use("/configuration", configRoutes);

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
    });
}).catch(error => {
    logger.error("Error during Data Source initialization:", error);
    process.exit(1);
}).catch(error => console.log(error))
