<script>
	// Props
	export let gT
	export let rT
	export let p
	export let radius
	export let gRot

	let r, s, dString, width, height, center, points, lines

	let padding = 100
	let gearHidden = false;
	$: setGear(gT, radius, rT)
	
	const setGear = (gT, radius, rT) => {	
		console.log('setGear', gT)
		r = radius * gT / rT
		s = Math.PI * radius / rT
		width =  (r * 2)//+ s + padding;
		height = width;
		center = [width / 2, height / 2];
		
		
		points = new Array(gT * 2)
		points.fill(0)
		points = points.map((point, i)=>{
			let a = (i + 1) * (Math.PI / gT)
			
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
		dString = `M${center[0]} ${center[1]-(r - s / 2)} ${lines.join()}`
	}
</script>


<svg  class="gear" class:hidden={gearHidden} width={width} height={height} style={"--gear-rotation: " + gRot + "deg;"}>
	<!-- <circle cx={center[0]} cy={center[1]} r=2 fill="none" stroke="black" /> -->
	<circle class="pen"cx={center[0]} cy={center[1] - r * p} r=6  stroke="black"/>
	<path class="center-cross" d={`M${center[0]-10} ${center[1]} L${center[0]+10} ${center[1]} M${center[0]} ${center[1]-10} L${center[0]} ${center[1]+10} `} stroke-width="1"/>
	<path class="innergear" d={dString}  stroke-linejoin="round"/>
</svg>


<style>
	.gear{
		/* background-color: rgba(35,100,120,0.2); */
		
		margin: 0;
		fill: rgba(40, 100, 50, 0.3);
		stroke:rgba(8, 87, 21, 0.3);
		stroke-width: 1px;
		transform-origin: center center;
		transform: rotate(var(--gear-rotation));
		/* transition: 200ms; */
		/* filter: drop-shadow( 15px 15px 10px rgba(0,0,0,1)); */
		/* background-color: rgba(50,0,200,0.1); */
		overflow: visible;
	}
	.innergear:hover{
		fill: rgba(40, 100, 50, .7);
		cursor: crosshair;
	}
	.gear:hover circle{
		fill: rgba(255, 0, 0, 0.3);
	}


</style>

