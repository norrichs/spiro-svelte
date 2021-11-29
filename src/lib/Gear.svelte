<script>
	export let gParams
	export let sParams
	export let gearRotation
	const {t, p} = gParams
	const {toothArcLength, toothSize} = sParams
	let r = toothArcLength * t / 2 / Math.PI
	let s = toothSize
	let dString;
	let padding = 100
	let width =  (r * 2) + s + padding;
	let height = width;
	let center = [width / 2, height / 2];
	let points = new Array(t * 2)
	
	points.fill(0)
	
	points = points.map((point, i)=>{
		let a = (i + 1) * (Math.PI / t)
		
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
	dString = `M${center[0]} ${center[1]-(r - s / 2)} ${lines.join()}`
</script>


	<svg  class="gear" width={width} height={height} style={"--gear-rotation: " + gearRotation + "deg;"}>
		<path class="outergear" d={dString}  stroke-linejoin="round"/>
		<!-- <circle cx={center[0]} cy={center[1]} r=2 fill="none" stroke="black" /> -->
		<circle cx={center[0]} cy={center[1] - r * p} r=2  stroke="black"/>
	</svg>


<style>
	.gear{

		margin-bottom: -3px;
		fill: rgba(40, 100, 50, 0.3);
		stroke:rgba(8, 87, 21, 0.3);
		stroke-width: 1px;
		transform-origin: center center;
		transform: rotate(var(--gear-rotation));
		/* transition: 200ms; */
		/* filter: drop-shadow( 15px 15px 10px rgba(0,0,0,1)); */
	}
	.gear:hover{
		fill: rgba(40, 100, 50, .7);
	}
	.outergear{
		/* stroke: none; */
		/* box-shadow: 0 0 100px 1px rgba(0,0,0,.3); */
	}
</style>

