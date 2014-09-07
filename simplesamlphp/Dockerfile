FROM eboraas/apache-php

MAINTAINER John Frizelle <johnfriz@gmail.com>

# Install additional PHP modules requied my simplesamlphp
RUN apt-get update
RUN DEBIAN_FRONTEND noninteractive apt-get -yq install mcrypt php5-mcrypt php5-ldap php5-radius php5-memcache

# Override the apache default site file to add an alias for simplesamlphp
ADD ./docker-source/default-site /etc/apache2/sites-available/default

# Define a volume for the simplesamlphp application
VOLUME /var/simplesamlphp