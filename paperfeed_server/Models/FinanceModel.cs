using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

// "Symbol": index, "Time": time.strftime('%Y-%m-%dT%H:%M:%S', time.localtime(time.time())), "Price": idata.get_price()
// post = {"Symbol": curr, "Time": time.strftime('%Y-%m-%dT%H:%M:%S', time.localtime(time.time())), "Price": cdata.get_rate()}

namespace Paperfeed.Models
{
    public class FinanceModel
    {
        [BsonId]
        public ObjectId Id { get; set; }
        [Required]
        public string Symbol { get; set; }
        public string Time { get; set; }
        public string Price { get; set; }
    }
}