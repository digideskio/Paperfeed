using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using AspNet.Identity.MongoDB;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using MongoDB.Bson;
using MongoDB.Driver;
using Paperfeed.Models;

namespace Paperfeed.Controllers
{
		[Authorize(Roles = "Admin")]
		public class AdminController : Controller
		{
      
                public AdminController()
				{
				}

				// GET: /Index/
				[HttpGet]
				[AllowAnonymous]
				public ActionResult Index()
				{
						return View();
				}

				// POST: /Index/
				[HttpPost]
				[AllowAnonymous]
				public async Task<ActionResult> Index(LoginViewModel model)
				{
						if (!ModelState.IsValid) return RedirectToAction("Index", "Admin");
						var result = await SignInHelper.PasswordSignIn(model.Email, model.Password);
						if (result == SignInStatus.Success)
						{
								return RedirectToAction("Home", "Admin");
						}
						return RedirectToAction("Index", "Admin");
				}

				// GET: /Roles/
				public async Task<ActionResult> Roles()
				{
						var roles = await IdentityContext.AllRolesAsync();
						return View(roles);
				}

				//
				// GET: /Roles/Details/5
				public async Task<ActionResult> Details(string id)
				{
						if (id == null)
						{
								return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
						}
						var role = await RoleManager.FindByIdAsync(id);

						// Get the list of Users in this Role
						var users = await IdentityContext.Users.Find(u => u.Roles.Contains(role.Name)).ToListAsync();

						ViewBag.Users = users;
						ViewBag.UserCount = users.Count();
						return View(role);
				}

				//
				// GET: /Roles/Create
				public ActionResult Create()
				{
						return View();
				}

				//
				// POST: /Roles/Create
				[HttpPost]
				public async Task<ActionResult> Create(RoleViewModel roleViewModel)
				{
						if (!ModelState.IsValid) return View();
						var role = new IdentityRole(roleViewModel.Name);
						var roleresult = await RoleManager.CreateAsync(role);
						if (roleresult.Succeeded) return RedirectToAction("Index");
						ModelState.AddModelError("", roleresult.Errors.First());
						return View();
				}

				//
				// GET: /Roles/Edit/Admin
				public async Task<ActionResult> Edit(string id)
				{
						if (id == null)
						{
								return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
						}
						var role = await RoleManager.FindByIdAsync(id);
						if (role == null)
						{
								return HttpNotFound();
						}
						var roleModel = new RoleViewModel {Id = role.Id, Name = role.Name};
						return View(roleModel);
				}

				//
				// POST: /Roles/Edit/5
				[HttpPost]
				[ValidateAntiForgeryToken]
				public async Task<ActionResult> Edit([Bind(Include = "Name,Id")] RoleViewModel roleModel)
				{
						if (!ModelState.IsValid) return View();
						var role = await RoleManager.FindByIdAsync(roleModel.Id);
						role.Name = roleModel.Name;
						await RoleManager.UpdateAsync(role);
						return RedirectToAction("Index");
				}

				//
				// GET: /Roles/Delete/5
				public async Task<ActionResult> Delete(string id)
				{
						if (id == null)
						{
								return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
						}
						var role = await RoleManager.FindByIdAsync(id);
						if (role == null)
						{
								return HttpNotFound();
						}
						return View(role);
				}

				//
				// POST: /Roles/Delete/5
				[HttpPost, ActionName("Delete")]
				[ValidateAntiForgeryToken]
				public async Task<ActionResult> DeleteConfirmed(string id, string deleteUser)
				{
						if (!ModelState.IsValid) return View();
						if (id == null)
						{
								return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
						}
						var role = await RoleManager.FindByIdAsync(id);
						if (role == null)
						{
								return HttpNotFound();
						}
						IdentityResult result;
						if (deleteUser != null)
						{
								result = await RoleManager.DeleteAsync(role);
						}
						else
						{
								result = await RoleManager.DeleteAsync(role);
						}
						if (result.Succeeded) return RedirectToAction("Index");
						ModelState.AddModelError("", result.Errors.First());
						return View();
				}


				public ActionResult Stats()
				{
						return View();
				}

        //private MongoConnector mc = new MongoConnector();
        //public ActionResult Articles()
        //{
        //		Articles art = new Articles();
        //		IMongoCollection<Articles> collection = mc.Database.GetCollection<Articles>("articles");
        //		var filter = new BsonDocument();
        //		var numOfArticles = collection.Count(filter);
        //		//ViewBag.articleNo = numOfArticles;

        //		return View();
        //}
        private static readonly MongoConnector Mc = new MongoConnector();
        private readonly IMongoCollection<Report> _reportCollection = Mc.Database.GetCollection<Report>("reports");

        public ActionResult Home()
        {
            return View();
        }

        // Admin/Report
        public async Task<object> Report()
        {
            var documents = await _reportCollection.Find(_ => true).ToListAsync();
            //var modell = new ReportModel
            //{
            //    Id = key,
            //    ReporterEmail = model.ReporterEmail,
            //    VictimEmail = model.VictimEmail,
            //    Negative = model.Negative, 
            //    Verbal = model.Verbal, 
            //    Hate = model.Hate, 
            //    Comment = model.Comment, 
            //    TimeStamp = model.TimeStamp 
            //};
            return View(documents);
        }



        public ActionResult Scraper()
        {
            return View();
        }


        private readonly IMongoCollection<Urls> _urlCollection = Mc.Database.GetCollection<Urls>("urls");

        [HttpPost]
        public async Task<object> Scraper(Urls model)
        {
            if (!ModelState.IsValid) return View();
            
            var filter = Builders<Urls>.Filter.Eq("Link", model.Link);
            var match = await _urlCollection.Find(filter).ToListAsync();

            //Does URL already exist?
            if (match.Count != 0) {
                ViewBag.NoAction = "This newspaper already exists in the database.";
                return View();
            } 

            //Generate id for new URL
            ObjectId id = ObjectId.GenerateNewId();
            model.Id = id;

            //Populer modellen med verdiene fra formen
            var modell = new Urls
            {
                Id=id,
                Category = model.Category,
                Source = model.Source,
                Link = model.Link,
                Country = model.Country
            };
            
            modell.ToBsonDocument();                      //Convert to MongoDB format 
            await _urlCollection.InsertOneAsync(modell);  //Insert in database

            ViewBag.Success = "URL was successfully inserted into database!";
            return View();
        }

        /**
        TODO:
        1. Må først hente info brukeren tastet inn i Scraper.cshtml
        2. Må generere en id
        3. Putte alt dette i en variabel
        4. Variabelen settes inn i databasen
        5. Returner success-kode til brukeren
        
            Ekstra: 
            6. Sjekke om linken allerede finnes                         - DONE
               6.1 Hvis den finnes, gi beskjed til brukeren             - DONE
            7. Er modellen valid?
                7.1 Sjekke 
            8. 

        **/



        #region Helpers

        /*
        * Helpers for easily authenticating
        */

        public AdminController(ApplicationUserManager userManager,
						ApplicationRoleManager roleManager)
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
						set { _userManager = value; }
				}

				private ApplicationRoleManager _roleManager;

				public ApplicationRoleManager RoleManager
				{
						get { return _roleManager ?? HttpContext.GetOwinContext().Get<ApplicationRoleManager>(); }
						private set { _roleManager = value; }
				}

				private IAuthenticationManager AuthenticationManager => HttpContext.GetOwinContext().Authentication;

				private SignInHelper _helper;

				private SignInHelper SignInHelper => _helper ?? (_helper = new SignInHelper(UserManager, AuthenticationManager));

				#endregion

		}
}
