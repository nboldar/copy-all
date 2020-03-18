# copy-all #
Module for copying content of source directory to specified directory. It copies all content-files and folders, 
even if folder is empty. Structure of source directory is saved. Destination folder is creating, if it exists content of this folder 
is saved.
## Installation ##
`npm i copy-all`    

##  Usage  ##    
`const copyAll = require('copy-all');`    

`copyAll('./sourceDir','./destination').then( data => console.log('all copied')).catch( error => console.error(error));`    

## How it works ##    
Content is copying asynchronously, so function returns Promise. Relative paths resolves from directory where function is called.
