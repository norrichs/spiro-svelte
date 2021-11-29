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
	<path  d={dString} fill="none" stroke-linejoin="round"/>
	<circle cx={center[0]} cy={center[1]} r=4 fill="none" stroke="black"/>
</svg>


<style>
	svg{
		margin: 0;
	}
	.ring{
		background-color: transparent;
		margin-bottom: -3px;
		position: relative;
		/* fill: none; */
		stroke: black;
		stroke-width: 1;
		stroke-linejoin: "round";
	}


</style>