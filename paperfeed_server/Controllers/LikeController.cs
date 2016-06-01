using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Microsoft.Ajax.Utilities;
using MongoDB.Bson;
using MongoDB.Driver;
using Paperfeed.Models;

namespace Paperfeed.Controllers
{
    // - Like Manager
    public class LikeController : ApiController
    {
        private static readonly MongoConnector Mc = new MongoConnector();
        private readonly IMongoCollection<Likes> _likesCollection = Mc.Database.GetCollection<Likes>("likes");
        private readonly IMongoCollection<Articles> _articleCollection = Mc.Database.GetCollection<Articles>("articles");

        /*
        * GET: api/like/all
        * @id : id of the article 
        * Summary : Returns all likes
        */
        public async Task<object> All()
        {
            var filter = new BsonDocument(); // FIND THE DOCUMENT

            var result = await _likesCollection.Find(filter).ToListAsync(); //FIND THE DOCUMENT

            return result;
        }

        /*
        * POST: /api/like/add
        * @id : id of the article 
        * Summary : Like an article
        */

        [HttpPost]
        [Authorize]
        public async Task<object> Add(string id)
        {
            //- User Info is stored in the claim
            var identity = (ClaimsIdentity)User.Identity;
            var claims = identity.Claims;
            var values = claims.Select(claim => claim.Value).ToList();

            if (values.Count == 0)
                return Json(new { Message = "Please sign in.", Code = 2 }); // - Not Authorized

            var c = new Like
            {
                Author = values[0],
                Timestamp = DateTime.UtcNow
            };

            // - Check if user has liked this post
            var ancestorsQuery = Builders<Like>.Filter.Eq(pr => pr.Author, c.Author);
            var finalQuery = Builders<Likes>.Filter.Eq(p => p.Id, new ObjectId(id)) & Builders<Likes>.Filter.ElemMatch(p => p.AllLikes, ancestorsQuery);
            var allLikes = await _likesCollection.Find(finalQuery).ToListAsync();
            // - Remove user if already liked
            if (allLikes.Count > 0)
            {
                UpdateLikeCount(false, id); // - We need to decrement like count aswell
                return await Dislike(id, c.Author);
            }
                

            // - If initial like
            var filter = Builders<Likes>.Filter.Eq("_id", new ObjectId(id)); // Find filter   
            var update = Builders<Likes>.Update.Push(x => x.AllLikes, c); // Push filter
            var result = await _likesCollection.UpdateOneAsync(filter, update); //Update document

            UpdateLikeCount(true, id); // - We need to increment like count aswell

            if (result.ModifiedCount != 0) return Json(new { Message = "You have liked a post.", Code = 0 }); // - Code = 0 OK

            // - When update failed = document doesnt exists, we need to create it
            var d = new Likes
            {
                Id = new ObjectId(id),
                AllLikes = new[] { c }
            };

            // - If there are no documents that has been updated, we need to insert it.
            await _likesCollection.InsertOneAsync(d);

            return Json(new { Message = "You have liked a post.", Code = 0 });  // - Code = 0 OK
        }
        /*
        * GET: api/like/alluserlikes?email={string}
        * summary: returns only documents where email matches 
        * summary: only posts that the user has liked will be returned
        */

        [HttpGet]
        [Authorize]
        public async Task<object> UserLikes()
        {
            var identity = (ClaimsIdentity)User.Identity;
            var claims = identity.Claims;
            var values = claims.Select(claim => claim.Value).ToList(); // - User creds are stored in claims
            var email = values[0]; 

            var ancestorsQuery = Builders<Like>.Filter.Eq(pr => pr.Author, email);                // - Query for finding only by email
            var finalQuery = Builders<Likes>.Filter.ElemMatch(p => p.AllLikes, ancestorsQuery);   // - Filter for matches where email is true for ancestor
            var fields = Builders<Likes>.Projection.Include(p => p.Id);                           // - Fields that we want to include
            var allLikes = await _likesCollection.Find(finalQuery).Project(fields).ToListAsync(); // - Execute

            return allLikes;
        }


        /*
        * POST: api/like/alluserlikes?email={string}
        * summary: moves user from like collection to dislike collection
        */

        [HttpPost]
        [Authorize]
        public async Task<object> Dislike(string id, string email)
        {
            if (email.IsNullOrWhiteSpace())
            {
                var identity = (ClaimsIdentity)User.Identity;
                var claims = identity.Claims;
                var values = claims.Select(claim => claim.Value).ToList(); // - User creds are stored in claims
                email = values[0];
            }


            var filter = new BsonDocument("_id", new ObjectId(id));
            var update = Builders<Likes>.Update.PullFilter("AllLikes", Builders<Like>.Filter.Eq("Author", email));
            var result = await _likesCollection.UpdateOneAsync(filter, update);

            return  Json(new { Message = "You have disliked the post", Code = 0 });  // - Code = 0 OK
        }

        /*
         * @param inc : true / false - true means increment, false means decrement
         * Summary : Updates likes count
         */
        [HttpPost]
        public void UpdateLikeCount(bool inc, string id)
        {
            var filter = Builders<Articles>.Filter.Eq("_id", new ObjectId(id)); // Find filter
            var update = Builders<Articles>.Update.Inc("Likes", inc ? 1 : -1); // Push filter


            var result =  _articleCollection.FindOneAndUpdate(filter, update); // Update
        }

    }
}