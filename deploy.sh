#!/bin/bash

# Chemin de construction Angular
ng build

# Copier les fichiers vers /var/www
sudo cp -r dist/* /var/www/
sudo cp .htaccess /var/www/w2-g/