# Docker

Repo for docker related work

# Structure

Each of the top level sub directories contains a docker related experiment

# Observations

## boot2docker
boot2docker is the recommended approach for using docker on OSX.

While it is a useful tool for getting started with docker, it has it's limitations.

Specifically, boot2docker spins up a VM for running docker. This is not immediately obvious or very easy to work with for anything but the simplest examples. For example:

* Using docker volumes with boot2docker is very difficult, if not impossible
* Exploring the structure and contents of the various docker layers used to create a container is complex as boot2docker does not store the layer data in the expected place. It is also quite difficult to actually navigate within the boot2docker VM as the ls command does not appear to work reliably - i.e. even with sudo, many directories can not be listed.

The approach I have found to work most reliably and transparently is to use Virtualbox to create an Ubuntu 14.04 64 bit Virtual Machine and install docker within the VM. You can then mount directories containing your docker related work from your host OS into the VM to allow you to continue to use your default editor from the host to edit your docker files. 

# Links

The following links have proved useful while experimenting with docker:

* http://docs.docker.com/installation/ubuntulinux - Installing docker on Ubuntu

* https://docs.docker.com/userguide - Docker User Guides. Read through them all at least once to get a handle on the basic concepts.

* https://www.youtube.com/watch?v=VeiUjkiqo9E - A docker 101 tutorial. Nicely brings together a lot of the common docker tasks and.

* https://docs.docker.com/reference/builder/ - The definitive guide for the commands which can be used in a Dockerfile.

* https://registry.hub.docker.com - The central docker registry of images. This is where you pull and push images to.

* https://github.com/docker-library - The git repos for the Dockerfiles which back the default images in the docker registry. Very useful for sample / example Dockerfiles. https://github.com/docker-library/official-images is the central list for all the images.

* http://blog.thoward37.me/articles/where-are-docker-images-stored - Excellent post on the internals of docker - how and where it stores containers, images and layers.

* http://jpetazzo.github.io/2014/06/23/docker-ssh-considered-evil/ - A good explanation as to why you should not be sshing into a docker container and what the correct alternatives are

* https://github.com/jpetazzo/nsenter - A tool for gaining console access to a docker container without the need for an ssh damon within the container. It is a small tool allowing you to enter into LXC namespaces.  

* https://github.com/boot2docker/boot2docker - Using docker directly from OSX. See comments above on boot2docker. YMMV.

* https://github.com/shipyard/shipyard/wiki/QuickStart - An Open Source web based UI for managing your docker images / containers

* https://github.com/GoogleCloudPlatform/kubernetes - Open source implementation of container cluster management. This is for scaling docker across multiple VMs.
