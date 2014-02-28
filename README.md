Rede
====

A visualization tool for probe pairs arising in genome wide association studies.

------------
Requirements 
------------
Browser: Mozilla Firefox new version (for development the version 27.0.1 was used) 

------------
file format 
------------

The visualized data has to be a .json file  

This is a description of the json file format used to store the epistatic graph.

There are 6 top level components: {"name":  'some name', "nodes": [], "links":
[], "cont_table": [], "subgraphs": [], "communities": [] }

The last two elements (subgraphs and communities) are optional.

"name" is just a string to identify the dataset. All other elements are a comma
separated list of key value pairs.


Elements in "nodes" are {"prbCode": "rs4147581", "degree": 1.0, "prb": 14, "rs":
"rs4147581", "probe_group": 4, "bp_position": 67351585, "chrom": 11, "id": 0}

"prbCode" is the string identifier for the probe (comes from BIM file) "degree"
is the number of pairs involving this probe "prb" is the index of the probe (row
in the BIM file, 1 based because of GWIS output) "rs" is the rs number.
"probe_group" is an identifier for connected subgraphs, which is used for
colouring and selecting subgraphs in the circular plot.  All vertices in the
same group have the same colour.  "bp_position" is the location along the
chromosome "chrom" is the chromosome as an integer "id" is a unique identifier
for the node


Elements in "links" are {"source": 1, "target": 7, "probe_group": 1, "Chi2":
0.0, "SS": 0.0, "GSS": 3.98183, "ct_id":1}

"source" and "target" are the ids of nodes from which the edge is formed
"probe_group" see above This is followed by a list of statistics and their
values "ct_id" is a unique identifier for the edge



Elements in "cont_table" are
{"unv1": [{"controls":109 ,"cases":86 }, {"controls":131 ,"cases":93 },
{"controls":47 ,"cases":25 }], "unv2": [{"controls":152 ,"cases":101 },
{"controls":110 ,"cases":91 }, {"controls":25 ,"cases":12 }], "biv":
[[{"controls":51 ,"cases":55}, {"controls":49 ,"cases":26}, {"controls":9
,"cases":5}],[{"controls":72 ,"cases":37}, {"controls":45 ,"cases":53},
{"controls":14 ,"cases":3}],[{"controls":29 ,"cases":9}, {"controls":16
,"cases":12}, {"controls":2 ,"cases":4}]], "total": {"controls":287 ,"cases":204
}}

"unv1" corresponds to the univariate table for source
"unv2" corresponds to the univariate table for target
"biv" corresponds to the bivariate table
"total" is the total number of individuals

Based on http://d3js.org/

-----
Usage
-----

First you have to open view_graph.html with Mozilla Firefox. After this step you
should click the Browse... button and select a json file with right format(see
section file format). After this step a plot should appear. You could chose the
plot you would like to see at the dropbox Plots. 

    -----------------
    Circular ideogram
    -----------------
Statistical test
----------------
If you selected the Circular plot a dropbox with the available statistical tests
will appear. The p-values of the SNP interactions will be displayed under the
statistical test dropbox on an axis. You could select an arbitrary area of
values through clicking on the axis and moving the mouse. The selected area is
brushed and you can move it with the mouse.

Probe groups
------------
In the section Probe group you will se a histogram of the connected edges of the
probe groups. If you click on a bar the selected probe group will appear in the
circular plot. You can collapse the section probe group through clicking on the
"-" in the header.

SNPs histogram
--------------
In the SNPs section you will find a histogram of all SNPs and the degree
(connection) to other SNPs. If you click on a bar only the direct connections of
this SNP will be shown in the plot. The bar of the selected SNP will be
displayed in green and the connected SNPs will be displayed in red. If you click
on the text of the SNP a prompt window with common literature will open where
you could search for additional information. You can also collapse the SNPs
histogram if you like.

SNPs Pairs list
---------------
The SNPs Pairs section lists all the links. You can sort the links by the
selected statistical test in the "Sort by" dropbox. If you select a specific
area of p-value on the axis or select a probe group only these SNP-links will be
listed. You can also highlight a link in the SNPs Pairs section through clicking
on the desired connection in the plot. If you want to ge more information about
a specific link you only have to click on the link in the SNPs Pairs section and
a ROC plot and a contingency table will appear. You can also collapse the
section here if you like.

Zoom function
-------------
If you select a Chromosome in the top of the page, a specific start base, end
base and click on the zoom button you will receive a circular plot which
selected area. 
