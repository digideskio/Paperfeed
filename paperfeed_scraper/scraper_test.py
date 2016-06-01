# coding=utf-8
from bs4 import BeautifulSoup
import requests
from pymongo import MongoClient
from multiprocessing.pool import ThreadPool
import threading
from datetime import datetime
import time

#Variables
num_threads = 4 #number of threads

#Database
client = MongoClient('188.166.19.58', 27017)
db = client.api
urlsCollection = db['urls']

exclude = ['pluss.vg.no']

try:
	articleCollection = db.create_collection('articles', capped = True, max = 1000, size = 5242880)
except:
	articleCollection = db['articles']

#Headers
request_headers = {
"Accept-Language": "en-US,en;q=0.5",
"User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:40.0) Gecko/20100101 Firefox/40.0",
"Content-Type":"Text",
"Connection": "keep-alive"
}

#This method crawls the article itself and gets the image from the facebook or twitter metatag
def getMeta(url):
	req = requests.get(url.strip(), headers=request_headers)
	soup = BeautifulSoup(req.content, 'html.parser')
	image_meta = soup.find(name = 'twitter:image') or soup.find(property = 'og:image')
	description_meta = soup.find(property = 'og:description') or soup.find(name = 'twitter:description')
	if image_meta:
		return image_meta.get('content'), description_meta.get('content').encode('utf-8', errors='replace') or "No Description"
	else:
		refresh_meta = soup.findAll("meta", {"http-equiv": "Refresh"})
		if refresh_meta:
			return getMeta(refresh_meta[0].get('content').replace('0;URL=', ''))
		return "",""



#This method is handled by the thread pool
def worker(url):
	articles = []
	#Request url
	try:
		req = requests.get(url, headers=request_headers)
	except:
		return None

	#Soup the content
	soup = BeautifulSoup(req.content, 'xml')

	# Iter each article
	for item in soup.findAll('item')[0:2]:
		article = {}
		article['Link'] = item.link.text.encode('utf-8')
		if any(e in article.get('Link') for e in exclude):
			return None

		if articleCollection.find(article).count() == 0:
			article['Title'] = item.title.text.encode('utf-8')
			article['Timestamp'] = datetime.utcnow()
			article['Likes'] = 0
			article['Comments'] = 0
			article['Views'] = 0
			try:
				article['Description'] = getMeta(article.get('Link'))[1]
			except:
				article['Description'] = ""
			try:
				article['Tag'] = item.category.text.encode('utf-8')
			except:
				article['Tag'] = ""
			try:
				article['Image'] =  item.image.url.text.encode('utf-8')
			except:
				article['Image'] =  getMeta(article.get('Link'))[0]
			articles.append(article)

	return articles


def init():
	#GET urls from db
	while True:
		url = "http://www.vg.no/rss/feed/forsiden/"
		article = worker(url)
		#print article
		time.sleep(5)


if __name__ == '__main__':
	init()
