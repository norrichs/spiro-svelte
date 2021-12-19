import {writable} from 'svelte/store';

const r0 = 50;
const ctrlWidth = 0.05 * r0;
const ctrlGap = 0.05 * r0;
const ctrlArc = 0.35;
const symmetryArc = 0.35;





export const sParams = writable({
	rim: 30,
	rT: 100,
	gT: 51,
	p: 7 / 10,
	radius: 200,
	ringA: 0,
	r0: r0
})
export const sPathString = writable('')

export const spiroCollection = writable([])



export const circleControls = writable([
	{
		name: 'levels',
		value: 5,
		min: 1,
		max: 10,
		step: 1,
		arc: ctrlArc,
		position: 1,
		width: ctrlWidth,
		grabbed: false,
		gap: ctrlGap
	},
	{
		name: 'base width',
		value: 10,
		min: 1,
		max: 100,
		step: 1,
		arc: ctrlArc,
		position: 2,
		width: ctrlWidth,
		grabbed: false,
		gap: ctrlGap
	},
	// {
	// 	name: 'stroke',
	// 	value: 43,
	// 	min: 0,
	// 	max: 359,
	// 	step: 1,
	// 	arc: ctrlArc,
	// 	position: 3,
	// 	width: ctrlWidth,
	// 	grabbed: false,
	// 	gap: ctrlGap
	// },
	{
		name: 'symmetry',
		value: 1,
		min: 1,
		max: 24,
		step: 1,
		arc: symmetryArc,
		position: 0,
		width: ctrlWidth * 0.75,
		grabbed: false,
		gap: ctrlGap
	},
	{
		name: 'symmetry',
		value: 2,
		min: 1,
		max: 24,
		step: 1,
		arc: symmetryArc,
		position: -1,
		width: ctrlWidth * 0.75,
		grabbed: false,
		gap: ctrlGap
	},
	{
		name: 'symmetry',
		value: 2,
		min: 1,
		max: 24,
		step: 1,
		arc: symmetryArc,
		position: -2,
		width: ctrlWidth * 0.75,
		grabbed: false,
		gap: ctrlGap
	},
	{
		name: 'symmetry',
		value: 2,
		min: 1,
		max: 24,
		step: 1,
		arc: symmetryArc,
		position: -3,
		width: ctrlWidth * 0.75,
		grabbed: false,
		gap: ctrlGap
	},
	{
		name: 'symmetry',
		value: 6,
		min: 1,
		max: 24,
		step: 1,
		arc: symmetryArc,
		position: -4,
		width: ctrlWidth * 0.75,
		grabbed: false,
		gap: ctrlGap
	}
])