<script>
	export let rT
	export let radius
	export let rim

	console.log('ring teeth', rT)
	let points, lines, dString, r, s, width, height, center
	let rW = 12.5
	$: setRing(rT, rim, radius)
	
	const setRing = (rT, rim, radius) => {
		console.log('run setRing')
		r = radius
		s = Math.PI * r / rT;
		width = r * 2 + rim * 2
		height = r * 2 + rim * 2
		
		console.log('ring width', width / 2)
		center = [width / 2, height / 2];
		points = new Array(rT  * 2 + 1)
		points.fill(0)
		points = points.map((point, i) => {
			let a = (i+1) * (Math.PI / rT )
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
		lines = points.map((point) => {
				return `L${point[0]} ${point[1]}`
			})
		dString = `M${points[0][0]} ${points[0][1]} ${lines.join(' ')}`
	}

</script>

<svg class="ring" width={width} height={height}>
	<path  d={dString + "M"+(center[0])+" "+(center[1]-r - rim)+" a1 1 0 0 0 0 " + (r * 2 + rim * 2) + " a1 1 0 0 0 0 -" + (r * 2 + rim * 2)}  stroke-linejoin="round" />
	<path d={`M${center[0]-10} ${center[1]} 
			  L${center[0]+10} ${center[1]} 
			  M${center[0]} ${center[1]-10} 
			  L${center[0]} ${center[1]+10} `} stroke="black" stroke-width=".5"/>
</svg>



<style>
	.ring{
		/* position: absolute;
		top: 0;
		left: 0;
		 */
		margin: 0;
		margin-bottom: -3px;
		/* position: relative; */
		fill: rgba(200,200,150,0.5);
		stroke: rgba(200,200,150,0.5);
		stroke-width: 1;
		stroke-linejoin: "round";
		/* background-color: blue; */
		border-radius: 50%;
		/* overflow: visible; */
	}


</style>