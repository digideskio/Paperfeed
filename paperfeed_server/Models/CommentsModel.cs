using System;
using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;

namespace Paperfeed.Models
{
    public class Comments
    {
        // - Id is equal to article ID
        [Required]
        public ObjectId Id { get; set; }

        [Required]
        public Comment[] AllComments { get; set; }
    }


    public class Comment
    {
        [Required]
        public string Author { get; set; }

        [Required]
        public string Text { get; set; }

        public DateTime Timestamp { get; set; }
    }
}