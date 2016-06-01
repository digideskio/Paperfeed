using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Paperfeed.Models
{
    public class Urls
    {
        [BsonId]
        public ObjectId Id { get; set; }

        public string Category { get; set; }
        public string Source { get; set; }
        public string Link { get; set; }
        public string Country { get; set; }


    }
}