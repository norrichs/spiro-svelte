<script>
	import pdfMake from 'pdfmake/build/pdfmake'
	import {circleFractalArray} from '$lib/stores.js'

	const createPDF = (svgString) => {
		const docDefinition = {
			content: [
				{
					svg: svgString,
					width: 500,
				}
			]
		}

		pdfMake.createPdf(docDefinition).open();


	}

	const getSvgString = (arr) => {
		const svgString = (
			'<svg viewBox="-101 -101 202 202" >' + 
				$circleFractalArray.map((c,i)=>{
					return `<circle cx="${c.x}" cy="${c.y}" r="${c.r}" fill="none" stroke="black" stroke-width="0.1"/>`
				}).join('') +
			'</svg>'
		)
		console.log('pdf svg string', svgString)
		return svgString
	}


</script>


<button
	on:click={()=>{createPDF(getSvgString($circleFractalArray))}}
>
	Create PDF
</button>


<style>
	button{
		position: absolute;
		top: 5px; 
		left: 5px;
		width: 200px;
		outline: none;
		border: none;
		background-color: cornflowerblue;
		opacity: 0.2;
		padding: 10px;
		border-radius: 5px;
	}
	button:hover{
		opacity: 1;
		transition: 400ms;
	}
</style>