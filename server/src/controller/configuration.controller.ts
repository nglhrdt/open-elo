import express from "express";
import Container from "typedi";
import logger from "../logger";
import ConfigurationService from "../service/configuration.service";

const router = express.Router();
const service = Container.get(ConfigurationService);

router.get("/", async (req, res) => {
    const config = await service.getConfiguration();
    res.render("configuration", config || { id: null, tableName: "" });
});

router.post("/", async (req, res) => {
    const { id, tableName } = req.body;

    if (!tableName) {
        logger.error("No table name provided");
        return res.status(400).send("Table name is required");
    }

    const config = await (!id ? service.create(tableName) : service.update(id, { tableName }));

    res.render("configuration", config);
});

export default router;