using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace Paperfeed.Models
{
    public class Report
    {
        [BsonId]
        public ObjectId Id { get; set; }
        [EmailAddress]
        public string ReporterEmail { get; set; }   // - Who is reporting
        [BsonRequired]
        [EmailAddress]
        public string VictimEmail { get; set; }     // - Victim email
        public bool Negative { get; set; }
        public bool Verbal { get; set; }
        public bool Hate { get; set; }
        [BsonRequired]
        [MaxLength(140)]
        public string Comment { get; set; }        // - What victim has commented
        public DateTime TimeStamp { get; set; }
        [BsonRequired]
        public string ArticleId { get; set; }     // Article he is reported on
        [BsonRequired]
        public string Reason { get; set; }        // - Why he is reported
    }
}
