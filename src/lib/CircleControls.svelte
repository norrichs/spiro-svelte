<script>
	import { circleControls } from '$lib/stores.js';
	// Controls
	//		TODO - create an array of control objects
	// SVG based controls
	const r0 = 50;

	const ctrlWidth = 0.05 * r0;
	const ctrlGap = 0.05 * r0;

	let showControls = true;
	let grabbedPosition = null;
	let grabbedControlRect = null;

	const getInactiveControlPath = (c) => {
		// console.log('get inactive control', c)
		const outer = r0 - (Math.abs(c.position) * ctrlGap + (Math.abs(c.position) - 1) * ctrlWidth);
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

	const getActiveControlPath = (c) => {
		// console.log('get active control', c)
		const ratio = (c.value - c.min) / (c.max - c.min);
		const outer = r0 - (Math.abs(c.position) * ctrlGap + (Math.abs(c.position) - 1) * ctrlWidth);
		const inner = outer - c.width;
		const origin = c.position > 0 ? Math.PI * 0.5 : Math.PI * 1.5;
		const arc = c.arc * Math.PI * 2;
		const sign = Math.sign(c.position);
		// console.log(c.name, 'sign',sign)
		return (
			'M ' +
			outer * Math.sin(origin + sign * (arc / 2 - arc * (1 - ratio))) +
			' ' +
			outer * Math.cos(origin + sign * (arc / 2 - arc * (1 - ratio))) +
			' L ' +
			inner * Math.sin(origin + sign * (arc / 2 - arc * (1 - ratio))) +
			' ' +
			inner * Math.cos(origin + sign * (arc / 2 - arc * (1 - ratio))) +
			' A ' +
			inner +
			' ' + //rx
			inner +
			' ' + //ry
			arc +
			' ' + //x-axis-rot
			0 +
			' ' + //large-arc
			parseInt(0.5 + sign * 0.5) +
			' ' + //sweep-flag (0left 1right)
			inner * Math.sin(origin - sign * (arc / 2)) +
			' ' + //x
			inner * Math.cos(origin - sign * (arc / 2)) + //y
			' L ' +
			outer * Math.sin(origin - sign * (arc / 2)) +
			' ' +
			outer * Math.cos(origin - sign * (arc / 2)) +
			' A ' +
			outer +
			' ' + //rx
			outer +
			' ' + //ry
			arc +
			' ' + //x-axis-rot
			0 +
			' ' + //large-arc
			parseInt(0.5 - sign * 0.5) +
			' ' + //sweep-flag (1left, 0right)
			outer * Math.sin(origin + sign * (arc / 2 - arc * (1 - ratio))) +
			' ' + //x
			outer * Math.cos(origin + sign * (arc / 2 - arc * (1 - ratio))) //y
		);
	};

	const grabControl = (ev, controlPosition) => {
		let controlIndex = $circleControls.map((c) => c.position).indexOf(controlPosition);
		grabbedControlRect = document
			.querySelector('#control-' + controlPosition)
			.getBoundingClientRect();
		console.log('grabcontrol target', ev.target);
		grabbedPosition = controlPosition;
		$circleControls[controlIndex].grabbed = true;
		console.log('control  grabbed', $circleControls[controlIndex], ev.clientX, ev.offsetX);
		// controlGrabCoord = [ev.clientX, ev.clientY];
		let newIntValue = getValueFromMouse(
			$circleControls[controlIndex],
			ev.clientY,
			grabbedControlRect.top,
			grabbedControlRect.bottom
		);
		$circleControls[controlIndex].value = newIntValue;

		if ($circleControls[controlIndex].name === 'levels') {
			const currentLevels = $circleControls.filter((c) => c.name === 'symmetry').length;
			if (newIntValue > currentLevels) {
				for (let i = 0; i < newIntValue - currentLevels; i++) {
					$circleControls.push({
						name: 'symmetry',
						value: 2,
						min: 1,
						max: 12,
						step: 1,
						arc: $circleControls[$circleControls.length-1].arc,
						position: $circleControls[$circleControls.length-1].position - 1,
						width: $circleControls[$circleControls.length-1].width,
						grabbed: false
					});
				}
			} else if (newIntValue < currentLevels) {
				for (let i = 0; i < currentLevels - newIntValue; i++) {
					$circleControls.pop();
				}
			}
			$circleControls = $circleControls
			
		}


	};

	const releaseControl = (ev) => {
		// console.log('control handle released', ev)
		const grabbedIndex = $circleControls.map((c) => c.grabbed).indexOf(true);
		if (grabbedIndex !== -1) {
			$circleControls[grabbedIndex].grabbed = false;
			$circleControls[grabbedIndex].value = Math.round($circleControls[grabbedIndex].value);
			console.log('released control, new values', $circleControls);
		}
		grabbedPosition = null;
	};

	const getValueFromMouse = (c, y, top, bottom) => {
		const outer = (bottom - top) / (2 * Math.sin((c.arc * 2 * Math.PI) / 2));
		// relative mouse distance above bottom of control (in )
		const ctrlY = bottom - (bottom - top) / 2 - y;
		// angle of mouse position relative to svg center (down === 0, right = PI/2)
		const clientCtrlAngle = Math.PI - Math.acos(ctrlY / outer);

		const minAngle = Math.PI / 2 - Math.PI * c.arc;
		const maxAngle = minAngle + Math.PI * 2 * c.arc;
		const angleProportion = (clientCtrlAngle - minAngle) / (c.arc * Math.PI * 2);

		const newIntValue = Math.round(angleProportion * (c.max - c.min) + c.min);

		console.log('newIntVal', {
			name: c.name,
			arc_radians: c.arc * Math.PI * 2,
			clientCtrlAngle: clientCtrlAngle,
			minAngle: minAngle,
			maxAngle: maxAngle,
			angleProportion: angleProportion
		});
		return newIntValue;
	};

	const handleMouseMove = (ev) => {
		if (grabbedPosition) {
			const controlIndex = $circleControls.map((c) => c.position).indexOf(grabbedPosition);
			const newIntValue = getValueFromMouse(
				$circleControls[controlIndex],
				ev.clientY,
				grabbedControlRect.top,
				grabbedControlRect.bottom
			);
			console.log('current value', 'continuous value', newIntValue);
			$circleControls[controlIndex].value = newIntValue;
			
			if ($circleControls[controlIndex].name === 'levels') {
			const currentLevels = $circleControls.filter((c) => c.name === 'symmetry').length;
			if (newIntValue > currentLevels) {
				for (let i = 0; i < newIntValue - currentLevels; i++) {
					$circleControls.push({
						name: 'symmetry',
						value: 2,
						min: 1,
						max: 12,
						step: 1,
						arc: $circleControls[$circleControls.length-1].arc,
						position: $circleControls[$circleControls.length-1].position - 1,
						width: $circleControls[$circleControls.length-1].width,
						grabbed: false
					});
				}
			} else if (newIntValue < currentLevels) {
				for (let i = 0; i < currentLevels - newIntValue; i++) {
					$circleControls.pop();
				}
			}
			$circleControls = $circleControls
			
		}
		}
	};
</script>

<svg
	viewbox={`${-(r0 + 1)} ${-(r0 + 1)} ${r0 * 2 + 2} ${r0 * 2 + 2}`}
	class="controls"
	on:mousemove={(ev) => handleMouseMove(ev)}
	on:mouseup={(ev) => releaseControl(ev)}
>
	{#each $circleControls.filter((c) => c.position !== 0) as c, i}
		<path d={getActiveControlPath(c)} class="svg-control-active" class:grabbed={c.grabbed} />
		<path
			d={getInactiveControlPath(c)}
			class="svg-control-inactive"
			id={'control-' + c.position}
			on:mousedown={(ev) => grabControl(ev, c.position)}
		/>
	{/each}
</svg>

<style>
	.controls {
		/* background-color: rgba(100, 148, 237, 0.5); */
		border-radius: 50%;
		/* position: absolute; */
		/* top: 50%;
		left: 50%;
		transform: translate(-50%, -50%); */
	}
	.svg-control-active:focus {
		fill: red;
	}
	.svg-control-active.grabbed {
		fill: red;
	}
	.svg-control-inactive {
		fill: rgba(218, 165, 32, 0.2);
	}
	.svg-control-active {
		fill: rgba(218, 165, 32, 0.8);
	}
</style>
