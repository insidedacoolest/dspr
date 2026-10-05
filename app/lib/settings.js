import "server-only";
import { prisma } from "./db";
import { SETTING_DEFAULTS } from "./content";

export { SETTING_DEFAULTS };

export async function getSettings() {
  const rows = await prisma.setting.findMany();
  const values = { ...SETTING_DEFAULTS };
  for (const r of rows) values[r.key] = r.value;
  return values;
}
