Rede
====

A visualization tool based on [d3.js](http://d3js.org/) for probe pairs arising
in genome wide association studies.  
------------
Requirements 
------------
Browser: [Mozilla Firefox](http://www.mozilla.org/en-US/firefox/new/#) (for
development version 27.0.1 was used).

------------
File format 
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



Elements in "cont_table" are {"unv1": [{"controls":109 ,"cases":86 },
{"controls":131 ,"cases":93 }, {"controls":47 ,"cases":25 }], "unv2":
[{"controls":152 ,"cases":101 }, {"controls":110 ,"cases":91 }, {"controls":25
,"cases":12 }], "biv": [[{"controls":51 ,"cases":55}, {"controls":49
,"cases":26}, {"controls":9 ,"cases":5}],[{"controls":72 ,"cases":37},
{"controls":45 ,"cases":53}, {"controls":14 ,"cases":3}],[{"controls":29
,"cases":9}, {"controls":16 ,"cases":12}, {"controls":2 ,"cases":4}]], "total":
{"controls":287 ,"cases":204 }}

"unv1" corresponds to the univariate table for source "unv2" corresponds to the
univariate table for target "biv" corresponds to the bivariate table "total" is
the total number of individuals



-----
Usage
-----

First you have to open view_graph.html with Mozilla Firefox. After this step you
can click the "Browse..." button and select a json file with the right
format(see section file format). After this step a plot will appear. You can
choose four different types of plots in the "plots" dropbox:

* Circular ideogram
* Manhattan plot
* Heat-map
* Arc plot

Circular ideogram
-----------------
Statistical test:

If you selected the Circular plot a dropbox with the available statistical tests
will appear. The p-values of the SNP interactions will be displayed under the
statistical test dropbox on an axis. You could select an arbitrary area of
values through clicking on the axis and moving the mouse. The selected area is
brushed and you can move it with the mouse afterwards.

Probe groups:

In the section Probe group you will see a histogram of the connected edges of
the probe groups. If you click on a bar the selected probe group will appear in
the circular plot. You can collapse the section probe group through clicking on
the "-" in the header.

SNPs histogram:

In the SNPs section you will find a histogram of all SNPs and the degree of
connection to other SNPs. If you click on a bar only the direct connections of
this SNP will be displayed in the plot. The bar of the selected SNP will be
displayed in green and the connected SNPs will be displayed in red. If you click
on the text of the SNP a prompt window with common literature sources will open
where you can search for additional information of the selected SNP. This
literature window will also appear after clicking on a SNP node in the circular
plot. You can also collapse the SNPs histogram if you like.

SNPs Pairs list:

The SNPs Pairs section lists all the links of the selected dataset. You can sort
the links by the selected statistical test in the "Sort by" dropbox. If you
select a specific area of p-value on the axis or select a probe group only these
SNP-links will be listed. You can also highlight a link in the SNPs Pairs
section through clicking on the desired connection in the plot. If you want to
get more information about a specific link you only have to click on the
paragraph of the link in the SNPs Pairs section and a ROC plot and a contingency
table about this connection will appear above the SNPs section. You can also
collapse the section if you like.

Zoom function:

If you select a chromosome in the top of the page,type a specific start base,
end base and click on the zoom button you will receive a circular plot with the
desired area. All described features in the upper section are also available for
the zoomed plot. If you want to go back to the unzoomed plot press the "Reset"
button.

Manhattan plot
--------------

Like in the circular ideogram you can choose the statistical test in the left
top.

Labeling:

If you push the label button in the right top of the window information to every
node will appear in the plot. You can remove the labels through clicking the
"remove_label" button.

Zoom function:

You can select an area with the mouse in the plot and after pushing the zoom
button in the upper left of the window the selected area will be displayed. The
labeling function is also available for the zoomed area. Through clicking the
"Reset" button you go back to the unzoomed manhattan plot.


Heat-map
--------

If you select the heat-map in the "Plots" dropbox two dropboxes will appear
under the heat-map.  You can select the desired statistical test there. 

Zoom function:

Is working like the zoom function of the manhattan plot. You have also the SNPs
list included with all the features described in the circular plot, excepted
that if you click on the degree-bar not only the selected SNPs will appear.

Arc plot
--------

The arc plot has the same features like the circular plot. Additional to that
you can select a certain area through brushing with the mouse in the plot as
well. For this feature you select a chromosome and push the "zoom" button.
Afterwards you can click on the selected chromosome and mark a desired area.
After that you click on the "zoom" button and you zoomed in the selected area.
To get back at the unzoomed plot you only have to click the "Reset" button.

-------
License
-------

Copyright (&copy;) 2014, National ICT Australia All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
