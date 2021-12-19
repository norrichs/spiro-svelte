<script>
	import {circleControls} from '$lib/stores.js'
	
	let r0 = 100;
	let params = {
		x: 0,
		y: 0,
		r: r0,
		level: 0,
		children: null
	};
	let circles = [];

	const recurseParams = (p, levels, symmetry, parentAngle) => {
		if (levels > 1) {
			// TODO - generalizee index
			const level = $circleControls[0].value - levels +1;
			// console.log('recurse level', level)
			const radius = r0 / Math.pow(2, level);
			const angle = (2 * Math.PI) / symmetry[level];
			p.children = new Array(symmetry[level]);
			p.children.fill(0);
			p.children = p.children.map((c, i) => {
				let childParams = {
					x: p.x + radius * Math.sin(angle * i + parentAngle),
					y: p.y + radius * Math.cos(angle * i + parentAngle),
					r: radius,
					level: level,
					children: null
				};
				circles.push({ ...childParams });
				childParams = recurseParams(childParams, levels - 1, symmetry, angle * i + parentAngle);
				return childParams;
			});
		}
		return p;
	};
	const setParams = (symmetryArray) => {
		console.log('reset cf params', symmetryArray);
		circles = [
			{
				x: 0,
				y: 0,
				r: r0,
				level: 0,
				children: null
			}
		];
		// console.log('empty circles', circles);
		params = recurseParams(params, symmetryArray.length, symmetryArray, 0);
		// console.log('filled circles', circles);
		circles = circles.map((c) => {
			return {
				x: Math.round(c.x * 10000) / 10000,
				y: Math.round(c.y * 10000) / 10000,
				r: c.r,
				level: c.level
			};
		});
		console.log('setParams circles', circles)
	};

	$: setParams($circleControls.filter(c=>c.name === 'symmetry').map(c=>c.value));

	console.log('cf params', params);
	console.log('circles', circles);
	const getDecreasingStrokeWidth = (level, doDecrease) => {
		if(doDecrease){
			return $circleControls[1].value /
						100 /
						((((level + 1) / $circleControls[0].value) * (level + 1)) / $circleControls[0].value)
		}else{
			return $circleControls[1].value / 50
		}
	}

</script>

<div class="svg-container">
	<svg
		viewbox={`${-(r0 + 1)} ${-(r0 + 1)} ${r0 * 2 + 2} ${r0 * 2 + 2}`}
		xmlns="http://www.w3.org/2000/svg"
		class="sac-geo"
		fill="none" 
		
	>
		
		{#each circles.sort((a,b) => {
			if(a.level < b.level) return 1
			if(a.level > b.level) return -1
			else return 0
		}) as c}
	
			<circle
				cX={c.x}
				cY={c.y}
				r={c.r}
				stroke-width={getDecreasingStrokeWidth(c.level, false)}
			/>
		{/each}
	</svg>
	
</div>

<style>

	/* .svg-control-active.grabbed{
		fill: red;
	}
	.svg-control-inactive{
		fill: rgba(218, 165, 32, 0.2);
	}
	.svg-control-active{
		fill: rgba(218, 165, 32, 0.8);
	} */
	.svg-container{
		position: relative;
		background-color: hsl(43, 74%, 49%);
		border-radius: 50%;
	}
	
	.sac-geo {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		margin: 0 auto;
		fill: none;
		height: 100%;
		border-radius: 50%;
		/* background-color: rgba(200,200,0,0.1); */
	}
	.sac-geo{
		stroke: black;
		/* stroke: rgba(0, 153, 255, 0.295); */
		/* fill: rgba(0, 114, 19, 0.01); */
	}

</style>
