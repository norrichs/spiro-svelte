<script>
	export let sParams;
	export let rParams;
	export let gParams;
	export let ringA;
	
	console.log('params', sParams, rParams, gParams)
	let step = 1;


	const calcSpiro = (rT, gT, r, pen, step) => {
		const p = pen
		const center = [r,r]
		let spiro = []
		const gRad = r * gT / rT  	// radius of gear
		const rRad = r - gRad			// radius from center of ring to center of gear
		const d2r = Math.PI / 180
		let rA = 0;
		let gA = rA * (rT / gT - 1);
		
		let i = 0;
		let gX, gY, pX, pY
	
	
		while(rA % 360 !== 0 || gA % 360 !== 0 && i < 10000|| i === 0){
			// console.log('spiro while', rA, gA, i)
			
			// gX = center[0] + rRad * Math.sin(rA * d2r) 
			// gY = center[1] + rRad * Math.cos(rA * d2r) 
			spiro[i]=[
				center[0] + rRad * Math.sin(rA * d2r) + gRad * Math.sin(gA * d2r)*p,
				center[1] + rRad * Math.cos(rA * d2r) - gRad * Math.cos(gA * d2r)*p
			]
			i++
			rA = i * step;
			gA = rA * (rT / gT - 1) ;
		}
		console.log('spiro size ',i)
		return spiro
	
	}

	// console.log('ring params', rParams, sParams)
	// console.log('points', pointArray);
	// const { radius, toothArcLength, toothSize } = sParams;
	// let  = t * toothArcLength / Math.PI / 2
	let s = sParams.toothSize;
	let width = sParams.radius * 2 + s * 2;
	let height = sParams.radius * 2 + s * 2;
	let center = [0,0]//[width / 2, height / 2];
	// let points = new Array(t * 2 + 1)
	// points.fill(0)

	// console.log('last point', pointArray[pointArray.length])

	const pointArray = calcSpiro(rParams.t, gParams.t, sParams.radius, gParams.p, step)
	let lines = pointArray.map((p) => {
		return `L${p[0]} ${p[1]} `;
	});

	let stepNum = 0;
	let maxStepNum = stepNum;
	let dString = `M${pointArray[0][0]} ${pointArray[0][1]} L${pointArray[0][0]} ${pointArray[0][1]}` 
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
</svg>

<style>
	.spirograph {
		position: absolute;
		top: 0;
		fill: none;
		stroke: red;
		stroke-width: 5;
		/* background: rgba(138, 18, 18, 0.2); */
	}
</style>
