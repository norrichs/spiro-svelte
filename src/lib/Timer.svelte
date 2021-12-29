<script>
import { RA0 } from 'pdfmake/src/standardPageSizes';

	import { tick } from 'svelte';
import { invalid_attribute_name_character } from 'svelte/internal';

	let timerTime = 0.1;
	const minorTick = [2, 20];
	const majorTick = [4, 50];
	const r = 150;
	const sweepOverRadius = 10;
	const numeralOffset = 40;
	let ticks = new Array(60);
	ticks.fill(0);
	ticks = ticks.map((tick, i) => {
		return {
			angle: -(Math.PI / 30) * i + Math.PI,
			width: i % 5 === 0 ? majorTick[0] : minorTick[0],
			length: i % 5 === 0 ? majorTick[1] : minorTick[1]
		};
	});
	ticks = ticks.map((tick, i) => {
		return {
			...tick,
			outer: [r * Math.cos(tick.angle), r * Math.sin(tick.angle)],
			inner: [(r - tick.length) * Math.cos(tick.angle), (r - tick.length) * Math.sin(tick.angle)]
		};
	});	
	const redSweepStart = (time) => {
		const t = time <= 15 ? time : 15
		const startAngle =  Math.PI * 2 * (59 / 60) - Math.PI / 2
		const angle = Math.PI * 2 * (t / 60) - Math.PI / 2
		return `M0 0 L${(r+sweepOverRadius)*Math.cos(startAngle)} ${(r+sweepOverRadius)*Math.sin(startAngle)} A${r + sweepOverRadius} ${r+sweepOverRadius} 0 0 1 ${(r+sweepOverRadius)*Math.cos(angle)} ${(r+sweepOverRadius)*Math.sin(angle)}`
	}
	const redSweep = (time) => {
		const t = time > 15 ? time : 15
		const startAngle =  Math.PI * 2 * (15 / 60) - Math.PI / 2
		const angle = Math.PI * 2 * (t / 60) - Math.PI / 2
		return `M0 0 L${(r+sweepOverRadius)*Math.cos(startAngle)} ${(r+sweepOverRadius)*Math.sin(startAngle)} A${r + sweepOverRadius} ${r+sweepOverRadius} 1 ${t<45 ? 0 : 1} ${t<45 ? 1 : 1} ${(r+sweepOverRadius)*Math.cos(angle)} ${(r+sweepOverRadius)*Math.sin(angle)}`
	}

	const getKnob = (radius, time) => {
		// console.log('get knob.  time=', time)
		const gT = 60
		const r = radius * 2 / 5		
		const s = Math.PI * r / gT
		const width =  (r * 2)//+ s + padding;
		const height = width;
		const center = [0, 0];
		
		
		let points = new Array(gT * 2)
		points.fill(0)
		points = points.map((point, i)=>{
			let a = Math.PI * time / 30 + (i + 1) * (Math.PI / gT)
			
			return i % 2 === 0
				? [
						0 + (r + s / 2) * Math.sin(a),
						0 - (r + s / 2) * Math.cos(a)
					]
				: [
						0 + (r - s / 2) * Math.sin(a),
						0 - (r - s / 2) * Math.cos(a)
					]
		})
		
		const lines = points.map((point) => {
			return `L${point[0]} ${point[1]}`
		})
		return `M${points[0][0]} ${points[0][1]} ${lines.join()}`
	}
	let countDown;
	const countDownTimer = () => {
		countDown = setInterval(()=>{
			if(timerTime > 0){
				timerTime = timerTime - 1/120
			}
		}, 500)
	}


	var changeTimer;
	const smoothChange = (sign) => {
		console.log('timer time', timerTime)
		if(timerTime <= 60 && timerTime >= 0){
			console.log('in conditional')
			changeTimer = setInterval((sign)=>{
				if(timerTime <= 60 && timerTime >= 0){
					timerTime = timerTime + sign / 5
				}else{
					clearInterval(changeTimer)
				}
			}, 20, sign)
		}else{
			console.log('clear')
			clearInterval(changeTimer)
		}
		console.log('other')
	}


	console.log('ticks list', ticks);
</script>

