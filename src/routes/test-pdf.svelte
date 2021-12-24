<script>
	// Test svg -> pdf export
	import pdfMake from 'pdfmake/build/pdfmake'
	// const pdfMake = require('./pdfmake/build/pdfmake')

	const createPDF = () => {
		const docDefinition = {
			content: [
				{
					svg: 	'<svg viewBox="-101 -101 202 202" >' + 
								'<circle cx="0" cy="50" r="50" fill="none" stroke="black" stroke-width="0.1"/>' + 
								'<circle cx="43.3013" cy="-25" r="50" fill="none" stroke="black" stroke-width="0.1"/>' + 
								'<circle cx="-43.3013" cy="-25" r="50" fill="none" stroke="black" stroke-width="0.1"/>' +
								'<circle cx="0" cy="0" r="100" fill="none" stroke="black" stroke-width="0.1"/>'+ 
							'</svg>',
					width: 500,
				}
			]
		}

		pdfMake.createPdf(docDefinition).open();


	}




</script>

<div>
	<div>
		Test svg below
		<button
			on:click={createPDF}
		>Create PDF</button>
	</div>
	<svg viewBox="-101 -101 202 202" ><circle cX="0" cY="50" r="50" fill="none" stroke="black" stroke-width="0.1"/><circle cX="43.3013" cY="-25" r="50" fill="none" stroke="black" stroke-width="0.1"/><circle cX="-43.3013" cY="-25" r="50" fill="none" stroke="black" stroke-width="0.1"/><circle cX="0" cY="0" r="100" fill="none" stroke="black" stroke-width="0.1"/></svg>

</div>


<style>
	#test-svg{
		width: 300px;
		fill: green;
		stroke: black;
		stroke-width: 1;
	}
</style>