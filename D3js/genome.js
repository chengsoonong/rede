
// Genome object for drawing

function Genome() {
	// return the genome object with the information for drawing the chromosomes circles 
	
    var genome = {},              //genome = this  !!!
    chromosomes,
    n = 24,
    padding = 0.05;

    // http://www.ncbi.nlm.nih.gov/projects/genome/assembly/grc/human/data/index.shtml
    var chromLength = new Array(249250621, 243199373, 198022430, 191154276,
				180915260, 171115067, 159138663, 146364022,
				141213431, 135534747, 135006516, 133851895,
				115169878, 107349540, 102531392, 90354753,
				81195210, 78077248, 59128983, 63025520,
				48129895, 51304566, 155270560, 59373566);
    
    function relayout() {
        var k,
        x,
        i;

	chromosomes = [];

	// Convert the total number of bases to scaling factor for [0, 2pi].
	k = 0, i = -1;
	while (++i < n) {
	    k += chromLength[i];
	}
	k = (2 * Math.PI - padding * n) / k;
	
	// Compute the start and end angle for each chromosome
	x = 0, i = -1; 
	while (++i < n) {
	    a0 = x,
	    a1 = x += chromLength[i] * k;
	    
	    chromosomes[i] = {  //array chromosomes with objects content information  
		index: i,
		startAngle: a0,
		endAngle: a1,
		factor_k: k,
		//angleTicks:d3.range(a0,a1,(a1-a0)/5),  //angles for ticks
		value: chromLength[i] * k
		
		
		
	    };
	    x += padding;
	}
    };
    
    genome.chromosomes = function() {
	if (!chromosomes) relayout();  //ensures that array chromosomes will not be returned empty
	return chromosomes;
    };

    genome.getAngle = function(chrom, bpPosition)
    {
	if (!chromosomes) relayout();  //ensures that array chromosomes will not be returned empty
	circ_loc = chromosomes[chrom-1].startAngle
	    + (bpPosition/chromLength[chrom-1])
	    *(chromosomes[chrom-1].endAngle - chromosomes[chrom-1].startAngle);
	return circ_loc;
    };
    
    return genome;
};




