using EPiServer.Web.Mvc;
using MatchApplication.Models.Pages;
using MatchApplication.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Configuration.Provider;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace MatchApplication.Controllers
{
    public class RegisterPageController : PageController<RegisterPage>
    {
        // GET: RegisterPage
        public ActionResult Index(RegisterPage currentPage)
        {
            var model = new RegisterViewModel();
            model.CurrentPage = currentPage;
            return View(model);
        }

        [HttpPost]
        public ActionResult Register(RegisterViewModel model)
        {
            try
            {
                var user = Membership.GetUser(model.Username);

                if (user == null)
                {

                    if (ModelState.IsValid)
                    {

                        if (model.ConfirmedPassword == model.Password)
                        {
                            try {
                                user = Membership.CreateUser(model.Username, model.Password, model.Email);

                                try
                                {
                                    Roles.AddUserToRoles(model.Username, new[] { "WebPageUsers" });
                                }
                                catch (ProviderException pe)
                                {
                                    model.ErrorMessage = pe.ToString();
                                }
                            }
                            catch (MembershipCreateUserException mcue)
                            {
                                if(mcue.StatusCode == MembershipCreateStatus.InvalidPassword) {
                                    model.ErrorMessage = "Passordet er for svakt";
                                }
                                else
                                {
                                    model.ErrorMessage = mcue.Message;
                                }
                            }

                            if (user != null)
                            {
                                model.Success = true;
                            }
                        }
                        else
                        {
                            model.ErrorMessage = "Passordene stemmer ikke!";
                        }

                        if (model.Success)
                        {
                            // Login to EPiServer
                            Session.Clear();
                            Session.Abandon();
                            FormsAuthentication.SetAuthCookie(model.Username, true);
                            return Redirect("/LoginPage");
                        }

                    }
                    else
                    {
                        model.ErrorMessage = "Fyll inn alle feltene";
                    }
                }
            }
            catch (Exception ex)
            {
                model.ErrorMessage = ex.ToString();
            }

            return View("Index", model);
        }
    }
}