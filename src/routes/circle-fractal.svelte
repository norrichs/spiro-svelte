
<script>

	import CircleFractal from '$lib/CircleFractal.svelte'
	import CircleControls from '$lib/CircleControls.svelte'
	import OpenPdfButton from '$lib/OpenPdfButton.svelte';
	
	// Rotated Circles Parameter
	let circleCount = 48
	// Circle Fractal Parameter
	let cfSymmetry = 2
	let cfSymmetryArray = [1,4,2,2]
	let cfLevels = 3
	let cfBaseStroke = 5;
	let showControls = false

	const initSymmetryArray = (levels) => {
		const diff = levels - cfSymmetryArray.length + 1
		console.log('diff', diff)
		if(diff > 0){
			for(let i=0; i<diff; i++){
				cfSymmetryArray.push(2)
			}
		}else if(diff < 0){
			for(let i=0; i>diff; i--){
				cfSymmetryArray.pop()
			}
		}
		cfSymmetryArray = [...cfSymmetryArray]
		// cfSymmetryArray = new Array(cfLevels + 1)
		// cfSymmetryArray.fill(2)
		// cfSymmetryArray[0] = 1;
	}
	$: initSymmetryArray(cfLevels)



</script>

<div class='sacred-library'>
		<div class="sample-container"
		on:focus
		on:click={()=>{console.log('clicked CircleFractal')}}
		on:mouseover={ev=>{console.log('CircleFractal mouseover'); showControls = true}}
		on:mouseleave={ev=>showControls = false}
	>
		<CircleFractal {cfSymmetry} {cfLevels} {cfSymmetryArray} {cfBaseStroke}/>
		<div class="controls-container" class:showControls>
			<CircleControls/>
			
		</div>
	</div>
</div>
<OpenPdfButton />

<style>
	.sample-container{
		--major-dimension: min(80vh, 80vw);
		/* min-width: calc( 50vh - 60px ); */
		/* height: calc( 50vh - 60px ); */
		/* max-height: 100%; */
		width: var(--major-dimension);
		height: var(--major-dimension);
		display: flex;
		justify-content: center;
		flex-shrink: none;
		padding: 10px;
		border-radius: 10px;
		/* background-color: rgb(19, 8, 27); */
		position: relative;

	}

	.sample-container>div{
		position: absolute;
		display: flex;

		width: 100%;
	}

	.sacred-library{
		display: flex;
		flex-direction: row;
		justify-content: center;
		gap: 30px;
		padding: 30px;
		/* background-color: red; */
	}
	.controls-container{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		/* height: 300px; */
		width: 100%;
		border-radius: 50%;
		background-color: rgba(0,0,0,0.5);
		display: grid;
		place-items: center;
		visibility: visible;
		opacity: 0;
		border-radius: 10px;
		transition: 300ms;
	}
	.controls-container.showControls{
		visibility: visible;
		backdrop-filter: blur(2px);
		opacity: 1;
		transition: opacity 300ms, backdrop-filter 1000ms;
	}
</style>