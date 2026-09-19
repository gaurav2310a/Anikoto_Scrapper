const express = require('express');
const morgan = require('morgan');

const schedule = require('./mwr/schedule');
const id = require('./mwr/id');
const ep = require('./mwr/ep');
const info = require('./mwr/info');

const app = express();

app.set('trust proxy', 1);
app.use(morgan('combined'));

const { rateLimit, ipKeyGenerator } = require('express-rate-limit');

const globalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: {
        success: false,
        error: "Too many requests. Please slow down."
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => ipKeyGenerator(req.ip)
});

app.use(globalLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Anikoto API is running on Cloudflare Workers"
    });
});

app.get("/schedule", async (req, res) => {
    try {
        const time = req.query.time;
        const Schedule = await schedule(time);
        res.json(Schedule);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Failed to fetch schedule" });
    }
});

app.get("/page", async (req, res) => {
    try {
        const link = req.query.name;
        const Id = await id(link);
        res.json(Id);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Failed to fetch page data" });
    }
});

app.get("/episodes", async (req, res) => {
    try {
        const ID = req.query.id;
        const Ep = await ep(ID);
        res.json(Ep);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Failed to fetch episodes" });
    }
});

app.get("/info", async (req, res) => {
    try {
        const name = req.query.name;
        const Info = await info(name);
        res.json(Info);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Failed to fetch info" });
    }
});

module.exports = app;
