import dayjs from "dayjs";
import { createReadStream, createWriteStream } from "node:fs";
import { readFile } from "node:fs/promises";
import { Readable } from "node:stream";
import { pipeline } from "stream/promises";
import * as unzipper from "unzipper";
import { db } from "..";
import { ratesTable } from "../schema";

enum RatesCsvColumns {
  DATE = 0,
  USD = 1,
  JPY = 2,
  GBP = 8,
  AUD = 26,
  CAD = 28,
}

function getFloatValue(value: string): number {
  const parsed = parseFloat(value);

  if (isNaN(parsed)) {
    throw new Error("failed to parse value");
  }

  return parsed;
}

const tmpFilePath = "/tmp/histo-rate.zip";
const tmpFileExtract = "/tmp";

async function downloadRates() {
  const hash = dayjs().format("YYYYMMDD");
  const zipRes = await fetch(
    "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist.zip?" + hash
  );
  const writeStream = createWriteStream(tmpFilePath, { flags: "w" });

  if (zipRes.ok) {
    const nodeReadable = Readable.fromWeb(zipRes.body as any);

    await pipeline(nodeReadable, writeStream);

    await extractZip(tmpFilePath, tmpFileExtract);
  } else {
    throw new Error("failed download rates file: " + zipRes.statusText);
  }
}

async function extractZip(
  zipFilePath: string,
  outputDir: string
): Promise<void> {
  await createReadStream(zipFilePath)
    .pipe(unzipper.Extract({ path: outputDir }))
    .promise();
}

async function seedRates() {
  console.log("Downloading rates...");
  await downloadRates();

  console.log("Importing rates...");
  const ratesCsvRaw = await readFile(tmpFileExtract + "/eurofxref-hist.csv");
  const ratesHistoric = ratesCsvRaw.toString().split("\n").slice(1);
  const ratesInsertData = ratesHistoric
    .map((rh) => {
      const row = rh.split(",");
      if (row.length === 0) {
        return null;
      }

      try {
        const d = dayjs(row[RatesCsvColumns.DATE], "YYYY-MM-DD").toDate();
        return {
          date: d,
          usd: getFloatValue(row[RatesCsvColumns.USD]),
          jpy: getFloatValue(row[RatesCsvColumns.JPY]),
          gbp: getFloatValue(row[RatesCsvColumns.GBP]),
          aud: getFloatValue(row[RatesCsvColumns.AUD]),
          cad: getFloatValue(row[RatesCsvColumns.CAD]),
        } as typeof ratesTable.$inferInsert;
      } catch (error) {
        console.error("oops", rh);
        return null;
      }
    })
    .filter((r) => !!r);

  await db.delete(ratesTable).all();
  console.log("Inserting: " + ratesInsertData.length + " historic rates");

  let grouped: typeof ratesInsertData = [];
  let count = 0;
  while (ratesInsertData.length > 0) {
    const data = ratesInsertData.pop();
    if (data) {
      grouped.push(data);
      count++;
    }

    if (count >= 100) {
      await db.insert(ratesTable).values(grouped);
      grouped = [];
      count = 0;
    }
  }
  await db.insert(ratesTable).values(grouped);
}

seedRates();
