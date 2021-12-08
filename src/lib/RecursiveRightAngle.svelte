<script>
	export let depth

	let r0 = 59
	let params = [{
		r: r0,
		b: Math.sqrt(0.75) * r0
	}]

	for(let i = 1; i < depth; i++){
		params[i] = {
			r: 2 / 3 * params[i-1].b,
			b: Math.sqrt(0.75) * 2 / 3 * params[i-1].b
		}
	}


	
	// 					L${p.b * ((i + 1) % 2)} ${p.b * ((i) % 2)} 
	// 				  	L${3 / 2 * p.r * ((i + 1) % 2)} ${3 / 2 * p.r * ((i) % 2)} 
	// 				 	L${-p.b * ((i + 1) % 2)} ${-p.b * ((i) % 2)} 
	// 					L${p.b * ((i + 1) % 2)} {p.b * ((i) % 2)}
	
	

</script>



	<svg viewbox={`${-r0 * 3 / 2} ${-r0 * 2.1 / 2} ${r0 * 3} ${r0 * 2.1}`} class="sac-geo" fill="none" stroke="black" stroke-width=.1 >
		{#each params as p,i}
			<circle cX={ -p.r / 2 * ((i + 1) % 2) } cY={ -p.r / 2 * (i % 2) } r={p.r} />
			<circle cX={ p.r / 2 * ((i + 1) % 2) } cY={ p.r / 2 * (i % 2) } r={p.r} />
			<path d={`M${-p.b * (i % 2)} ${-p.b * ((i + 1) % 2)} 
			          L${-3 / 2 * p.r * ((i + 1) % 2)} ${-3 / 2 * p.r * ((i) % 2)} 
					  L${p.b * (i % 2)} ${p.b * ((i + 1) % 2)} 
					  L${3 / 2 * p.r * ((i + 1) % 2)} ${3 / 2 * p.r * ((i) % 2)} 
					  L${-p.b * (i % 2)} ${-p.b * ((i + 1) % 2)} 
					  L${p.b * (i % 2)} ${p.b * ((i + 1) % 2)}
					  `} />
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