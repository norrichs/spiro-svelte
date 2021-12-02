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
	//			appd "drawing" point with postion of drawing_point and drawing_handle = drawing_point - tangent line * strength * fraction of section length
	
	
	// TODO force update of parameters on change

	
	
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

	import Ring from '../lib/Ring.svelte';
	import Gear from '../lib/Gear.svelte';
	import SpiroGraph from '../lib/SpiroGraph.svelte';
	import { onMount } from 'svelte';
	let rT = 60;
	let gT = 34;
	let radius = 300;
	let p = 0.7;
	let rim = 30;
	let toothArcLength = 2 * Math.PI * radius / rT;
	let toothSize =  Math.PI * radius / rT ;
	let width = 2 * (radius+rim) // * 2 + toothSize * 2;
	let height = 2 * (radius+rim) //radius * 2 + toothSize * 2;
	let center = [width / 2, height / 2];
	let gWidth, gHeight, gCenter, gRadius, rRadius
	let gRotOffset = 0 

	$: setParams(radius, rT, gT, rim, p)


	const setParams = (radius, rT, gT) => {
		// console.log('set params', rT,gT)
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
	let gDeltaRot = 0;
	let movingGear = false;
	let ringRect = null;

	const handleGearMousedown = () => {
		movingGear = true;
		console.log('ringRect', ringRect);
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
		<SpiroGraph {toothSize} {rT} {gT} {p} {radius} {ringA} {rim}/>
	</div>
	<div class="ring-container" 
		style={'--container-width:' + width + 'px;'} 
		use:setRingRect
	>
		<Ring {rT} {radius} {rim} />
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
	<div class="controls">
		<input type="checkbox" /><span>show gear</span> <br>
		<input type="range" bind:value={rT} min={gT} max=500/> rT {rT} <br>
		<input type="range" bind:value={gT} min=10 max={rT}/> gT {gT} <br>
		<input type="range" bind:value={radius} min=50 max=500/> radius {radius} <br>
		<input type="range" bind:value={rim} min=0 max=200/> rim {rim} <br>
		<button on:click={handleReset}>Re-set</button>
		<div class="readout">
			ringX, ringY ({parseInt(ringX)}, {parseInt(ringY)}) <br />
			gRot = {Math.round(gRot * 100) / 100} <br />
			ringA = {Math.round(ringA * 100) / 100} <br />
			gDeltaRot = {Math.round(gDeltaRot * 100) / 100} <br />
			newRingA = {Math.round(newRingA * 100) / 100} <br />
			ringDeltaA = {Math.round(ringDeltaA * 100) / 100}
		</div>
	</div>
</section>

<style>
	.test{
		width: 100px;
		height: 100px;
		background-color: red;
	}
	.test:hover{
		background-color: brown;
		cursor: none;
		transition: 2000ms;
	}
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
		background-color: rgba(0,100,0,0.2);
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
	.controls{
		position: absolute;
		bottom: 50%;
		left: -370px;
		box-shadow: 0 0 5px -1px black;
		width: calc(350px);
		border-radius:0.5em;
		padding: 0 1.5em;
		/* padding-left: 20px; */
		background-color: rgba(255,255,255,0.1);
		backdrop-filter: blur(0px);
		transition: 500ms;
	}
	.controls:hover{
		backdrop-filter: blur(10px);
		transform: translateX(380px);
		transition: backdrop-filter 1000ms ease-out 1s, transform 500ms;
	}
	.controls>input{
		width: 75%;
	}
	.readout{
		border-radius: 0.25em;
		font-size: 0.75em;
		padding:4px;
		margin: 8px;
		color:lightskyblue;
		background-color: black;
	}	
</style>
