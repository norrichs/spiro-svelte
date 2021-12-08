
<script>
	import RecursiveRightAngle from '$lib/RecursiveRightAngle.svelte'
	import RotatedCircles from '$lib/RotatedCircles.svelte';
	import CircleFractal from '$lib/CircleFractal.svelte'

	// Rotated Circles Parameter
	let circleCount = 48
	// Circle Fractal Parameter
	let cfSymmetry = 2
	let cfSymmetryArray = [1,4,2,2]
	let cfLevels = 3
	let cfBaseStroke = 1;


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
	<!-- <div class="sample-container"><RecursiveRightAngle depth={5} /></div>
	<div class="sample-container">
		<div><input type="range" bind:value={circleCount} min=1 max=300/></div>
		<RotatedCircles {circleCount}/>
	</div> -->
	<div class="sample-container">
		<div class="settings-container">
			<input type="number" bind:value={cfLevels} min=0 max=12/>
			<div class="range-container line-weight">
				
				<input type="range" bind:value={cfBaseStroke} min=1 max=10/>
			</div>
			{#each cfSymmetryArray.slice(1) as s,i}
				<div class="range-container">
					<input type="range" bind:value={cfSymmetryArray[i+1]} min=2 max=12/>
				</div>
			{/each}

		</div>

		<CircleFractal {cfSymmetry} {cfLevels} {cfSymmetryArray} {cfBaseStroke}/>
	</div>
	
		
	
</div>

<style>
	.range-container.line-weight{
		background-color: rgba(0, 0, 200, 0.2);
	}
	.settings-container{
		position: absolute;
		top: 0;
		left: 0;
		width: 100px;
		background-color: rgba(0,0,0,0.3);
		height: 100px;
		border-radius: 10px 10px 0 0;
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		opacity: 0.01;
	}
	.settings-container:hover{
		opacity: 1;
	}
	.range-container{
		width: 40px;
		display: flex;
		flex-direction: row;
		background-color: rgba(100,0,0,.1);
		transform: rotate(-90deg);
	}
	.range-container>input{
		width: calc(100px - 1em); 
		transform-origin: left;
	}
	.sample-container{
		width: 2000px;
		height: calc( 100vh - 60px );
		display: flex;
		justify-content: center;
		flex-shrink: none;
		padding: 10px;
		border-radius: 10px;
		background-color: indigo;
		position: relative;

	}

	.sample-container>div{
		position: absolute;
		display: flex;

		width: 100%;
		/* visibility: hidden; */

	}
	.sample-container:focus>input{
		visibility: visible;
	}
	.sacred-library{
		display: flex;
		flex-direction: row;
		gap: 30px;
		padding: 30px;
	}
</style>