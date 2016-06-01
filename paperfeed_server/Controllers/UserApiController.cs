using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Web;
using System.Web.Http;

namespace Paperfeed.Controllers
{
    /*
    * Manages user actions like adding profile avatar
    * Uses JWT auth
    */
    public class UserApiController : ApiController
    {

        [Authorize]
        public object UploadAvatar()
        {
            // - File is stored inside the header
            var file = HttpContext.Current.Request.Files.Count > 0 ? HttpContext.Current.Request.Files[0] : null;

            if (file == null) return Json(new { Message = "No file was provided" });
            var identity = (ClaimsIdentity)User.Identity;
            var claims = identity.Claims;
            var values = claims.Select(claim => claim.Value).ToList();

            if (values.Count == 0)
                return Json(new { Message = "Please sign in!" });

            const string ext = ".png"; //- Always save as png
            var path = System.IO.Path.Combine(HttpContext.Current.Server.MapPath("~/Content/Avatars"), System.IO.Path.GetFileNameWithoutExtension(values[0]) + ext); // - Path location
    
            file.SaveAs(path);  // - Save the file 


            // Notify 
            return Json(new { Message = "You have uploaded successfully!" });
        }

        /*
        * @param email: tells name of the image. Extension is not required.
        @ If email is null it will just return default avatar
        */
        public HttpResponseMessage GetAvatar(string email)
        {
            var response = Request.CreateResponse(HttpStatusCode.OK);
            const string ext = ".png";
            var path = System.IO.Path.Combine(HttpContext.Current.Server.MapPath("~/Content/Avatars"), System.IO.Path.GetFileNameWithoutExtension(email) + ext); // - User Avatar Location
            var common = System.IO.Path.Combine(HttpContext.Current.Server.MapPath("~/Content/Avatars/default.png")); // - Default Image 

            byte[] content;
            try
            {
                 content = System.IO.File.ReadAllBytes(path);
            }
            catch (Exception)
            {

                 content = System.IO.File.ReadAllBytes(common);

            }
            var ms = new System.IO.MemoryStream(content);
            response.Content = new StreamContent(ms);
            response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("image/png");
            return response;

        }

    }
}