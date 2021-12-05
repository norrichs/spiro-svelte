<script>

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
	//			appd "drawing" point with postion of drawing_point and drawing_handle = drawing_point - tangent line * strength * fraction of section length
	
	
	// TODO force update of parameters on change

	
	
	import { browser, dev } from '$app/env';
	// export const hydrate = dev;
	export const router = browser;
	// export const prerender = false;

	import {spiroCollection} from '../lib/stores.js'
	import Ring from '../lib/Ring.svelte';
	import Gear from '../lib/Gear.svelte';
	import SpiroGraph from '../lib/SpiroGraph.svelte';
	import ControlPanel from '../lib/ControlPanel.svelte'
	import SpiroBrowser from '../lib/SpiroBrowser.svelte'

	let rT = 100;
	let gT = 51;
	let radius = 200;
	let pen = 7;
	let p = pen / 10
	let rim = 30;
	let toothArcLength = 2 * Math.PI * radius / rT;
	let toothSize =  Math.PI * radius / rT ;
	let width = 2 * (radius+rim) // * 2 + toothSize * 2;
	let height = 2 * (radius+rim) //radius * 2 + toothSize * 2;
	let center = [width / 2, height / 2];
	let gWidth, gHeight, gCenter, gRadius, rRadius
	let gRotOffset = 0 
	let readouts = {}

	$: setParams(radius, rT, gT, rim, pen)


	const setParams = (radius, rT, gT, rim, pen) => {
		// console.log('set params', rT,gT)
		
		p = pen / 10
		gWidth = 2 * radius * gT/rT
		gHeight = gWidth
		gCenter = [gWidth / 2, gHeight / 2]
		gRadius = radius * gT / rT;
		rRadius = radius;
		gRotOffset = ((rT - gT) % 2) * 360 / gT / 2
		gRot = (ringA * rT) / gT - ringA + gRotOffset;
		gX = (rRadius - gRadius) * Math.sin(ringA / r2d);
		gY = (rRadius - gRadius) * Math.cos(ringA / r2d);
		// console.log('gRadius, rRadius',gRadius, rRadius)
		ringA = 0;
		readouts.ringA = ringA
		readouts.gX = gX
		readouts.gY = gY
		readouts.gRot = gRot
	}

	const r2d = 180 / Math.PI;
	let gRot = 0;
	let gAngle = 0.0; // radians

	let gX; 
	let gY; 
	let ringX, ringY;
	let ringA = 0;
	let newRingA = 0;
	let ringDeltaA = 0;
	let movingGear = false;
	let ringRect = null;
	const handleGearMousedown = () => {
		movingGear = true;
	};

	const handleGearMousemove = (ev) => {
		// console.log('ring mousemove', ev)
		if (movingGear) {
			ringX = ev.clientX - ringRect.x - center[0];
			ringY = ev.clientY - ringRect.y - center[1];
			// TODO normalize with modulo
			if (ringY >= 0) {
				newRingA = Math.atan(ringX / ringY) * r2d;
			} else if (ringY < 0) {
				newRingA = 180 + Math.atan(ringX / ringY) * r2d;
			}
			ringDeltaA = ((newRingA + 360) % 360) - (((ringA % 360) + 360) % 360);
			if (ringDeltaA > 350) {
				ringDeltaA = ringDeltaA - 360;
			} else if (ringDeltaA < -350) {
				ringDeltaA = ringDeltaA + 360;
			}

			ringA += ringDeltaA;

			gRot = (ringA * rT) / gT - ringA;
			gX = (rRadius - gRadius) * Math.sin(ringA / r2d);
			gY = (rRadius - gRadius) * Math.cos(ringA / r2d);
			// console.log('g, r', gRadius, rRadius, gX, gY)
			
		}
	};

	const handleReset=()=>{
		rT = rT
		gT = gT
		radius = radius
		p = p

	}
	const setRingRect = () => {
		// movingGear = true
		ringRect = document.querySelector('.ring').getBoundingClientRect();
		gX = (rRadius - gRadius) * Math.sin(gAngle / r2d); 
		gY = (rRadius - gRadius) * Math.cos(gAngle / r2d); 
	};
</script>

<svelte:head>
	<title>Spiro</title>
</svelte:head>

<section class="spiro" style={ 'width: '+(2 * (radius + rim))+'px; height: '+(2 * (radius + rim)) + 'px;'}>
	<div class="graph-container">
		<SpiroGraph {rT} {gT} {p} {radius} {ringA} {rim}/>
	</div>
	<div class="ring-container" 
		style={'--container-width:' + width + 'px;'} 
		use:setRingRect
	>
		<Ring {rT} {radius} {rim} {setRingRect}/>
	</div>

	<div class="gear-container"
		style={	'transform: translateX('+ (radius + rim - gCenter[0] + gX) + 'px) translateY(' + (radius+rim - gCenter[1] + gY) + 'px);'}
		on:mousemove={(ev) => handleGearMousemove(ev)}
		on:mousedown={(ev) => {
			handleGearMousedown(ev);
		}}
		on:mouseup={(ev) => {
			movingGear = false;
		}}
		use:setRingRect
	>
		<Gear {gT} {rT} {p} {radius} {gRot} />
	</div>
</section>
<section>
	<ControlPanel bind:rT={rT} bind:gT={gT} bind:radius={radius} bind:rim={rim} bind:pen={pen} {readouts} />
</section>


<style>

	section.spiro {
		/* background-color: rgba(0,100,200,0.3); */
		/* border: 10px solid black; */
		/* width: var(--container-width); */
		margin:0 0 0 50px;;
		padding: 0;
		position: relative;
	}
	.graph-container {
		transform-origin: center center;
		position: absolute;
		top: 0;
		left: 0;
		/* background-color: rgba(0,100,0,1); */
		/* transform: translate( 24px, 24px); */
	}
	.ring-container {
		/* position: absolute; */
		/* top: 50%;
		left: 50%; */
		/* box-sizing: border-box; */
		/* background-color: rgba(255,0,0,0.1);  */
		width: var(--container-width);
		padding: 0;
	}
	.gear-container {
		position: absolute;
		transform-origin: center center;
		top: 0;
		left: 0;
		/* border-radius: 50%; */
		/* background-color: rgba(168, 123, 7, 0.336); */
		box-sizing: border-box;
		padding: 0;
		/* overflow: hidden; */
		overflow: visible;
	}



</style>
