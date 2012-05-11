
from google.appengine.ext.webapp import template
from google.appengine.ext import webapp
from google.appengine.ext import db
from google.appengine.ext.webapp.util import run_wsgi_app

#from django.utils import simplejson
import json as simplejson

from datetime import datetime
import os, Cookie

# use rest from http://code.google.com/p/appengine-rest-server/
import rest  

import logging

class TodoList(db.Model):
    timestamp = db.DateTimeProperty(auto_now_add=True)

class Todos(db.Model):
    todolist = db.ReferenceProperty(TodoList)
    order = db.IntegerProperty()
    content = db.StringProperty()
    done = db.BooleanProperty()

class MainHandler(webapp.RequestHandler):
    def get(self):
	if self.request.cookies.get('todos', None) == None:
	    todolist = TodoList()
	    todolist.put()
	    cookie = Cookie.SimpleCookie()
	    cookie['todos'] = todolist.key().__str__()
	    cookie['todos']['expires'] = datetime(2014, 1, 1).strftime('%a, %d %b %Y %H:%M:%S')
	    cookie['todos']['path'] = '/'
	    self.response.headers.add_header('Set-Cookie', cookie['todos'].OutputString())
	path = os.path.join(os.path.dirname(__file__), 'index.html')
	self.response.out.write(template.render(path, None))

	
application = webapp.WSGIApplication([
				     ('/', MainHandler),
                     ('/rest/.*', rest.Dispatcher)
], debug=True)


# tell the Dispatcher to output JSON instead of XML
rest.Dispatcher.output_content_types = [rest.JSON_CONTENT_TYPE]

# set the base_url
rest.Dispatcher.base_url = "/rest"

# add the Todo model
rest.Dispatcher.add_models({
            "Todos": Todos
        })

# the authorizer will make it so you only see your own Todos.
# rest.Dispatcher.authorizer = MyAuthorizer()


def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()


