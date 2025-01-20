import express from "express";
import cors from "cors";
import puppeteer from "puppeteer";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { createServer } from "http";

dotenv.config();

const app = express();

// Middleware CORS și parsare JSON
app.use(cors());
app.use(express.json());

// Configurarea pool-ului MySQL
const pool = mysql.createPool({
  host: process.env.MYSQL_ADDON_HOST,
  user: process.env.MYSQL_ADDON_USER,
  password: process.env.MYSQL_ADDON_PASSWORD,
  database: process.env.MYSQL_ADDON_DB,
  port: process.env.MYSQL_ADDON_PORT,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});

// Crearea tabelei dacă nu există
const initializeDB = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        source VARCHAR(50),
        text TEXT,
        href TEXT,
        imgSrc TEXT,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    connection.release();
    console.log("Database initialized");
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
};

await initializeDB();

// Configurare site-uri și tag-uri
const sitesConfig = {
  g4media: {
    url: "https://g4media.ro",
    tags: [{ tag: "div.post-review", contentSelector: "h3" }],
  },
  hotnews: {
    url: "https://hotnews.ro",
    tags: [{ tag: "article", contentSelector: "h2" }],
  },
  spotmedia: {
    url: "https://spotmedia.ro",
    tags: [{ tag: "div.jet-smart-listing__post", contentSelector: "div.mbm-h5" }],
    tags: [{ tag: "div.jet-smart-listing__post", contentSelector: "div.mbm-h6" }],
  },
  ziare: {
    url: "https://ziare.com",
    tags: [
      { tag: "div.spotlight__article", contentSelector: "h1.spotlight__article__title" },
      { tag: "div.spotlight__article", contentSelector: "h2.spotlight__article__title" },
      { tag: "div.news__article", contentSelector: "h3.news__article__title" },
    ],
  },
  digi24: {
    url: "https://digi24.ro",
    tags: [
      { tag: "article.article-alt", contentSelector: "h3.article-title" },
      { tag: "article", contentSelector: "h4.article-title" },      
    ],
  },
  libertatea: {
    url: "https://libertatea.ro",
    tags: [
      { tag: "div.news-item", contentSelector: "h3.article-title" },
      { tag: "div.news-item", contentSelector: "h2.article-title" },
    ],
  },
  stirileprotv: {
    url: "https://stirileprotv.ro",
    tags: [{ tag: "article.article", contentSelector: "h3.article-title-daily" }],
  }, 
  news: {
    url: "https://news.ro",
    tags: [{ tag: "article.article", contentSelector: "h2" }],
  },   
  gsp: {
    url: "https://gsp.ro",
    tags: [{ tag: "div.news-item", contentSelector: "h2" }],
  },          
  prosport: {
    url: "https://prosport.ro",
    tags: [{ tag: "div.article--wide", contentSelector: "h2.article__title" }],
  },            
};

// Funcție pentru scraping
const scrapeTags = async (page, tags, source) => {
  const results = [];
  const seenLinks = new Set();

  for (const { tag, contentSelector } of tags) {
    const elements = await page.$$eval(
      tag,
      (elements, contentSelector) =>
        elements.map((el) => {
          const imgElement = el.querySelector("img");
          const imgSrc =
            imgElement?.getAttribute("data-src") || imgElement?.src || null;

          const contentElement = el.querySelector(contentSelector);
          const link = contentElement ? contentElement.querySelector("a") : null;

          return {
            imgSrc: imgSrc,
            text: contentElement ? contentElement.textContent.trim() : null,
            href: link ? link.href : null,
          };
        }),
      contentSelector
    );

    elements.forEach((element) => {
      if (element.href && !seenLinks.has(element.href)) {
        seenLinks.add(element.href);
        results.push({ ...element, source });
      }
    });
  }
  return results;
};

// Endpoint pentru scraping
app.get("/scrape-all", async (req, res) => {
  console.log("Scrape-all endpoint accessed");
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    for (const source in sitesConfig) {
      const { url, tags } = sitesConfig[source];
      try {
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "domcontentloaded" });
        const data = await scrapeTags(page, tags, source);

        const connection = await pool.getConnection();
        for (const item of data) {
          const [existing] = await connection.execute(
            "SELECT id FROM articles WHERE href = ?",
            [item.href]
          );

          if (existing.length === 0) {
            console.log(`Inserting article: ${item.text}`);
            await connection.execute(
              "INSERT INTO articles (source, text, href, imgSrc) VALUES (?, ?, ?, ?)",
              [item.source, item.text, item.href, item.imgSrc]
            );
          }
        }
        connection.release();
        await page.close();
      } catch (error) {
        console.error(`Failed to scrape source: ${source}`, error);
      }
    }

    await browser.close();
    res.json({ message: "Scraping completed and data saved to MySQL" });
  } catch (error) {
    console.error("Error in scrape-all:", error);
    res.status(500).json({ error: "Scraping failed" });
  }
});

// Endpoint pentru articole
app.get("/articles", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute("SELECT * FROM articles ORDER BY date DESC");
    connection.release();
    res.json({ data: rows });
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

// Crearea serverului pentru compatibilitate cu funcțiile serverless
const server = createServer(app);

export default (req, res) => {
  server.emit("request", req, res);
};
