<script>
	export let rParams
	export let sParams

	console.log('ring params', rParams, sParams)

	const {radius, toothArcLength, toothSize} = sParams;
	const {t} = rParams;
	let r = t * toothArcLength / Math.PI / 2
	let s = toothSize;
	let width = r * 2 + s*2
	let height = r * 2 + s*2
	let center = [width / 2, height / 2];
	let points = new Array(t * 2 + 1)
	points.fill(0)
	points = points.map((point, i) => {
		let a = (i+1) * (Math.PI / t)
		return i % 2 === 0
			? [
				center[0] + (r + s / 2) * Math.sin(a),
				center[1] - (r + s / 2) * Math.cos(a)
			]
			: [
				center[0] + (r - s / 2) * Math.sin(a),
				center[1] - (r - s / 2) * Math.cos(a)
			]
	})
	let lines = points.map((point) => {
		return `L${point[0]} ${point[1]}`
	})

	let dString = `M${center[0]} ${center[1] - (r - s / 2)} ${lines.join(' ')}`


</script>

<svg class="ring" width={width} height={height}>
	<!-- <circle cX={center[0]} cY={center[1]} r={center[1] } fill="blue" fill-rule="evenodd" /> -->
	<path  d={dString + "m-12.5 -24 a1 1 0 0 0 0 " + (r * 2 + 60) + " a1 1 0 0 0 0 -" + (r * 2 + 60)}  stroke-linejoin="round">
	</path>
	<path d={`M${center[0]-10} ${center[1]} L${center[0]+10} ${center[1]} M${center[0]} ${center[1]-10} L${center[0]} ${center[1]+10} `} stroke-width=".5"/>
</svg>


<style>
	svg{
		margin: 0;
	}
	.ring{
		margin-bottom: -3px;
		position: relative;
		fill: rgba(200,200,150,0.5);
		
		stroke: rgba(200,200,150,0.8);
		stroke-width: 2;
		stroke-linejoin: "round";
		overflow: visible;

	}


</style>