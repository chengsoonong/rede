import json

import sys, os
from copy import copy
from operator import itemgetter
from heapq import heappush, heappop
from collections import defaultdict
from itertools import combinations, chain # requires python 2.6+
from optparse import OptionParser


#basename = "teste_name"
#file_name = '/home/cristovao/Desktop/bdWTC.json' 


print "\nenter with /home/path/file.json  and a name for new .json with communities\nfor exemple: python lc_read_json.py file.json (input) file.json (output)\n"
 
try:
    file_name = sys.argv[1];
    basename = sys.argv[2];
except:
     print "\nerror - you should use: python lc_read_json.py file.json (input) file.json (output)\n"

dic_edges_comm={}
dic_edges_json={}

list_edges_json=[]





###########################################################

def swap(a,b):
    if a > b:
        return b,a
    return a,b


def Dc(m,n):
    """partition density"""
    try:
        return m*(m-n+1.0)/(n-2.0)/(n-1.0)
    except ZeroDivisionError: # numerator is "strongly zero"
        return 0.0


class HLC:
    def __init__(self,adj,edges):
        self.adj = adj # node -> set of neighbors
        self.edges = edges # list of edges
        self.Mfactor = 2.0 / len(edges)
        self.edge2cid = {}
        self.cid2nodes,self.cid2edges = {},{}
        self.initialize_edges() # every edge in its own comm
        self.D = 0.0 # partition density
    
    def initialize_edges(self):
        for cid,edge in enumerate(self.edges):
            edge = swap(*edge) # just in case
            self.edge2cid[edge] = cid
            self.cid2edges[cid] = set([edge])
            self.cid2nodes[cid] = set( edge )
    
    def merge_comms(self,edge1,edge2):
        if not edge1 or not edge2: # We'll get (None, None) at the end of clustering
            return
        cid1,cid2 = self.edge2cid[edge1],self.edge2cid[edge2]
        if cid1 == cid2: # already merged!
            return
        m1,m2 = len(self.cid2edges[cid1]),len(self.cid2edges[cid2])
        n1,n2 = len(self.cid2nodes[cid1]),len(self.cid2nodes[cid2])
        Dc1, Dc2 = Dc(m1,n1), Dc(m2,n2)
        if m2 > m1: # merge smaller into larger
            cid1,cid2 = cid2,cid1
        
        self.cid2edges[cid1] |= self.cid2edges[cid2]
        for e in self.cid2edges[cid2]: # move edges,nodes from cid2 to cid1
            self.cid2nodes[cid1] |= set( e )
            self.edge2cid[e] = cid1
        del self.cid2edges[cid2], self.cid2nodes[cid2]
        
        m,n = len(self.cid2edges[cid1]),len(self.cid2nodes[cid1])
        Dc12 = Dc(m,n)
        self.D = self.D + ( Dc12 -Dc1 - Dc2) * self.Mfactor # update partition density
    
    def single_linkage(self, threshold=None, w=None):
        print "clustering..."
        self.list_D = [(1.0,0.0)] # list of (S_i,D_i) tuples...
        self.best_D = 0.0
        self.best_S = 1.0 # similarity threshold at best_D
        self.best_P = None # best partition, dict: edge -> cid
        
        if w == None: # unweighted
            H = similarities_unweighted( self.adj ) # min-heap ordered by 1-s
        else:
            H = similarities_weighted( self.adj, w )
        S_prev = -1
        
        # (1.0, (None, None)) takes care of the special case where the last
        # merging gives the maximum partition density (e.g. a single clique).
        for oms,eij_eik in chain(H, [(1.0, (None, None))] ):
            S = 1-oms # remember, H is a min-heap
            if S < threshold:
                break
                
            if S != S_prev: # update list
                if self.D >= self.best_D: # check PREVIOUS merger, because that's
                    self.best_D = self.D # the end of the tie
                    self.best_S = S
                    self.best_P = copy(self.edge2cid) # slow...
                self.list_D.append( (S,self.D) )
                S_prev = S
            self.merge_comms( *eij_eik )
        
        #self.list_D.append( (0.0,self.list_D[-1][1]) ) # add final val
        if threshold != None:
            return self.edge2cid, self.D
        return self.best_P, self.best_S, self.best_D, self.list_D

