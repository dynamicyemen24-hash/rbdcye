import { ar } from "./ar";
import { en } from "./en";
import type { Locale } from "../types";
import type { Dictionary } from "./ar";

export const dictionaries: Record<Locale, Dictionary> = { ar, en };

export type { Dictionary } from "./ar";
