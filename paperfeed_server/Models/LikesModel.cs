using System;
using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;

namespace Paperfeed.Models
{
    public class Likes
    {
        // - Id is equal to article ID
        [Required]
        public ObjectId Id { get; set; }

        [Required]
        public Like[] AllLikes { get; set; }
    }


    public class Like
    {
        [Required]
        public string Author { get; set; }

        public DateTime Timestamp { get; set; }
    }
}