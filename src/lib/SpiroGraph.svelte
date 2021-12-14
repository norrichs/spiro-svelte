<script>
	import {spiroCollection, sParams, sPathString} from '../lib/stores.js'
	// export let rim;
	// export let rT;
	// export let gT;
	// export let p;
	// export let radius;
	// export let ringA;



	let step = 5;
	let width, height, center; 
	let stepNum = 0
	let pointArray, lines
	let spiroArray = []
	let precision = 2

	const calcSpiro = (rT, gT, r, p, step, rim) => {
		console.log('calcspiro')
		spiroArray.push($sPathString)
		spiroArray = spiroArray
		stepNum = 0;
		maxStepNum = stepNum;
		width = r * 2 + rim * 2 ;
		height = r * 2 + rim * 2 ;
		center = [ 0, 0]
		stepNum = 0
		let spiro = []
		const gRad = r * gT / rT  	// radius of gear
		const rRad = r - gRad			// radius from center of ring to center of gear
		const d2r = Math.PI / 180
		let rA = 0;
		let gA = rA * (rT / gT - 1);
		
		let i = 0;	
	
		while(rA % 360 !== 0 || gA % 360 !== 0 && i < 50000|| i === 0){
			// console.log('spiro while', rA, gA, i)

			spiro[i]=[
				rRad * Math.sin(rA * d2r) + gRad * Math.sin(gA * d2r)*p,
				rRad * Math.cos(rA * d2r) - gRad * Math.cos(gA * d2r)*p
			]
			i++
			rA = i * step;
			gA = rA * (rT / gT - 1) ;
		}
		console.log('spiro size ',i)
		pointArray = spiro
		lines = pointArray.map((p) => {
			return `L${Number.parseFloat(p[0]).toFixed(precision)} ${Number.parseFloat(p[1]).toFixed(precision)} `;
		});
		$sPathString = `M${pointArray[0][0]} ${pointArray[0][1]} L${pointArray[0][0]} ${pointArray[0][1]}` 
		console.log('path string',$sPathString)
		// return spiro
	
	}

	$: calcSpiro($sParams.rT, $sParams.gT, $sParams.radius, $sParams.p, step, $sParams.rim)

	let maxStepNum = stepNum;
	$: {
		stepNum = Math.floor($sParams.ringA / step);
		// console.log('step',stepNum)
		if(stepNum === maxStepNum+1){
			$sPathString += lines[stepNum]
			maxStepNum = stepNum
		}else if(stepNum > maxStepNum + 1){
			$sPathString += lines.slice(maxStepNum, stepNum).join()
			maxStepNum = stepNum;
		}
	}

</script>

<svg viewbox={`${-width/2} ${-height/2} ${width} ${height}`} class="spirograph" width={width} height={height} shape-rendering="optimizeQuality" >
	<path d={$sPathString} />
	<circle cX=0 cY=0 r=20 stroke="black" />
	{#if spiroArray.length > 0}
	{#each spiroArray as spiro}
	<path d={spiro} />
	{/each}
	{/if}
	<!-- <circle cX={center[0]} cY={center[1]} r=3 stroke="black" /> -->
	<!-- <path d={`M${center[0]-radius} ${center[1]} L${center[0]+radius} ${center[1]} M${center[0]} ${center[1]-radius} L${center[0]} ${center[1]+radius} `} stroke-width=".2"/> -->
</svg>



<style>
	.spirograph {
		position: absolute;
		top: 0;
		left: 0;
		fill: none;
		stroke: red;
		stroke-width: 1;
		/* border-radius: 50%; */
		background: rgba(83, 116, 167, 0.2);
	}
</style>
