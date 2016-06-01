using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web;
using System.Web.ModelBinding;
using System.Web.Mvc;
using JWT;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Paperfeed.Models;
using SignInStatus = Paperfeed.SignInStatus;

namespace Paperfeed.Controllers
{
    public class AccountController : Controller
    {
        public AccountController()
        {
        }

        // POST: /Account/Login
        [HttpPost]
        [AllowAnonymous]
        [AllowCrossSiteJson]
        public async Task<string> Login(LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                /*validate user*/
                var result = await SignInHelper.PasswordSignIn(model.Email, model.Password);
               
                if (result == SignInStatus.Success)
                {
                    /*
                    * Takes the username and password and returns a valid jwt token
                    * This token then can be used to request secured data
                    */
                    return GenerateToken(model.Email, model.Password);
                }
            }
            Response.StatusCode = 400;
            Response.StatusDescription = "Invalid User";

            return "Invalid User";
        }


        // POST: /Account/Register
        [HttpPost]
        [AllowAnonymous]
        public async Task<object> Register(RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = new ApplicationUser {UserName = model.Email, Email = model.Email};
                /*Create new user if only the form is valid*/
                var result = await UserManager.CreateAsync(user, model.Password);

                if (result.Succeeded)
                {
                    /*
                    * Takes the username and password and returns a valid jwt token
                    * This token then can be used to request secured data
                    */
                    return GenerateToken(model.Email, model.Password);
                }

                // SHOULD NOT MAKE SO FAR IF EVERYTHING IS OK
                Response.StatusCode = 400;
                return Json(new {Error = result.Errors});
            }

            Response.StatusCode = 400;
            return Json(new {Error = "Invalid Data"});
        }

        #region Helpers

        /*
        * Helpers for easily authenticating
        */

        public AccountController(ApplicationUserManager userManager)
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

        #endregion Helpers

        #region Helpers

        public string GenerateToken(string email, string password)
        {
            var payload = new Dictionary<string, object>
            {
                {"claim1", email},
                {"claim2", password}
            };

            const string secretKey = "KLFHJDSJHBHR0892FDSSNV";

            var token = JsonWebToken.Encode(payload, secretKey, JwtHashAlgorithm.HS256);

            return token;
        }

        public class AllowCrossSiteJsonAttribute : ActionFilterAttribute
        {
            public override void OnActionExecuting(ActionExecutingContext filterContext)
            {
                filterContext.RequestContext.HttpContext.Response.AddHeader("Access-Control-Allow-Origin", "*");
                filterContext.RequestContext.HttpContext.Response.AddHeader("Access-Control-Allow-Methods", "*");

                base.OnActionExecuting(filterContext);
            }
        }

        // Used for XSRF protection when adding external logins
        private const string XsrfKey = "assc2f";

        private IAuthenticationManager AuthenticationManager => HttpContext.GetOwinContext().Authentication;

        #endregion
    }
}