###########################################################


def similarities_unweighted(adj):
    """Get all the edge similarities. Input dict maps nodes to sets of neighbors.
Output is a list of decorated edge-pairs, (1-sim,eij,eik), ordered by similarity.
"""
    print "computing similarities..."
    i_adj = dict( (n,adj[n] | set([n])) for n in adj) # node -> inclusive neighbors
    min_heap = [] # elements are (1-sim,eij,eik)
    for n in adj: # n is the shared node
        if len(adj[n]) > 1:
            for i,j in combinations(adj[n],2): # all unordered pairs of neighbors
                edge_pair = swap( swap(i,n),swap(j,n) )
                inc_ns_i,inc_ns_j = i_adj[i],i_adj[j] # inclusive neighbors
                S = 1.0 * len(inc_ns_i&inc_ns_j) / len(inc_ns_i|inc_ns_j) # Jacc similarity...
                heappush( min_heap, (1-S,edge_pair) )
    return [ heappop(min_heap) for i in xrange(len(min_heap)) ] # return ordered edge pairs


###########################################################


def read_edgelist_unweighted(filename,delimiter,nodetype=str):
    """reads two-column edgelist, returns dictionary
mapping node -> set of neighbors and a list of edges
"""
    
    adj = defaultdict(set) # node to set of neighbors
    edges = set()
    for line in filename:
        L = line.strip().split(delimiter)

        ni,nj = nodetype(L[0]),nodetype(L[1]) # other columns ignored
        if ni != nj: # skip any self-loops...
            edges.add( swap(ni,nj) )
            adj[ni].add(nj)
            adj[nj].add(ni) # since undirected
    return dict(adj), edges

###########################################################

def write_edge2cid(e2c,filename,delimiter="\t"):
    """writes the .edge2comm, .comm2edges, and .comm2nodes files"""
    
    global dic_edges_comm
    
    #list_edges_comm=[]
    string1=""
    string2=""
    
    # renumber community id's to be sequential, makes output file human-readable
    c2c = dict( (c,i+1) for i,c in enumerate(sorted(list(set(e2c.values())))) ) # ugly...
    
    # write edge2cid three-column file:
    f = open(filename+".edge2comm.txt",'w')
    for e,c in sorted(e2c.iteritems(), key=itemgetter(1)):

        #list_edges_comm.append(( "%s%s%s\n" % (str(e[0]),delimiter,str(e[1])) , "%s" % (str(c2c[c])          ))

        string1=str(e[0])+" "+str(e[1])
        string2=str(c2c[c])

        dic_edges_comm[string1]=string2

              
        #list_edges_comm.append( (string1,string2))
        
        f.write( "%s%s%s%s%s\n" % (str(e[0]),delimiter,str(e[1]),delimiter,str(c2c[c])) )
    f.close()
    
    cid2edges,cid2nodes = defaultdict(set),defaultdict(set) # faster to recreate here than
    for edge,cid in e2c.iteritems(): # to keep copying all dicts
        cid2edges[cid].add( edge ) # during the linkage...
        cid2nodes[cid] |= set(edge)
    cid2edges,cid2nodes = dict(cid2edges),dict(cid2nodes)
    
    # write list of edges for each comm, each comm on its own line
    # first entry of each line is cid
    f,g = open(filename+".comm2edges.txt", 'w'),open(filename+".comm2nodes.txt", 'w')
    for cid in sorted(cid2edges.keys()):
        strcid = str(c2c[cid])
        nodes = map(str,cid2nodes[cid])
        edges = ["%s,%s" % (ni,nj) for ni,nj in cid2edges[cid]]
        f.write( delimiter.join([strcid] + edges) )
        f.write( "\n" )
        g.write( delimiter.join([strcid] + nodes) )
        g.write( "\n" )
    f.close()
    g.close()

  #  return list_edges_comm


