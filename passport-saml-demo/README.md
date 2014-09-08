# Passport SAML Example

Node.js source code based on https://github.com/bergie/passport-saml/blob/master/examples/login

Dockerfile based on https://registry.hub.docker.com/_/node/

To run:

    sudo docker run -d -p 3000:3000 -v $(pwd):/usr/src/myapp -w /usr/src/myapp node:0.10.31 node app.js