using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AspNet.Identity.MongoDB;
using MongoDB.Driver;
using Paperfeed.Models;

namespace Paperfeed
{
    public class ApplicationIdentityContext : IDisposable
    {
        private ApplicationIdentityContext(IMongoCollection<ApplicationUser> users, IMongoCollection<IdentityRole> roles)
        {
            Users = users;
            Roles = roles;
        }

        public IMongoCollection<IdentityRole> Roles { get; set; }

        public IMongoCollection<ApplicationUser> Users { get; set; }

        public void Dispose()
        {
        }

        public static ApplicationIdentityContext Create()
        {
            // Mongodb Setup
            var connection = new MongoConnector();
            var database = connection.Database;
            var users = database.GetCollection<ApplicationUser>("users");
            var roles = database.GetCollection<IdentityRole>("roles");
            return new ApplicationIdentityContext(users, roles);
        }

        public Task<List<IdentityRole>> AllRolesAsync()
        {
            return Roles.Find(x => true).ToListAsync();
        }
    }
}