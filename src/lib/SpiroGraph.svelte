<script>
	export let rim;
	export let rT;
	export let gT;
	export let p;
	export let radius;
	export let ringA;

	let step = 1;
	let width, height, center; 
	let stepNum = 0
	let pointArray, lines, dString
	let spiroArray = []

	const calcSpiro = (rT, gT, r, pen, step, center) => {
		console.log('calcspiro')
		spiroArray.push(dString)
		spiroArray = spiroArray
		stepNum = 0;
		maxStepNum = stepNum;
		width = radius * 2 + rim * 2 ;
		height = radius * 2 + rim * 2 ;
		center = [width / 2, height / 2]
		stepNum = 0
		const p = pen
		let spiro = []
		const gRad = r * gT / rT  	// radius of gear
		const rRad = r - gRad			// radius from center of ring to center of gear
		const d2r = Math.PI / 180
		let rA = 0;
		let gA = rA * (rT / gT - 1);
		
		let i = 0;	
	
		while(rA % 360 !== 0 || gA % 360 !== 0 && i < 10000|| i === 0){
			// console.log('spiro while', rA, gA, i)

			spiro[i]=[
				center[0] + rRad * Math.sin(rA * d2r) + gRad * Math.sin(gA * d2r)*p,
				center[1] + rRad * Math.cos(rA * d2r) - gRad * Math.cos(gA * d2r)*p
			]
			i++
			rA = i * step;
			gA = rA * (rT / gT - 1) ;
		}
		console.log('spiro size ',i)
		pointArray = spiro
		lines = pointArray.map((p) => {
			return `L${p[0]} ${p[1]} `;
		});
		dString = `M${pointArray[0][0]} ${pointArray[0][1]} L${pointArray[0][0]} ${pointArray[0][1]}` 
		console.log('dString',dString)
		// return spiro
	
	}

	$: calcSpiro(rT, gT, radius, p, step, center)


	// TODO - update so that maxStepmum gets refreshed on recalculate
	//		Update so that drawing works in either direction
	//		Lazy loading of calculated spiro?
	//		Leave spiros in place?
	//			in calcspiro add dString to an array
	//			

	let maxStepNum = stepNum;
	$: {
		stepNum = Math.floor(ringA / step);
		// console.log('step',stepNum)
		if(stepNum === maxStepNum+1){
			dString += lines[stepNum]
			maxStepNum = stepNum
		}else if(stepNum > maxStepNum + 1){
			dString += lines.slice(maxStepNum, stepNum).join()
			maxStepNum = stepNum;
		}
	}
	// let dString = + lines.join();

</script>

<svg class="spirograph" width={width} height={height}>
	<path d={dString} />
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
		/* background: rgba(138, 18, 18, 0.2); */
	}
</style>
