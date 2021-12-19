<script>
	import { get } from "svelte/store";
	import {sParams} from '$lib/stores'

	export let c;
	
	// import {circleConrols} from '$lib/stores.js'
	let huesArray = [];
	let hueBin = 2;
	for (let i = 0; i < 360; i += hueBin) {
		huesArray.push(i)
	}

	

	const getInactiveControlPath = (c) => {
		// console.log('get inactive control', c)
		const outer = $sParams.r0 - (Math.abs(c.position) * c.gap + (Math.abs(c.position) - 1) * c.width);
		const inner = outer - c.width;
		const origin = c.position > 0 ? Math.PI * 0.5 : Math.PI * 1.5;
		const arc = c.arc * Math.PI * 2;

		return (
			'M ' +
			outer * Math.sin(origin + arc / 2) +
			' ' +
			outer * Math.cos(origin + arc / 2) +
			' L ' +
			inner * Math.sin(origin + arc / 2) +
			' ' +
			inner * Math.cos(origin + arc / 2) +
			' A ' +
			inner +
			' ' + //rx
			inner +
			' ' + //ry
			arc +
			' ' + //x-axis-rot
			0 +
			' ' + //large-arc
			1 +
			' ' + //sweep-flag
			inner * Math.sin(origin - arc / 2) +
			' ' + //x
			inner * Math.cos(origin - arc / 2) + //y
			' L ' +
			outer * Math.sin(origin - arc / 2) +
			' ' +
			outer * Math.cos(origin - arc / 2) +
			' A ' +
			outer +
			' ' + //rx
			outer +
			' ' + //ry
			arc +
			' ' + //x-axis-rot
			0 +
			' ' + //large-arc
			0 +
			' ' + //sweep-flag
			outer * Math.sin(origin + arc / 2) +
			' ' + //x
			outer * Math.cos(origin + arc / 2) //y
		);
	};

	const pathString = getInactiveControlPath(c)
</script>

<path d={pathString} class="color-picker" fill="red"/>

<!-- <div class="color-picker">
	{#each huesArray as h}
		<div class="hue" style={'background-color: hsla(' + h + ', 100%, 50%,1);'}></div>
	{/each}
</div> -->

<style>
	.color-picker{
		fill: "red";
	}
	.hue {
		width: 10px;
		height: 1px;
	}
	.hue.test{
		background-color: hsla(212, 100%, 50%, 0.952);
	}
</style>
