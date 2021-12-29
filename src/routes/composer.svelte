<script>
	import {spiroCollection} from '$lib/stores'

	let bigRadius = 300;
	
</script>

<div class='spiro-browser'>
	{#if $spiroCollection.length > 0}
		{#each $spiroCollection as spiro, i}
			<div class="spiro-card"
				class:active={spiro.active}
				
			>
				<div on:click={()=>{spiro.active = spiro.active ? false : true}}>
					<svg class="small-spiro"
						viewbox={`
							${ -spiro.radius*(1 - spiro.gT/spiro.rT + spiro.gT/spiro.rT*spiro.p)}
							${ -spiro.radius*(1 - spiro.gT/spiro.rT + spiro.gT/spiro.rT*spiro.p)}
							${2*spiro.radius*(1 - spiro.gT/spiro.rT + spiro.gT/spiro.rT*spiro.p)}
							${2*spiro.radius*(1 - spiro.gT/spiro.rT + spiro.gT/spiro.rT*spiro.p)}
						`}>
						<path d={spiro.path} />
					</svg>
				</div>
				<div 
					on:click={()=>{
						if(spiro.editing){
							spiro.editing = false
						}else{
							spiroCollection.update(sC => sC.map(s=>{s.editing=false; return s	}))
							spiro.editing = true
						}
					}}
					class:editing={spiro.editing}
				>
					{#if spiro.active}
						<div>
							{spiro.p}
						</div>
					{/if}
				</div>
			</div>
		{/each}
	{/if}
</div>
<div class="spiro-viewer">
	<svg 
		class="big-spiro"
		class:editing={$spiroCollection.map(s=>s.editing).includes(true)} 
		viewbox={`${-bigRadius} ${-bigRadius} ${bigRadius * 2} ${bigRadius * 2} `}
	>
		{#if $spiroCollection.filter(s=>s.active).length > 0}
			{#each $spiroCollection.filter(s=>s.active) as spiro}
				<path d={spiro.path} class:editing={spiro.editing}/>
			{/each}
		{/if}
	</svg>
</div>


<style>
	.spiro-card{
		/* background-color: indigo; */
		width: 175px;
		height: 175px;
		border-radius: 4px;
		opacity: 0.5;
		border-radius: 4px;
		box-shadow: 0 0 5px 1px black;
		/* background-color: darkslateblue; */
		transition: 500ms;
	}
	
	.spiro-card>div:first-of-type{
		padding: 5px;
		background-color: indigo;
		height: 165px;
		border-radius: 4px 4px 4px 4px; 
		transition: 500ms;
	}	
	.spiro-card>div:last-of-type{
		background-color:darkslateblue;
		border-radius: 0 0 4px 4px;
		height: 0px;
		transition: 500ms;
	}
	.spiro-card.active{
		opacity: 1;
		height: 250px;
		transition: 500ms
	}
	.spiro-card.active>div:first-of-type{
		border-radius: 4px 4px 0 0;
	}
	.spiro-card.active>div:last-of-type{
		opacity: 0.2;
		height: calc(250px - 165px - 10px);
		transition: 500ms;
		
	}
	.spiro-card.active>div:last-of-type.editing{
		opacity: 1;
		transition: 300ms;
	}
	.spiro-browser{
		/* background-color: white; */
		/* width: 100vw; */
		margin: 0 auto;
		height: 300px;
		padding: 10px;
		display: flex;
		justify-content: center;
		flex-direction: row;
		gap: 20px;
		overflow-x: hidden;
		
	}
	.small-spiro{
		/* width: 250px;
		height: 250px; */
		margin: 0;
		/* background-color: lavenderblush; */
		fill: none;
		stroke: goldenrod;
		stroke-width: 1;
		shape-rendering: optimizeQuality;
		overflow: visible;
	}
	.big-spiro{
		fill: none;
		stroke: black;
		stroke-width: 0.5px;
		shape-rendering: optimizeQuality;
		background-color: gray;
	}
	.big-spiro.editing>path{
		stroke: rgba(0,0,0,0.1);
	}
	.big-spiro.editing>path.editing{
		stroke: rgba(0,0,0,1);
	}
	
</style>