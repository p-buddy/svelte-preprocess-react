<script lang="ts" context="module">
  import type { Component, SvelteComponent, mount } from "svelte";

  type Exports<
    T extends Component | SvelteComponent | ReturnType<typeof mount>,
  > =
    T extends Component<infer _, infer E>
      ? E
      : T extends SvelteComponent<infer E>
        ? E
        : T extends ReturnType<typeof mount>
          ? T
          : never;
</script>

<script lang="ts">
  import type Runes from "./Runes.svelte";
  import type Legacy from "./Legacy.svelte";
  import { rune, legacy } from "./";
  import { sveltify } from "../../lib";

  const react = sveltify({ rune, legacy });

  let r: Runes;
  let l: Exports<Legacy>;
</script>

<react.legacy
  onSvelteComponentConstruct={(x) => {
    l = x;
    console.log("hi");
  }}
/>

<react.rune
  onSvelteComponentConstruct={(x) => {
    r = x;
    console.log("hi");
  }}
/>

<button onclick={() => r.add(3)}>Add runes</button>
<button onclick={() => l.add?.(3)}>Add legacy</button>
