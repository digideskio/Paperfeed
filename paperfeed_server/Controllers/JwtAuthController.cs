using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using JWT;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Paperfeed.Models;
using SignInStatus = Paperfeed.SignInStatus;

namespace Paperfeed.Controllers
{
    /*
    * Login controller as  AccountController is not equal to this class as we don't need cookies
    */
    public class JwtAuthController : Controller
    {
        public JwtAuthController()
        {
            
        }
        public async Task<object> Login(LoginViewModel model)
        {
            // - Clear Cookies as we are not using cookie based auth
            if (ModelState.IsValid)
            {
                /*validate user*/
                var result = await SignInHelper.JwtSignIn(model.Email, model.Password); // <--- This won't use cookies as authorization

                switch (result)
                {
                    case SignInStatus.Success:
                        /*
                        * Takes the username and password and returns a valid jwt token
                        * This token then can be used to request secured data
                        */
                        Session.Abandon();
                        return GenerateToken(model.Email, model.Password);

                    case SignInStatus.LockedOut:
                        Response.StatusCode = 400;
                        return Json(new { Message = "Banned", Code = 1 });
                    case SignInStatus.RequiresTwoFactorAuthentication:
                        break;
                    case SignInStatus.Failure:
                        return Json(new { Message = "Try later", Code = 1 });
                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }
            Response.StatusCode = 400;
            return Json(new {Message = "Wrong username/email", Code = 1});
        }

        // POST: /Account/Register
        [HttpPost]
        [AllowAnonymous]
        public async Task<object> Register(RegisterViewModel model)
        {
            if (!ModelState.IsValid) return Json(new {Error = "Invalid Data"});
            var user = new ApplicationUser {UserName = model.Email, Email = model.Email};
            /*Create new user if only the form is valid*/
            var result = await UserManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                Response.StatusCode = 400;
                return Json(new {Error = result.Errors});
            }

            Session.Abandon();
            return GenerateToken(model.Email, model.Password);
        }

        #region Helpers

        /*
        * Helpers for easily authenticating
        */

        public JwtAuthController(ApplicationUserManager userManager)
        {
            UserManager = userManager;
        }

        private ApplicationUserManager _userManager;

        public ApplicationUserManager UserManager
        {
            get { return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>(); }
            private set { _userManager = value; }
        }

        private SignInHelper _helper;

        private SignInHelper SignInHelper => _helper ?? (_helper = new SignInHelper(UserManager, AuthenticationManager));


        public string GenerateToken(string email, string password)
        {
            var payload = new Dictionary<string, object>
            {
                {"claim1", email}, {"claim2", password}
            };

            const string secretKey = "KLFHJDSJHBHR0892FDSSNV";

            var token = JsonWebToken.Encode(payload, secretKey, JwtHashAlgorithm.HS256);

            return token;
        }

        // Used for XSRF protection when adding external logins
        private const string XsrfKey = "assc2f";

        private IAuthenticationManager AuthenticationManager => HttpContext.GetOwinContext().Authentication;

        #endregion
    }
}