import { reactify } from "../../lib";
import Runes from "./Runes.svelte";
import Legacy from "./Legacy.svelte";

export const rune = reactify(Runes, "onSvelteComponentConstruct");
export const legacy = reactify(Legacy, "onSvelteComponentConstruct");
export const nested = reactify(Runes, "params.onCreate");
