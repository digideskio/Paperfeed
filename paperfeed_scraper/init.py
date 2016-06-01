from pymongo import MongoClient

client = MongoClient('localhost', 27017)
db = client.api
urlsCollection = db['urls']

urls = [

{
"Source": "Itavisen",
"Link":"http://itavisen.no/feed/",
"Category": "Tech",
"Country": "Norway"
},
{
"Source": "NRK",
"Link":"http://www.nrk.no/toppsaker.rss",
"Category": "Front",
"Country": "Norway"
},
{
"Source": "Gamer",
"Link":"http://www.gamer.no/feeds/general.xml",
"Category": "Gaming",
"Country": "Norway"
},
{
"Source": "IGN",
"Link":"http://feeds.ign.com/ign/all?format=xml",
"Category": "Gaming",
"Country": "US"
},
{
"Source": "BBC",
"Link":"http://feeds.bbci.co.uk/sport/0/football/rss.xml?edition=uk",
"Category": "Sport",
"Country": "UK"
},
{
"Source": "E24",
"Link":"http://e24.no/rss/",
"Category": "Economy",
"Country": "Norway"
},
{
"Source": "CNN",
"Link":"http://rss.cnn.com/rss/edition.rss",
"Category": "Front",
"Country": "CNN"
}]

def insert(data):
	print "inserting: ", data['Link']
	urlsCollection.insert_one(data)

for url in urls:
	insert(url)
