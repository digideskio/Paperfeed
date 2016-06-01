using MongoDB.Driver;

namespace Paperfeed.Models
{
    public class MongoConnector
    {
        /*Creates mongodb binding to the server*/

        public MongoConnector(string connection = "mongodb://188.166.19.58:27017")
        {
            /*Server IP is 188.166.19.58*/
            //connection = "mongodb://localhost:27017";  // if you want to use local database
            IMongoClient client = new MongoClient(connection);
            Database = client.GetDatabase("api");
        }

        public IMongoDatabase Database { get; set; }
    }
}