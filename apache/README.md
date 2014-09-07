# Apache 

This is a working example of mounting an external volume (./apache-www) for the (eboraas/apache)[https://registry.hub.docker.com/u/eboraas/apache/] docker image.

Docker Command:

    sudo docker run -p 8080:80 -v $(pwd)/apache-www/:/var/www/ -d eboraas/apache

