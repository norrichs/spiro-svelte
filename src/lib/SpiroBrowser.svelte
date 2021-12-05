<script>
	import {spiroCollection} from '../lib/stores.js'
</script>


<!-- <div class="browser-container"> -->
	{#if $spiroCollection.length > 0}
		{#each $spiroCollection as spiro}
			<!-- <div class="spiro-card"> -->
				<div class="browser-spiro-container">
					<svg class="browser-spiro" fill="none" stroke="black" stroke-width="2">
						<path d={spiro.path} />
					</svg>
				</div>
			<!-- </div> -->
		{/each}
	{/if}
<!-- </div> -->

<style>
	/* .browser-container{
		position: absolute;
		top: 0;
		display: flex;
		flex-direction: row;
		background-color: burlywood;
		width: 80vw;
		height: 200px;
	} */
	/* .spiro-card{
		width: 190px;
		height: 190px;
		border: 1px solid black;
		padding: 0;
		display: grid;
		place-items: center;
		
	} */
	.browser-spiro-container{
		background-color: magenta;
		/* height: 100%; */
		/* width: 190px;
		height: 190px; */
		/* transform: scale(0.2); */
	}
	.browser-spiro{
		/* width: 100%;
		height: 100%; */
		/* width: 660px;
		height: 660px; */
		/* border-radius: 50%; */
		/* fill: none;
		stroke: darkblue;
		stroke-width: 10;
		transform-origin: top left;
		transform: scale(0.3);
		background-color: cornsilk;
		margin: 0;
		overflow: visible; */
	}

</style>