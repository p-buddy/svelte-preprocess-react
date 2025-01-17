<script lang="ts">
  let x = $state(0);

  export const add = (lhs: number) => {
    return lhs + x++;
  };
</script>

<div>
  <button onclick={() => console.log(add(3))}>Add {x}</button>
</div>
