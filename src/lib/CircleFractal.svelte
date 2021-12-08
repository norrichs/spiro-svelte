<script>
	// export let cfSymmetry
	export let cfLevels
	export let cfSymmetryArray
	export let cfBaseStroke
	let r0 = 50

	let params =
		{
			x: 0,
			y: 0,
			r: r0,
			level: 0,
			children: null
		}
	let circles = [params]

	
	
	const recurseParams = (p, levels, symmetry, parentAngle) => {	
		if(levels>0){
			const level = cfLevels - levels + 1
			// console.log('recurse level', level)
			const radius = r0 / Math.pow(2, level)
			const angle = 2 * Math.PI / symmetry[level]
			p.children = new Array(symmetry[level])
			p.children.fill(0)
			p.children = p.children.map((c, i) => {
				let childParams =  {
					x: p.x + radius * Math.sin(angle * i + parentAngle),
					y: p.y + radius * Math.cos(angle * i + parentAngle),
					r: radius,
					level: level,
					children: null
				}
				circles.push({...childParams})
				childParams = recurseParams(childParams, levels-1, symmetry, angle * i + parentAngle)
				return childParams
			})
			
		}
		return p
	}
	const setParams = (symmetryArray) => {
		console.log('reset cf params', symmetryArray)
		circles = [{
			x: 0,
			y: 0,
			r: r0,
			level: 0,
			children: null
		}]
		console.log('empty circles', circles)
		params = recurseParams(params, symmetryArray.length-1, symmetryArray, 0)
		console.log('filled circles', circles)
		circles = circles.map(c=>{
			return {
				x: Math.round(c.x*10000)/10000,
				y: Math.round(c.y*10000)/10000,
				r: c.r,
				level: c.level
			}
		})
	}

	$: setParams(cfSymmetryArray)



	console.log('cf params', params)
	console.log('circles', circles)

	let colorArray = [
		'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'
	]
</script>

	<svg viewbox={`${-(r0+1)} ${-(r0+1)} ${r0 * 2+2} ${r0 * 2+2}`} class="sac-geo" fill="none">
		{#each circles as c}
			<circle cX={c.x} cY={c.y} r={c.r}  stroke='goldenrod' stroke-width={cfBaseStroke * cfBaseStroke / 30 / c.level / cfLevels}/>
		{/each}
	</svg>



<style>
	.sac-geo{
		margin: 0 auto;
		fill: none;
		/* stroke: goldenrod; */
		/* stroke-width: 0.01em; */
		height: 100%;
		width: calc(100% * 3 / 2);
		/* background-color: blueviolet; */

	}

</style>