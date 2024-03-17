#!/bin/bash

# Chemin de construction Angular
ng build

# Copier les fichiers vers /var/www
sudo cp -r dist/* /var/www/
