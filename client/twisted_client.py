from twisted.web.server import Site
from twisted.web.resource import Resource
from twisted.internet import reactor
from twisted.web.static import File

# Create a /test web resource which points to the /www directory
# stored within the client folder. This directory contains the example
# webpage that the user will interact with.
root = Resource()
root.putChild("test", File("./www"))
factory = Site(root)

# Enable the webserver and listen on port 9000 
# so we can distinguish this web server to regular 
# port 80 web servers.
reactor.listenTCP(8080, factory)
reactor.run()
