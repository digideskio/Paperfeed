using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace Paperfeed.Models
{
    public class UrlsController : ApiController
    {

        private static readonly MongoConnector Mc = new MongoConnector();
        private readonly IMongoCollection<Urls> _urlsCollection = Mc.Database.GetCollection<Urls>("urls");

        [HttpGet]
        // Use This
        public async Task<object> GetAll()
        {

            var filter = new BsonDocument();
            var list = await _urlsCollection.Find(filter).ToListAsync();
            return list;

        }

        [HttpGet]
        public async Task<object> GetSources()
        {

            var filter = new BsonDocument();
            var fields = Builders<Urls>.Projection.Include(p => p.Source);                           // - Fields that we want to include
            var list = await _urlsCollection.Find(filter).Project(fields).ToListAsync();
            return list;

        }

        /*
        * Summary: Returns a list of sources exclusively for given category 
        */
        [HttpGet]
        public async Task<object> GetSourcesByCategory(string category)
        {

            var filter = Builders<Urls>.Filter.Eq("Category", category);
            var list = await _urlsCollection.Find(filter).ToListAsync();
            return list;

        }

    }
}