###########################################################



def edges_list_from_json(filename, subg_id):
    """this read the edges of a subgraph and return a list with this edges"""
    #global dic_edges_json
    #str1=""
    #str2=""
    global list_edges_json
    
    #json_data=open('/home/cristovao/Desktop/t2dWTC.json')
    json_data=open(filename)

    data = json.load(json_data)
    
    edges_list=[]
    
    j=0    
    n=1
    
    
    for i in data['links']:
      
      #if data['nodes'][ i.get("source")].get("subgraph_id")==1:
      if i.get("subgraph_id")==subg_id:   
          edges = "chr"+str(data['nodes'][ i.get("source")].get("chrom"))+":"+ str(data['nodes'][ i.get("source")].get("bp_position"))\
          +" "\
          +"chr"+str(data['nodes'][ i.get("target")].get("chrom"))+":"+ str(data['nodes'][ i.get("target")].get("bp_position"))

          #str1=edges
          #str2=json.dumps(data['links'][j])

          #dic_edges_json[str1]=str2
            
          list_edges_json.append(  (edges , json.dumps(data['links'][j]))   )  

          #print n, edges, json.dumps(data['links'][j])
          #print j+1, edges, json.dumps(data['links'][j])
          n=n+1
          edges_list.append(edges)
      j=j+1
      
      
      
    json_data.close()
    
    return  edges_list





 







###########################################################

#1 find how many subgrahs there is in .json


def subgrhs_json(filename):
    """this function return a dic with the key representing the subgraph and content the
        number of edges in regarding to the subgraph"""
    
    json_data=open(filename)

    data = json.load(json_data)

    list_all_subg=[]
    
    for i in data['links']:
        #print i.get("subgraph_id")
        list_all_subg.append(i.get("subgraph_id"))

    list_all_subg.sort()
        
    max_v=max(list_all_subg)
    min_v=min(list_all_subg)

    dic_subg_content={} #key is N subgraph and conteudo is total elements in subgraph
    
    while min_v<max_v:

        key=min_v
        cont=list_all_subg.count(min_v)
        
        dic_subg_content[key]=cont
        
        for i in range(cont):
            list_all_subg.remove(key)

        min_v=min(list_all_subg)
    
    dic_subg_content[max_v]=list_all_subg.count(max_v)
    
    return dic_subg_content
        

def communties_json(filename):
    """this function return a dic with the key representing the subgraph and content the
        number of edges in regarding to the subgraph"""
    
    json_data=open(filename)

    data = json.load(json_data)

    list_all_comm=[]
    
    for i in data['links']:       
        list_all_comm.append(i.get("comm_id"))

    list_all_comm.sort()
        
    max_v=max(list_all_comm)
    min_v=min(list_all_comm)

    dic_comm_content={} #key is N subgraph and conteudo is total elements in subgraph
    
    while min_v<max_v:

        key=min_v
        cont=list_all_comm.count(min_v)
        
        dic_comm_content[key]=cont #imp - I M P bug
        
        for i in range(cont):
            list_all_comm.remove(key)

        min_v=min(list_all_comm)
    
    dic_comm_content[max_v]=list_all_comm.count(max_v)
    
    return dic_comm_content





###########################################################

print "# loading network from edgelist..."

#1 find how many subgrah there is in .json 

list_input_edges=[]

for i in subgrhs_json(file_name):
    #print i,subgrhs_json(file_name)[i]  
    list_input_edges.append(edges_list_from_json(file_name,i))


