<script>

	//TODO - use a computed relative measurement of mouse location rather than offsetX and shift
	//		 gear forward so that :hover works
	
	// Spiro line algorithm
	//		Calculate array of points for single period gRot 0 -> gRot 360
	//		
	//		Map points -> {point: [x,y], handle0: [x,y], handle1: [x,y]}
	//			point = point
	//			handle0 = point - tangent line * strength
	//			handle1 = point + tangent line * strength
	//
	//		Make rotated copies of the prototype period (go back to old spiro to find how to calculate periods)
	//		
	//		Drawing algo:
	//			calculate which section gear currently is in (n)
	//			display 0 -> n-1
	//			append "drawing" point with postion of drawing_point and drawing_handle = drawing_point - tangent line * strength * fraction of section length 
	import { browser, dev } from '$app/env';

	// we don't need any JS on this page, though we'll load
	// it in dev so that we get hot module replacement...
	export const hydrate = dev;

	// ...but if the client-side router is already loaded
	// (i.e. we came here from elsewhere in the app), use it
	export const router = browser;

	// since there's no dynamic data here, we can prerender
	// it so that it gets served as a static asset in prod
	export const prerender = false;
  
	import Ring from '../lib/Ring.svelte'
	import Gear from '../lib/Gear.svelte'
	import SpiroGraph from '../lib/SpiroGraph.svelte'
import { onMount } from 'svelte';
	let ringTeeth = 300;
	let gearTeeth = 148;
	let radius = 500;
	let pen = 0.7;
	let circumference = 2 * Math.PI * radius;
	let toothArcLength = circumference / ringTeeth
	let toothSize = toothArcLength / 2
	let width = radius * 2 + toothSize*2;
	let height = radius * 2 + toothSize*2;
	let center = [width / 2, height / 2]
	let pointArray = [[1,1], [10,10],[10,25]]
	
	let gParams = {
		t: gearTeeth,
		p: pen
	}
	let rParams = {
		t: ringTeeth
	}
	
	let sParams = {
		radius: radius,
		toothArcLength: toothArcLength,
		toothSize: toothSize
	}

	const r2d = 180 / Math.PI
	let gRot = 0;
	let gAngle = .0; // radians
	let gRadius = gearTeeth * toothArcLength / Math.PI / 2
	let rRadius = ringTeeth * toothArcLength / Math.PI / 2
	let gCenter = [gRadius + toothSize / 2, gRadius + toothSize / 2]
	
	let gX //= (rRadius - gRadius) * Math.sin(gAngle / r2d) + ringRect.y
	let gY //= (rRadius - gRadius) * Math.cos(gAngle / r2d) + ringRect.x
	let ringX, ringY
	let ringA = 0;
	let newRingA = 0;
	let ringDeltaA = 0;
	let gDeltaRot = 0;
	let movingGear = false;
	let ringRect = null;
	
	const handleGearMousedown = () => {
		movingGear = true
		console.log('ringRect',ringRect)
		

	}
	const calcSpiro = (rT, gT, r, p) => {
		const center = [r,r]
		let spiro = []
		const gRad = r * gT / rT * p
		const rRad = r - gRad
		const d2r = Math.PI / 180
		let rA = 0;
		let gA = 0;
		
		let i = 0;
		const step = 1;
		let gX, gY, pX, pY


		while(i < 10000){
			rA = i * step;
			gA = (rA) * gT / rT ;

			// gX = center[0] + rRad * Math.sin(rA * d2r) 
			// gY = center[1] + rRad * Math.cos(rA * d2r) 
			spiro[i]=[
				center[0] + rRad * Math.sin(rA * d2r) + gRad * Math.sin(gA * d2r)*pen,
				center[1] + rRad * Math.cos(rA * d2r) + gRad * Math.cos(gA * d2r)*pen
			]
			i++
		}
		console.log('spiro size ',i)
		return spiro

	}

	// const spiro = calcSpiro(ringTeeth, gearTeeth, radius, pen)

	const handleGearMousemove = ev => {
		// console.log('ring mousemove', ev)
		if(movingGear){
			ringX = ev.clientX - ringRect.x - center[0]
			ringY = ev.clientY - ringRect.y - center[1]
			// TODO normalize with modulo
			if(ringY >= 0){
				newRingA = Math.atan(ringX / ringY) * r2d
			}else if(ringY < 0){
				newRingA = 180 + Math.atan(ringX / ringY) * r2d
			}
			ringDeltaA = ((newRingA + 360) % 360) - (((ringA % 360) + 360) % 360)
			if(ringDeltaA > 350){
				ringDeltaA = ringDeltaA - 360
			}else if(ringDeltaA < -350){
				ringDeltaA = ringDeltaA + 360
			}

			ringA += ringDeltaA
			
			gRot = ringA * ringTeeth / gearTeeth - ringA
			gX = (rRadius - gRadius) * Math.sin(ringA / r2d)  + ringRect.x - 50
			gY = (rRadius - gRadius) * Math.cos(ringA / r2d) + ringRect.y - 50
			// drawSpiroPoint(gX, gY, gRot, radius * gearTeeth / ringTeeth * pen)
		}
	}
	// const drawSpiroPoint = (x, y, a, r) => {
	// 	// console.log('draw', x, y, a, r)
	// 	pointArray.push([
	// 		x + r * Math.sin(a),
	// 		y + r * Math.sin(a)
	// 	])
	// 	pointArray = pointArray
	// 	console.log(pointArray)
	// }
	const setRingRect = () => {
		// movingGear = true
		ringRect = document.querySelector('.ring').getBoundingClientRect()
		gX = (rRadius - gRadius) * Math.sin(gAngle / r2d) //+ ringRect.y
		gY = (rRadius - gRadius) * Math.cos(gAngle / r2d) //+ ringRect.x
	}


	

