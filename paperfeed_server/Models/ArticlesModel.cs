using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;


namespace Paperfeed.Models
{
    public class Articles
    {
        [BsonId]
        public ObjectId Id { get; set; }

        public string Title { get; set; }
        public string Category { get; set; }
        public BsonDateTime Timestamp { get; set; }
        public string Country { get; set; }
        [BsonElement]
        public string Source { get; set; }
        public string Tag { get; set; }
        public string Link { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public int Likes { get; set; }
        public int Views { get; set; }
        public int Comments { get; set; }

    }
}
