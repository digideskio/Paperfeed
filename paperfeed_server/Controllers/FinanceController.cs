using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.Ajax.Utilities;
using MongoDB.Bson;
using MongoDB.Driver;
using Paperfeed.Models;


namespace Paperfeed.Controllers
{
    public class FinanceController : ApiController
    {

        // GET: api/Finance/{method}
        // Summary: Returns

        private static readonly MongoConnector Mc = new MongoConnector();
        private readonly IMongoCollection<FinanceModel> _currenciesCollection = Mc.Database.GetCollection<FinanceModel>("currencies");
        private readonly IMongoCollection<FinanceModel> _indexesCollection = Mc.Database.GetCollection<FinanceModel>("indexes");

        [HttpGet]
        public async Task<object> Indexes()
        {
            var filter = new BsonDocument();
            using (var cursor = await _indexesCollection.FindAsync(filter))
            {
                while (await cursor.MoveNextAsync())
                {
                    var batch = cursor.Current;
                    return batch;
                }
            }
            return Json(new { Message = "Unnable to get articles!" });
        }

        [HttpGet]
        public async Task<object> Currencies()
        {
            //Return all currency-documents (pira)
            var filter = new BsonDocument();
            using (var cursor = await _currenciesCollection.FindAsync(filter))
            {
                while (await cursor.MoveNextAsync())
                {
                    var batch = cursor.Current;
                    return batch;
                }
            }
            return Json(new { Message = "Unnable to get articles!" });
        }

        // - Returns by default 6 new currencies
        [HttpGet]
        public async Task<object> GetNewestCurrencies(int limit = 6)
        {
            var filter = new BsonDocument();

            var list = await _currenciesCollection.Find(filter)
                .SortByDescending(x => x.Id)
                .Limit(limit)
                .ToListAsync();
            return list;
        }

        // - Returns by default 6 new indexes
        [HttpGet]
        public async Task<object> GetNewestIndexes(int limit = 6)
        {
            var filter = new BsonDocument();

            var list = await _indexesCollection.Find(filter)
                .SortByDescending(x => x.Id)
                .Limit(limit)
                .ToListAsync();
            return list;
        }
    }
}