n=1
for i in list_input_edges:

    adj,edges = read_edgelist_unweighted(i, " ")
    
    # run the method:

    edge2cid,S_max,D_max,list_D = HLC( adj,edges ).single_linkage() #ok

    f = open("%s_subgraph_id%s_thr_D.txt" % (basename,n),'w')
    for s,D in list_D:
        print >>f, s, D
    f.close()
    print "# D_max = %f\n# S_max = %f" % (D_max,S_max)

    write_edge2cid( edge2cid,"%s_subgraph_id%s_maxS%f_maxD%f" % (basename,n,S_max,D_max), delimiter=" " )

    n=n+1

#dic_edges_comm= dict(list_edges_comm)





###########################################################









def test ():
    l=1
    for i in dic_edges_comm:

        print l,i
        l=l+1



    dic_edges_json= dict(list_edges_json)

    l=1
    for j in dic_edges_json:

        print l,dic_edges_json[j]
        l=l+1



        
def json_comm (filename):
    
    dic_edges_json= dict(list_edges_json)
    list_json_comm=[]

    #{"source": 14, "subgraph_id": 1, "weight": 7.1299999999999999, "target": 373}

    d={}
    for j in dic_edges_json: #create 2 key with the same value i.e.  "snp1 snp2":value_x and "snp2 snp1":value_x 
        chave=j.split(" ")
        d[chave[1]+" "+chave[0]]= dic_edges_json[j]
        
    for j in d:
        dic_edges_json[j]=d[j]


    
    json_data=open(filename)

    data = json.load(json_data)

    
    #ff = open("test1_json.json", 'w')
    #ff.write( json.dumps(data))
    #ff.close()

    #json.dump(data,open("bdWTC.json", 'w'))
    
#    s_in= '{"directed": false, "graph": [], "nodes": ['
	
    f = open(basename+".json", 'w')

    f.write( '{"directed": false, "graph": [], "nodes": [' )
    
    si= '{"directed": false, "graph": [], "nodes": ['
    
    str_file=""
    
    for i in data['nodes']:
        str_file=str_file+json.dumps(i)+", "
        
    str_file=str_file[:-2]

    f.write(str_file+'], "links": [')

    si=si+str_file+'], "links": ['
    

    str_file=""
    #n=1
    for i in dic_edges_comm:

         #print n,dic_edges_json[i].replace("}",', "comm_id": '+str(dic_edges_comm[i])+"}")
         #n=n+1
         str_file=str_file+dic_edges_json[i].replace("}",', "comm_id": '+dic_edges_json[i].split(" ")[3][:-1]+"."+str(dic_edges_comm[i])+"}")+", "

	 #print dic_edges_json[i].replace("}",', "comm_id": '+dic_edges_json[i].split(" ")[3][:-1]+"."+str(dic_edges_comm[i])+"}")+", "
    
    
    str_file=str_file[:-2]
    
    str_file=str_file+'], "multigraph": false}'    

    f.write(str_file)    

    f.close()
    json_data.close()	

    
    str_file2=', "communities": {'
    
    json_data2=open(basename+".json")

    data2 = json.load(json_data2)
    
    dd=communties_json(basename+".json")

    for i in data2['links']:
	si=si+json.dumps(i)[:-1]+', "edgs_in_comm":'+ str(dd[i['comm_id']])+"},"  
    
    si=si[:-1]+'], "multigraph": false}'
    
    for i in communties_json(basename+".json"):
	print i+":"+communties_json(basename+".json")[i]+", "
	#str_file2=str_file2 +str(i)+":"+str(communties_json(basename+".json")[i])+", "

    #str_file2=str_file2[:-2]
    #str_file=str_file[:-1]
    #str_file=si+str_file+str_file2+"}}"
    

    ft = open(basename+"_test.json", 'w')

    ft.write( si )

    ft.close()










    
    return list_json_comm    

       


json_comm(file_name)




os.system("rm -rf "+ basename+"*.txt") #remove the output .txt 

