#!/usr/bin/python

import cgi, os
import cgitb; cgitb.enable()
#import msvcrt
#msvcrt.setmode (0, os.O_BINARY) #stdin = 0
#msvcrt.setmode (1, os.O_BINARY) #stdout = 1



form = cgi.FieldStorage()

def fbuffer(f, chunk_size=10000):
        while True:
            chunk = f.read(chunk_size)
            if not chunk: break
            yield chunk


# Get filename here.
fileitem = form['filename']


# Test if the file was uploaded
if fileitem.filename:
   # strip leading path from file name to avoid 
   # directory traversal attacks
   fn = os.path.basename(fileitem.filename)
   #open('/tmp/' + fn, 'wb').write(fileitem.file.read())
   f = open('' + fn, 'wb').write(fileitem.file.read())
   for chunk in fbuffer(fileitem.file):
            f.write(chunk)
            f.close()

   message = 'The file "' + fn + '" was uploaded successfully'
   
else:
   message = 'No file was uploaded'

#the user upload the files and now we can use our scripts to create the .json file.

#use this to create a new html that will show the downloand link to user get the .json file
print """\
Content-Type: text/html\n
<html>
   <head>
   <link type="text/css" rel="stylesheet" href="../genome.css"/> 
   </head>
   <body>   
   <h5><p>%s</p></h5>
   </body>
</html>
""" % (message,)
