"""Run js-beautify on all .js files
https://github.com/einars/js-beautify
"""

import jsbeautifier
import os
import shutil

js_files = [f for f in os.listdir(os.getcwd()) if f.endswith('.js')]
for js_file in js_files:
    print('Beautifying ' + js_file)
    shutil.copy2(js_file, js_file+'.bak')
    new_js = jsbeautifier.beautify_file(js_file)
    new_file = open(js_file, 'w')
    new_file.write(new_js)
    new_file.close()

    