<div class="timer-container">
	<svg 
		viewbox={`-${(r * 3) / 2} -${(r * 3) / 2} ${r * 3} ${r * 3}`} 
		width={r*3}
		height={r*3}
		class="timer">
		<defs>
			<marker id="arrowhead" markerWidth="10" markerHeight="4" refX="0" refY="2" orient="auto">
				<polygon points="0 0, 5 2, 0 4"  stroke="none" class="arrowhead"/>
			</marker>
		</defs>
		<path 
			d={redSweepStart(timerTime)} 
			class="sweep1" 
		/>
		<path
			d={`M-3 0 L-3 -${r+1} L-15 -${r+1} L-15 -${r+50} L-50 -${r+50}` }
			class="shadow-layer"
		/>
		<path
			d={`M-3 0 L-3 -${r+1} L-15 -${r+1} L-15 -${r+70} L-100 -${r+70} L-100 0 L-3 0` }
			class="face-layer"
		/>

		<path
			d={`M-3 0 L-3 -${r+1} L-15 -${r+1} L-15 -${r+70}` }
			fill="none"
			stroke="black"
		/>
		<path 
			d={redSweep(timerTime)} 
			class="sweep" 
			
		/>
		<path d={getKnob(r, timerTime)} class="knob"/>



		<path d={`M0 ${-r * 1.9 / 5} A${r * 1.9 / 5} ${r * 1.9 / 5} 0 0 1 0 ${r * 1.9 / 5}` } 
			class="knob-control"
			on:mousedown={()=>{smoothChange(1)}}
			on:mouseup={clearInterval(changeTimer)}
		/>
		<path d={`M0 ${-r * 1.9 / 5} A${r * 1.9 / 5} ${r * 1.9 / 5} 0 0 0 0 ${r * 1.9 / 5}` } 
			class="knob-control"
			on:mousedown={()=>{smoothChange(-1)}}
			on:mouseup={clearInterval(changeTimer)}
		/>
		<path 
			d={`M${r*0.25*Math.cos(-Math.PI*2/6)} ${r*0.25*Math.sin(-Math.PI*2/6)} A${r*0.25} ${r*0.25} 0 0 1 ${r*0.25*Math.cos(0)} ${r*0.25*Math.sin(0)}`}
			marker-end="url(#arrowhead)"
			class='knob-control arrow'
		/>
		<path 
			d={`M${r*0.25*Math.cos(-Math.PI*4/6)} ${r*0.25*Math.sin(-Math.PI*4/6)} A${r*0.25} ${r*0.25} 0 0 0 ${r*0.25*Math.cos(Math.PI)*6/6} ${r*0.25*Math.sin(Math.PI*6/6)}`}
			marker-end="url(#arrowhead)"
			class='knob-control arrow'
		/>

		{#each ticks as tick}
			<path
				d={`M${tick.outer[0]} ${tick.outer[1]} L${tick.inner[0]} ${tick.inner[1]}`}
				stroke-width={tick.width}
				class="ticks"
			/>
		{/each}
		<!-- {#each ticks.filter((t, i) => i % 5 === 0) as tick, num}
			<circle
				cx={(r + numeralOffset) * Math.cos(tick.angle)}
				cy={(r + numeralOffset) * Math.sin(tick.angle)}
				r="10"
				fill="none"
				stroke="red"
			/>
		{/each} -->
	</svg>

	{#each ticks.filter((t, i) => i % 5 === 0) as tick, num}
		<span
			class="numerals"
			style={
			`top: calc(50% + ${(r + numeralOffset) * Math.cos(tick.angle)}px); 
			left: calc(50% + ${(r + numeralOffset) * Math.sin(tick.angle)}px);`}
		>
			{num * 5}
	</span>
	{/each}

</div>
<div>
	<button on:click={countDownTimer}>Start Timer</button>
</div>

<style>
	.face-layer{
		fill: white;
		stroke: none;
	}
	.shadow-layer{
		fill: white;
		stroke: none;
		filter: drop-shadow(0 0 10px black)
	}

	.timer-container {
		border: 1px solid black;
		border-radius: 30px;
		width: 450px;
		height: 450px;
		margin: 0 auto;
		position: relative;
	}
	.timer {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		fill: 'none';
		stroke: black;
		stroke-width: 1;
	}
	.numerals {
		position: absolute;
		font: 50px sans-serif;
		/* border: 1px solid magenta; */
		transform: translate(-50%, -50%);
		/* transform: translate(-30px, 15px); */

	}
	.numerals, .ticks{
		user-select: none;
	}
	.sweep1{
		stroke: none;
		fill: rgba(150, 0, 0, 0.8);
		filter: drop-shadow( 0px 0px 8px rgba(150, 0,0,1) );
	}
	.sweep{
		stroke: none;
		fill: rgba(150, 0, 0, 0.8);
		filter: drop-shadow( 0px 0px 8px rgba(150, 0,0,1) );
	}
	.knob{
		fill: white;
		stroke: white;
		filter: drop-shadow( 3px 3px 10px rgba(0, 0, 0,0.5) );
	}
	.knob-control{
		fill: white;
		stroke: none;
	}
	.knob-control:hover{
		fill: rgb(187, 176, 160);
		transition: 200ms;
	}
	.knob-control.arrow{
		fill: none;
		stroke: white;
		stroke-width: 4;
	}
	.arrowhead{
		fill: white;
	}
</style>
