<script>
	export let circleCount
	let r = 50;
	let a
	let params
	$: buildMandala(circleCount)

	function buildMandala(circleCount){	
		a = 2 * Math.PI / circleCount
		params = new Array(circleCount)
		params.fill([])
		params = params.map((c,i) => {
			return [
				r * Math.sin(a * i),
				r * Math.cos(a * i)
			]
		})}

</script>



	<svg viewbox={`${-r * 2} ${-2 * r} ${4 * r} ${4 * r}`} class="sac-geo" fill="none" stroke="black" stroke-width=.1 >
		
		{#each params as p,i}
			<circle cX={p[0]} cY={p[1]} r={r}/>
		{/each}

	</svg>



<style>
	.sac-geo{
		margin: 0 auto;
		fill: none;
		stroke: goldenrod;
		stroke-width: 0.01em;
		height: 100%;
		width: calc(100% * 3 / 2);
		/* background-color: blueviolet; */

	}

</style>