import { reactify } from "../../lib";
import Runes from "./Runes.svelte";
import Legacy from "./Legacy.svelte";

export const rune = reactify(Runes);
export const legacy = reactify(Legacy);