</script>

<svelte:head>
	<title>Spiro</title>
</svelte:head>
<section class="spiro">
	<div class="graph-container"
	>
		<SpiroGraph  {rParams} {gParams} {sParams} {ringA}/>
	</div>
	<div 
	class="ring-container" 
	style={"--container-width:" + width + "px;"}
	use:setRingRect
	>
	<Ring {sParams} {rParams}/>
</div>
	
<div 
class="gear-container"
		style={	"left: " + (center[0] - gCenter[0]) + "px; top: " + (center[1] - gCenter[1]) + "px;"+
				"transform: translateX(" + gX + "px) translateY(" + gY + "px);"}
		on:mousemove={ev => handleGearMousemove(ev)}
		on:mousedown={ev => {handleGearMousedown(ev)}}
		on:mouseup={ev => {movingGear = false}}
		>
		<Gear {sParams} {gParams} gearRotation={gRot}/>
	</div>
</section>
<section>
	<!-- <div>rX: {parseInt(rX)} rY: {parseInt(rY)}</div>
	<div>gX: {parseInt(gX)} gY: {parseInt(gY)}</div>
	<div>gAngle: {parseInt(gAngle * 180 / Math.PI)}</div>
	<div>ring -> ( {parseInt(ringX)}, {parseInt(ringY)})  a={parseInt(ringA * 180 / Math.PI)} radius={parseInt(mouseRadius)}</div> -->
	<div>	
		ringX, ringY ({parseInt(ringX)}, {parseInt(ringY)}) <br>
		gRot       = { Math.round(gRot * 100)/100} <br>
		ringA      = { Math.round(ringA * 100)/100} <br>
		gDeltaRot  = { Math.round(gDeltaRot * 100)/100} <br>
		newRingA   = { Math.round(newRingA * 100)/100} <br>
		
		ringDeltaA = { Math.round(ringDeltaA * 100)/100}
	</div>
	<!-- {#each deltas as delta}
		<div>{parseInt(delta * 100)/100}</div>
	{/each} -->
</section >

<style>
	.spiro {
		/* background-color: blueviolet; */
		width:var(--container-width);
		margin: 0 auto 0 0;
	}
	.graph-container{
		transform-origin: center center;
		transform: translate( 24px, 24px);
	}
	.ring-container{
		position: relative;
		box-sizing: border-box;
		/* background-image: url('../lib/images/pond_chapel.png'); */
		width: var(--container-width);
		padding: 0;
	}
	.gear-container{
		position: absolute;
		transform-origin: center center;
		border-radius: 50%;
		/* background-color: darkgoldenrod; */
		box-sizing: border-box;
		padding: 0;
		/* overflow: hidden; */
		overflow: visible;
	}


</style>
