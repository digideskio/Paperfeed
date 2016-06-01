using MongoDB.Driver;
using Paperfeed.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Microsoft.Ajax.Utilities;
using MongoDB.Bson;

namespace Paperfeed.Controllers
{
    public class ReportController: ApiController
    {
        private static readonly MongoConnector Mc = new MongoConnector();
        private readonly IMongoCollection<Report> _reportCollection = Mc.Database.GetCollection<Report>("reports");

        /*
        * Summary: Submit report 
        */
        [Authorize]
        [HttpPost]
        public async Task<object> Submit(Report model)
        {
            var identity = (ClaimsIdentity)User.Identity;
            var claims = identity.Claims;
            var values = claims.Select(claim => claim.Value).ToList();
            model.ReporterEmail = values[0]; // - User email is stored in claim
            
            model.TimeStamp = DateTime.Now;
            // - If reporter is the victim = fail
            if (model.ReporterEmail == model.VictimEmail)
                return Json(new {Message = $"You can\'t report yourself!", Code = 1}); // - Code = 1 Failed
            if (!ModelState.IsValid)
                return Json(new {Message = "Please fill in required fields", Code = 1}); // - Code = 1 Failed
             // - insert to db
            await _reportCollection.InsertOneAsync(model);
            return Json(new {Message = "Thanks for reporting", Code = 0}); // - Code = 0 OK
        }
    }
}