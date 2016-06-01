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
    public class ArticlesController : ApiController
    {
        private static readonly MongoConnector Mc = new MongoConnector();
        private readonly IMongoCollection<Articles> _articleCollection = Mc.Database.GetCollection<Articles>("articles");
        private readonly IMongoCollection<Comments> _commentCollection = Mc.Database.GetCollection<Comments>("comments");
        private readonly IMongoCollection<Likes> _likesCollection = Mc.Database.GetCollection<Likes>("likes");


        /*
        * GET: api/articles?{id:ObjectID}
        * Summary: Returns all documents stored in our database
        */

        [HttpGet]
        public async Task<object> All()
        {


            IMongoCollection<Articles> collection = Mc.Database.GetCollection<Articles>("articles");

            var filter = new BsonDocument();
            using (var cursor = await _articleCollection.FindAsync(filter))
            {
                while (await cursor.MoveNextAsync())
                {
                    var batch = cursor.Current;
                    return batch;
                }
            }
            return Json(new {Message = "Unnable to get articles!"});
        }


        /*
        * GET: api/articles/category/{category}?skip:int&limit:int
        * @param type: category to query
        * ? params OPTIONAL
        * Summary: Querying article category, possible to limit and skip documents
        */

        [HttpGet]
        public async Task<object> Category(string category, int skip = 0, int limit = 0)
        {
            var filter = Builders<Articles>.Filter.Eq("category", category);
            // Filter query, case sensevite eg front will return [], but Front will work

            var list = await _articleCollection.Find(filter)
                //.SortByDescending(x => x.Id)
                .Skip(skip).Limit(limit)
                .ToListAsync();
            return list;
        }

        /*
        * POST: api/articles/comment?{id:ObjectID}&{comment:string}
        * @id : id of the article to post comment on
        * @comment : comment to post
        * Summary : Comment on an article
        */

        [HttpPost]
        [Authorize]
        public async Task<object> Comment(string id, string comment)
        {
            if (string.IsNullOrWhiteSpace(comment))
            {
                return Json(new {Message = "Please type something!"});
            }

            // - User Info is stored in the claim
            var identity = (ClaimsIdentity) User.Identity;
            var claims = identity.Claims;
            var values = claims.Select(claim => claim.Value).ToList();

            if (values.Count == 0)
            {
                return Json(new {Message = "Please sign in!"});
            }

            // - Looks like everything is OK

            var c = new Comment
            {
                Author = values[0], //user name returned by jwt
                Text = comment,
                Timestamp = DateTime.UtcNow
            };

            var filter = Builders<Comments>.Filter.Eq("_id", new ObjectId(id)); // FIND THE DOCUMENT
            var update = Builders<Comments>.Update.Push(x => x.AllComments, c); // PUSH NEW COMMENT TO THE LIST


            var result = await _commentCollection.UpdateOneAsync(filter, update); //UPDATE DOCUMENT

            //- If there are no documents that has been updated, we need to insert it.
            if (result.ModifiedCount != 0) return Json(new {Message = "Thanks for your comment!"});
            var d = new Comments
            {
                Id = new ObjectId(id),
                AllComments = new[] {c}
            };
            await _commentCollection.InsertOneAsync(d);

            return Json(new {Message = "Thanks for your comment!"});
        }


        /*
        * GET: api/articles/comments?{id:ObjectID}
        * @id : id of the article
        * Summary : Finds all comments bound to give article.
        */

        [HttpGet]
        public async Task<object> Comments(string id)
        {
            var filter = Builders<Comments>.Filter.Eq("_id", new ObjectId(id)); // FIND THE DOCUMENT

            var result = await _commentCollection.Find(filter).ToListAsync(); //FIND THE DOCUMENT

            return result;
        }

        /*
        * POST: /api/articles/like?{id:ObjectID}
        * @id : id of the article
        * Summary : Like an article
        */

        [HttpPost]
        [Authorize]
        public async Task<object> Like(string id)
        {
            //- User Info is stored in the claim
            var identity = (ClaimsIdentity) User.Identity;
            var claims = identity.Claims;
            var values = claims.Select(claim => claim.Value).ToList();

            if (values.Count == 0)
                return Json(new {Message = "Please sign in!"});

            var c = new Like
            {
                Author = values[0],
                Timestamp = DateTime.UtcNow
            };

            var filter = Builders<Likes>.Filter.Eq("_id", new ObjectId(id)); // FIND THE DOCUMENT
            var update = Builders<Likes>.Update.Push(x => x.AllLikes, c); // PUSH NEW LIKE TO THE LIST


            var result = await _likesCollection.UpdateOneAsync(filter, update); //UPDATE DOCUMENT

            if (result.ModifiedCount != 0) return Json(new {Message = "You have liked a post!"});

            // - When update failed = document doesnt exists, we need to create it
            var d = new Likes
            {
                Id = new ObjectId(id),
                AllLikes = new[] {c} // Creates new list
            };
            // - If there are no documents that has been updated, we need to insert it.
            await _likesCollection.InsertOneAsync(d);

            return Json(new {Message = "You have liked a post!"});
        }

        /*
        * GET: api/articles/liked?{id:ObjectID}
        * @id : id of the article
        * Summary : Returns all likes
        */

        [HttpGet]
        [Authorize]
        public async Task<object> Liked(string id)
        {
            var filter = Builders<Likes>.Filter.Eq("_id", new ObjectId(id)); // FIND THE DOCUMENT

            var result = await _likesCollection.Find(filter).ToListAsync(); //FIND THE DOCUMENT

            return result;
        }

        /*
        * GET: api/articles/loadmore?id={ObjectID:string}&category={string}&filters={string}&filters={string}...
        * @param filters accepts array of strings, we can pass many filters, example: /api/articles/loadmore?...&filters=VG&filters=NRK&Filters=CNN
        * @param id: id of the last article that we have, if null, it will return from first document
        * @param category: category of articles that we want
        * Summary : Returns x amount of articles based on given id, accepts filters aswell using linq
        */

        [HttpGet]
        //[Authorize]
        public async Task<object> LoadMore(string id, string category, [FromUri] string[] filters = null)
        {
            // - if id is not given => just retun x amount starting from the first document
            FilterDefinition<Articles> filter;
            if (id.IsNullOrWhiteSpace())
            {
                //return Category(category, 0, 10);

                filter = Builders<Articles>.Filter.Eq("Category", category);
                // Filter query, case sensevite eg front will return [], but Front will work

                var list = await _articleCollection.Find(filter)
                    .SortByDescending(x => x.Id)
                    .ToListAsync();
                // - Returns documents only if filter is not containing the same Source
                return list.Where(u => !filters.Contains(u.Source)).Take(10);
            }


            // - db.articles.find({_id: {$gt: ObjectId("572d19aa253d7032bc2950f1" )}}).sort({_id:1}).limit(10);
            // - id field also holds a timestamp, we can use Lt (lett than) to find all documents greater than this document
            filter = Builders<Articles>.Filter.Lt("_id", new ObjectId(id)) &
                     Builders<Articles>.Filter.Eq("Category", category);

            var result = await _articleCollection.Find(filter)
                .SortByDescending(x => x.Id)
                .ToListAsync();

            // - Returns documents only if filter is not containing the same Source
            return result.Where(u => !filters.Contains(u.Source)).Take(5);

        }

        //Hent ut antall artikler i databasen, returner til viewet
        [HttpGet]
        public int artnum()
        {
            Articles art = new Articles();
            IMongoCollection<Articles> collection = Mc.Database.GetCollection<Articles>("articles");
            var filter = new BsonDocument();
            var numOfArticles = collection.Count(filter);
            int n = (int) (numOfArticles);
            return n;

        }

        //[Authorize]
        public async Task<object> GetNewerArticles(string id, string category, [FromUri] string[] filters = null)
        {
            // - db.articles.find({_id: {$gt: ObjectId("572d19aa253d7032bc2950f1" )}}).sort({_id:1}).limit(10);
            // - id field also holds a timestamp, we can use Gt (greater than) to find all documents newer documents by looking at id field
            FilterDefinition<Articles> filter = Builders<Articles>.Filter.Gt("_id", new ObjectId(id)) &
                                                Builders<Articles>.Filter.Eq("Category", category);

            // - Find all new documents
            var list = await _articleCollection.Find(filter)
                .SortByDescending(x => x.Id)
                .ToListAsync();


            return list.Where(u => !filters.Contains(u.Source));
        }
    }
}
