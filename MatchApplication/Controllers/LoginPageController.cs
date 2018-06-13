using EPiServer.Framework.Localization;
using EPiServer.ServiceLocation;
using EPiServer.Web.Mvc;
using EPiServer.Web.Routing;
using MatchApplication.Models.Pages;
using MatchApplication.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace MatchApplication.Controllers
{
    public class LoginPageController : PageController<LoginPage>
    {
        // GET: LoginPage
        public ActionResult Index(LoginPage currentPage)
        {
            var model = new LoginViewModel();
            model.CurrentPage = currentPage;
            return View(model);

        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Login(LoginViewModel model)
        {
            //var localizationService = ServiceLocator.Current.GetInstance<LocalizationService>();
            //var urlResolver = ServiceLocator.Current.GetInstance<UrlResolver>();
            var user = Membership.GetUser(model.Username);

            try
            {

                if (user == null)
                {
                    model.ErrorMessage = "Brukeren eksisterer ikke";
                }
                else if (user.IsLockedOut)
                {
                    model.ErrorMessage = "Brukeren er låst, kontakt administrator";
                }
                else if (Membership.ValidateUser(model.Username, model.Password))
                {
                    var acceptedRoles = new[] { "WebAdmins", "WebEditors", "Administrators", "Administratorer", "WebPageUsers" };
                    var rolesForUser = Roles.GetRolesForUser(model.Username);
                    bool hasAccessToLogin = rolesForUser.Intersect(acceptedRoles).Count() > 0;

                    if (hasAccessToLogin)
                    {
                        Session.Clear();
                        Session.Abandon();
                        FormsAuthentication.SetAuthCookie(model.Username, true);
                        model.Success = true;
                        return Redirect("/");
                    }
                    else
                    {
                        model.ErrorMessage = "Noe gikk galt";
                    }
                }
                else
                {
                    model.ErrorMessage = "Feil passord eller brukernavn";
                }
            }
            catch(Exception ex)
            {
                model.ErrorMessage = "Innlogging feilet";
            }
            
            return View("Index", model);
        }

        public ActionResult Logout()
        {
            Session.Clear();
            Session.Abandon();
            FormsAuthentication.SignOut();
            Roles.DeleteCookie();

            return Redirect("/");
        }
    }
}