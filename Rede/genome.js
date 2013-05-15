/**
 * @fileoverview information about each chromosomes
 * @author cristovao.casagrande@gmail.com (Cristovao Iglesias)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Ong)
 */




/**
 * Genome object for drawing 
 */
function Genome() {
    // return the genome object with the information for drawing the chromosomes circles 
	
    var genome = {},              //genome = this  !!!
    chromosomes,
    n = 24,
    padding = 0.05;

    var zoom = 0;
    var view_chr=0,
    view_start=0,
    view_end=0;


    // http://www.ncbi.nlm.nih.gov/projects/genome/assembly/grc/human/data/index.shtml
    var chromLength = new Array(249250621, 243199373, 198022430, 191154276,
				180915260, 171115067, 159138663, 146364022,
				141213431, 135534747, 135006516, 133851895,
				115169878, 107349540, 102531392, 90354753,
				81195210, 78077248, 59128983, 63025520,
				48129895, 51304566, 155270560, 59373566);
    
    function layout() {
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
                startBase: 0,
                endBase: chromLength[i],
		radPerBase: k,
		totAngle: chromLength[i] * k
		
		
		
	    };
	    x += padding;
	}
    };

    function layout_zoom() {
        var k,
        x,
        i;

        k = (2 * Math.PI - 2*padding) / (view_end - view_start)
        chromosomes = [];
        i = -1;
        while (++i < n) {
            if (i == view_chr-1) {
                chromosomes[i] = {
                    index: view_chr-1,
                    startAngle: 0.1+padding,
                    endAngle: 2*Math.PI-padding,
                    startBase: view_start,
                    endBase: view_end,
                    radPerBase: k,
                    totAngle: 2*Math.PI-2*padding
                };
            } else {
                chromosomes[i] = {
                    index: view_chr-1,
                    startAngle: 0,
                    endAngle: 0.1,
                    startBase: 0,
                    endBase: chromLength[i],
                    radPerBase: 0.1/chromLength[i],
                    totAngle: 0.1
                };
            };
        };
    };
        
    
    genome.set_zoom = function(c,s,e) {
        view_chr = c;
        view_start = s;
        view_end = e;
        if (view_chr == 0) {
            zoom = 0;
            layout();
        } else {
            zoom = 1;
            layout_zoom();
        };
    };

    genome.chromosomes = function() {
	if (!chromosomes) {
            if (zoom == 0) {
                layout();
            } else {
                layout_zoom();  //ensures that array chromosomes will not be returned empty
            };
        };
	return chromosomes;
    };

    genome.getAngle = function(chrom, bpPosition)
    {
	if (!chromosomes) {
            if (zoom == 0) {
                layout();
            } else {
                layout_zoom();  //ensures that array chromosomes will not be returned empty
            };
        };
	circ_loc = chromosomes[chrom-1].startAngle
	    + ((bpPosition-chromosomes[chrom-1].startBase)*chromosomes[chrom-1].radPerBase);
	return circ_loc;
    };
    
    return genome;
};




