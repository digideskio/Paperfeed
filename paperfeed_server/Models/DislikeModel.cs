using System;
using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;

namespace Paperfeed.Models
{
    public class Dislikes
    {
        // - Id is equal to article ID
        [Required]
        public ObjectId Id { get; set; }

        [Required]
        public Like[] AllDislikes { get; set; }
    }


    public class Dislike
    {
        [Required]
        public string Author { get; set; }

        public DateTime Timestamp { get; set; }
    }
}