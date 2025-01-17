<script lang="ts">
  let x = 0;

  export const add = (lhs: number) => {
    return lhs + x++;
  };
</script>

<div>
  <button on:click={() => console.log(add(3))}>Add {x}</button>
</div>
