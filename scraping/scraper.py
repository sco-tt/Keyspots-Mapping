from bs4 import BeautifulSoup                                                   
import urllib2
import requests

buses = BeautifulSoup(urllib2.urlopen('http://www.septa.org/schedules/bus/index.html').read())
matches = buses.find_all("div", class_="route_num")

for x in matches:
    if x.string:
		route = x.string.strip()
		url = 'http://www3.septa.org/transitview/kml/%s.kmz' % route
		r = requests.get(url)
		with open("%s.kml" % route, "wb") as code:
			code.write(r.content)