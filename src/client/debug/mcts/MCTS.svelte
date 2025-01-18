<script>
  export let metadata;

  import { Icon } from 'svelte-icons-pack';
  import { FaSolidCircleArrowDown } from 'svelte-icons-pack/fa';

  let nodes = [];
  let prevNodes = [];
  let preview = null;

  import Table from './Table.svelte';

  $: {
    prevNodes = [];
    nodes = [{ node: metadata }];
  }

  function SelectNode({ node, selectedIndex }, i) {
    preview = null;
    nodes[i].selectedIndex = selectedIndex;
    nodes = [...nodes.slice(0, i + 1), { node }];
  }

  function PreviewNode({ node }, i) {
    preview = node;
  }
</script>

<style>
.visualizer {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
}

.preview {
  opacity: 0.5;
}

.icon {
  color: #777;
  width: 32px;
  height: 32px;
  margin-bottom: 20px;
}
</style>

<div class="visualizer">
  {#each nodes as { node, selectedIndex }, i}
    {#if i !== 0}
    <div class="icon">
      <Icon src={FaSolidCircleArrowDown} />
    </div>
    {/if}

    <section>
      {#if i === nodes.length - 1}
        <Table on:select={e => SelectNode(e.detail, i)}
               on:preview={e => PreviewNode(e.detail, i)}
               root={node}/>
      {:else}
        <Table on:select={e => SelectNode(e.detail, i)}
          root={node}
          selectedIndex={selectedIndex}/>
      {/if}
    </section>
  {/each}

  {#if preview}
    <div class="icon">
      <Arrow/>
    </div>

    <section class="preview">
      <Table root={preview}/>
    </section>
  {/if}
</div>
