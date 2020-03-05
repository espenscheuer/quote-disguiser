from http.server import BaseHTTPRequestHandler
from bs4 import BeautifulSoup
import urllib
import requests
import json

def check(original, text):
  text = urllib.parse.quote(text)
  text = '/"' + text + '/"'
  url = 'https://google.com/search?q={}'.format(text)
  response = requests.get(url)
  soup = BeautifulSoup(response.text, 'html.parser')
  for g in soup.find_all(class_='ZINbbc xpd O9g5cc uUPGi'):
    here = original.lower() in g.text.lower()
    if here:
      return(g.text)
  return 'No results found'

class handler(BaseHTTPRequestHandler):
  def do_GET(self):
    url_item = urllib.parse.urlparse(self.path)
    params = urllib.parse.parse_qs(url_item.query)
    if (params and 'original' in params and 'text' in params):
      self.send_response(200)
      self.send_header('Content-type', 'text/plain')
      self.end_headers()
      self.wfile.write(str(check(params['original'][0], params['text'][0])).encode())
    else:
      self.send_response(400)
      self.send_header('Content-type', 'text/plain')
      self.end_headers()
      self.wfile.write(str('Please provide original and text').encode())
    return

  def do_POST(self):
    content_length = int(self.headers.get('Content-Length'))
    raw_data = self.rfile.read(content_length)
    data = json.loads(raw_data.decode())
    if (data and 'original' in data and 'text' in data):
      print("recieved")
      self.send_response(200)
      self.send_header('Content-type', 'text/plain')
      self.end_headers()
      print(str(check(data['original'], data['text'])))
      self.wfile.write(str(check(data['original'], data['text'])).encode())
    else:
      self.send_response(400)
      self.send_header('Content-type', 'text/plain')
      self.end_headers()
      self.wfile.write(str('Please provide original and text').encode())
    return