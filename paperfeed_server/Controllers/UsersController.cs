using System.IO;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity.Owin;
using MongoDB.Driver;
using Paperfeed.Models;
using MongoDB.Bson;

namespace Paperfeed.Controllers
{
    [Authorize(Roles = "Admin")]
    public class UsersController : Controller
    {
        public UsersController()
        {
        }

        //
        // GET: /Users/
        public async Task<ActionResult> Index()
        {
            var users = await IdentityContext.Users.Find(u => true).ToListAsync();
            return View(users);
        }

        //
        // GET: /Users/Details/5
        public async Task<ActionResult> Details(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            var user = await UserManager.FindByIdAsync(id);

            ViewBag.RoleNames = await UserManager.GetRolesAsync(user.Id);

            return View(user);
        }

        //
        // GET: /Users/Create
        public async Task<ActionResult> Create()
        {
            var roles = await IdentityContext.AllRolesAsync();
            ViewBag.RoleId = new SelectList(roles, "Name", "Name");
            return View();
        }

        //
        // POST: /Users/Create
        [HttpPost]
        public async Task<ActionResult> Create(RegisterViewModel userViewModel, params string[] selectedRoles)
        {
            var roles = await IdentityContext.AllRolesAsync();
            if (ModelState.IsValid)
            {
                var user = new ApplicationUser {UserName = userViewModel.Email, Email = userViewModel.Email};
                var adminresult = await UserManager.CreateAsync(user, userViewModel.Password);

                //Add User to the selected Roles 
                if (adminresult.Succeeded)
                {
                    if (selectedRoles == null) return RedirectToAction("Index");
                    var result = await UserManager.AddUserToRolesAsync(user.Id, selectedRoles);
                    if (result.Succeeded) return RedirectToAction("Index");
                    ModelState.AddModelError("", result.Errors.First());
                    ViewBag.RoleId = new SelectList(roles, "Name", "Name");
                    return View();
                }
                ModelState.AddModelError("", adminresult.Errors.First());
                ViewBag.RoleId = new SelectList(roles, "Name", "Name");
                return View();
            }
            ViewBag.RoleId = new SelectList(roles, "Name", "Name");
            return View();
        }

        //
        // GET: /Users/Edit/1
        public async Task<ActionResult> Edit(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            var user = await UserManager.FindByIdAsync(id);
            if (user == null)
            {
                return HttpNotFound();
            }

            var userRoles = await UserManager.GetRolesAsync(user.Id);

            var roles = await IdentityContext.AllRolesAsync();
            return View(new EditUserViewModel
            {
                Id = user.Id,
                Email = user.Email,
                RolesList = roles.Select(x => new SelectListItem
                {
                    Selected = userRoles.Contains(x.Name),
                    Text = x.Name,
                    Value = x.Name
                })
            });
        }

        //
        // POST: /Users/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "Email,Id")] EditUserViewModel editUser,
            params string[] selectedRole)
        {
            if (ModelState.IsValid)
            {
                var user = await UserManager.FindByIdAsync(editUser.Id);
                if (user == null)
                {
                    return HttpNotFound();
                }

                user.UserName = editUser.Email;
                user.Email = editUser.Email;

                var userRoles = await UserManager.GetRolesAsync(user.Id);

                selectedRole = selectedRole ?? new string[] {};

                var result = await UserManager.AddUserToRolesAsync(user.Id, selectedRole.Except(userRoles).ToList());

                if (!result.Succeeded)
                {
                    ModelState.AddModelError("", result.Errors.First());
                    return View();
                }
                result = await UserManager.RemoveUserFromRolesAsync(user.Id, userRoles.Except(selectedRole).ToList());

                if (result.Succeeded) return RedirectToAction("Index");
                ModelState.AddModelError("", result.Errors.First());
                return View();
            }
            ModelState.AddModelError("", "Something failed.");
            return View();
        }

        //
        // GET: /Users/Delete/5
        public async Task<ActionResult> Delete(string id)
        {

            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            var user = await UserManager.FindByIdAsync(id);
            if (user == null)
            {
                return HttpNotFound();
            }
            return View(user);
        }

        //
        // POST: /Users/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(string id)
        {
            if (!ModelState.IsValid) return View();
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            var user = await UserManager.FindByIdAsync(id);
            if (user == null)
            {
                return HttpNotFound();
            }
            var result = await UserManager.DeleteAsync(user);
            if (result.Succeeded) return RedirectToAction("Index");
            ModelState.AddModelError("", result.Errors.First());
            return View();
        }

        public object GetUserProfile(string email)
        {
            return Json(new { Message = "Please sign in!" });
        }


        private static readonly MongoConnector Mc = new MongoConnector();
        private readonly IMongoCollection<Report> _reportCollection = Mc.Database.GetCollection<Report>("reports");
        private readonly IMongoCollection<ApplicationUser> _userCollection = Mc.Database.GetCollection<ApplicationUser>("users");
        [HttpPost]
        public async Task<ActionResult> EnableLockout(string input)
        {
            //Create filter by using articleId passed by javascript
            var idFilter = Builders<Report>.Filter.Eq("_id", new ObjectId(input));
            //Find document using filter
            var reportDocument = _reportCollection.Find(idFilter).ToList();
            //Find out who got reported
            var emailArray = reportDocument.Select(t => t.VictimEmail).ToArray();
            var email = emailArray[0];


            //Find this user inside users-collection, lock user and remove report as it've been dealt with
            var userFilter = Builders<ApplicationUser>.Filter.Eq("Email", email);
            var update = Builders<ApplicationUser>.Update.Set("LockoutEnabled", true);
            await _userCollection.UpdateOneAsync(userFilter, update);

            _reportCollection.FindOneAndDelete(idFilter);         

            //DONE: Man må refreshe siden for å se at reporten er borte fra lista, fiks dette så man slipper
           
            return RedirectToAction("Report","Admin");
        }



        #region Helpers

        public UsersController(ApplicationUserManager userManager, ApplicationRoleManager roleManager)
        {
            UserManager = userManager;
            RoleManager = roleManager;
        }

        public ApplicationIdentityContext IdentityContext
            => HttpContext.GetOwinContext().GetUserManager<ApplicationIdentityContext>();

        private ApplicationUserManager _userManager;

        public ApplicationUserManager UserManager
        {
            get { return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>(); }
            private set { _userManager = value; }
        }

        private ApplicationRoleManager _roleManager;

        public ApplicationRoleManager RoleManager
        {
            get { return _roleManager ?? HttpContext.GetOwinContext().Get<ApplicationRoleManager>(); }
            private set { _roleManager = value; }
        }

        #endregion
    }
}