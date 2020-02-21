from http.server import BaseHTTPRequestHandler
from bs4 import BeautifulSoup
import urllib
import requests
import json

def check(original, text):
	text = urllib.parse.quote(text)
	url = 'https://google.com/search?q={}'.format(text)
	response = requests.get(url)
	soup = BeautifulSoup(response.text, 'html.parser')
	for g in soup.find_all(class_='ZINbbc xpd O9g5cc uUPGi'):
		here = original in g.text
		if here:
			return(g.text)
	return ''

class handler(BaseHTTPRequestHandler):
  def do_POST(self):
     content_length = int(self.headers['Content-Length'])
    data = self.rfile.read(content_length)
    self.wfile.write(str(data.decode('utf-8')).encode())
    # url_item = urllib.parse.urlparse(self.path)
    # params = urllib.parse.parse_qs(url_item.query)
    # if (params and 'original' in params and 'text' in params):
    #   self.send_response(200)
    #   self.send_header('Content-type', 'text/plain')
    #   self.end_headers()
    #   result = check(params['original'][0], params['text'][0])
    #   if(result):
    #     self.wfile.write(str(result).encode())
    #   else:
    #     self.wfile.write('No results found all good!'.encode())
    # else:
    #   self.send_response(400)
    #   self.send_header('Content-type', 'text/plain')
    #   self.end_headers()
    #   self.wfile.write(str('Please provide original and text').encode())
    return