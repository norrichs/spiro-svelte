<script>
	export let rT;
	export let gT;
	export let radius;
	export let rim;
	export let pen;
	// export let handleReset;
	export let readouts;

	console.log('readouts', Object.entries(readouts))
	let lockedVisible = false
</script>

<div class="controls" class:lockedVisible>
	<label for="keep-visible">Keep Visible<input type="checkbox" bind:checked={lockedVisible} name="keep-visible"/></label>{lockedVisible} <br />
	<input type="range" bind:value={rT} min={gT} max="500" />
	<input type="number" bind:value={rT} /> rT <br />
	<input type="range" bind:value={gT} min="10" max={rT} /> gT {gT} <br />
	<input type="range" bind:value={radius} min="50" max="500" /> radius {radius} <br />
	<input type="range" bind:value={rim} min="0" max="200" /> rim {rim} <br />
	<input type="range" bind:value={pen} min="0" max="10" /> pen {pen} <br />
	<!-- <button on:click={handleReset}>Re-set</button> -->
	<div class="readout">
			{#each Object.entries(readouts) as [label, data] }
				<div>{label}</div><div>{data}</div>
			{/each}
	</div>
</div>

<style>
	.controls input[type='number'] {
		width: 50px;
	}
	.controls {
		position: absolute;
		bottom: 50%;
		left: -370px;
		box-shadow: 0 0 5px -1px black;
		width: calc(350px);
		border-radius: 0.5em;
		padding: 0 1.5em;
		/* padding-left: 20px; */
		background-color: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(0px);
		transition: transform 500ms;
	}
	.lockedVisible{
		bottom: 50px;
		backdrop-filter: blur(10px);
		transform: translateX(380px);
		transition: bottom 2s, backdrop-filter 1000ms ease-out 1s, transform 500ms;
	}
	.controls:hover.lockedVisible{bottom: 50px}
	.controls:hover {
		bottom: 50%;
		backdrop-filter: blur(10px);
		transform: translateX(380px);
		transition: backdrop-filter 1000ms ease-out 1s, transform 500ms;
	}
	.controls > input {
		width: 75%;
	}
	.readout{
		border-radius: 0.25em;
		font-size: 0.75em;
		padding:4px;
		margin: 8px;
		color:lightskyblue;
		background-color: black;
		display: grid;
		grid-template-columns: 1fr 1fr;
	}
	
</style>
