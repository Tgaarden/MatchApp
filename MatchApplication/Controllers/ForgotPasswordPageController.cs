using EPiServer;
using EPiServer.Core;
using EPiServer.Personalization;
using EPiServer.ServiceLocation;
using EPiServer.Web.Mvc;
using EPiServer.Web.Routing;
using MatchApplication.Infrastructure.Services;
using MatchApplication.Infrastructure.EPIServer;
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
    public class ForgotPasswordPageController : PageController<ForgotPasswordPage>
    {
        // GET: ForgotPassword
        public ActionResult Index(ForgotPasswordPage currentPage)
        {
            var model = new ForgotPasswordViewModel();
            model.CurrentPage = currentPage;
            return View(model);
        }

        [HttpGet]
        public ActionResult ResetPassword(ForgotPasswordPage currentPage, string token)
        {
            var model = new ResetPasswordViewModel();
            model.CurrentPage = currentPage;

            var loggedInUser = Membership.GetUser();
            if (token == null && loggedInUser != null)
            {
                model.IsValidToken = true;
            }
            else
            {
                try
                {
                    //?
                    var token2 = new ResetPasswordViewModel();
                    var i = token.Split('!');
                    if (i.Length > 1)
                    {
                        token2.Email = i[0];
                        token2.Username = i[1];
                    }

                    // Find user by mobile
                    var user = Membership.GetUser(token2.Username);

                    if (user != null)
                    {
                        // Update profile password reset time
                        var profile = EPiServerProfile.Get(user.UserName);
                        var d = profile[Constants.Profile.PasswordResetTokenExpireDate] as DateTime?;

                        if (d.HasValue && d.Value > DateTime.Now)
                        {
                            model.IsValidToken = true;
                        }
                    }
                }
                catch (Exception ex)
                {
                    model.ErrorMessage = ex.ToString();
                }
            }
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult SendMail(ForgotPasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                var urlResolver = ServiceLocator.Current.GetInstance<UrlResolver>();
                var contentLoader = ServiceLocator.Current.GetInstance<IContentLoader>();

                try
                {
                    // Find user by email
                    var users = Membership.FindUsersByEmail(model.Email);

                    MembershipUser user = null;
                    if (users.Count > 0)
                    {
                        foreach (MembershipUser u in users)
                        {
                            user = u;
                            break;
                        }
                    }

                    if (user != null)
                    {
                        // Update profile password reset time
                        var profile = EPiServerProfile.Get(user.UserName);
                        profile[Constants.Profile.PasswordResetTokenExpireDate] = DateTime.Now.AddHours(1);
                        profile.Save();

                        // generate token for email link
                        var token = model.Email + "!" + user.UserName;

                        var pageUrl = urlResolver.GetUrl(model.CurrentPage);
                        // make it absolute
                        if (!pageUrl.StartsWith("http"))
                        {
                            pageUrl = Request.Url.GetLeftPart(UriPartial.Authority).TrimEnd('/') + "/" + pageUrl.TrimStart('/');
                        }
                        // append token
                        pageUrl = pageUrl + "ResetPassword" + "?token=" + token;

                        // prepare email body
                        string emailBody = "Trykk på lenken for å endre å lage ett nytt passord: " + pageUrl;

                        /*
                        .Replace("{link}", string.Format("<a href=\"{0}\">{1}</a>", pageUrl, currentPage.CreateNewPasswordLinkText))
                        .Replace("{email}", model.Email.Trim());
                        */

                        // send email
                        model.Success = EmailService.SendEmail(model.Email, "Subject", emailBody, "admin@match.com");

                        if (!model.Success)
                        {
                            model.ErrorMessage = "Noe gikk galt";
                        }
                    }
                    else
                    {// user not found
                        model.ErrorMessage = "Brukeren finnes ikke";
                    }

                }
                catch (Exception ex)
                {
                    model.ErrorMessage = ex.ToString();
                }
            }
            return View(model);
        }

        [HttpPost]
        public ActionResult ChangePassword(ForgotPasswordPage currentPage)
        {
            var model = new ResetPasswordViewModel();
            model.CurrentPage = currentPage;

            if (ModelState.IsValid)
            {
                if (model.ConfirmedPassword == model.Password)
                {
                    var loggedInUser = Membership.GetUser();
                    if (model.Token == null && loggedInUser == null)
                    {
                        model.ErrorMessage = "Brukeren eksisterer ikke";
                    }
                    else
                    {
                        try
                        {
                            var user = Membership.GetUser(model.Username);

                            if (user != null)
                            {

                                if (user.ChangePassword(user.ResetPassword(), model.Password))
                                {
                                    model.Success = true;
                                }
                                else
                                {
                                    model.ErrorMessage = "Noe gikk galt";
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            model.ErrorMessage = ex.ToString();
                        }
                    }
                }
                else
                {
                    model.ErrorMessage = "Passordene er ikke like";
                }
            }

            if (model.Success == true) {
                return View("ChangedPassword", model);
            }
            else
            {
                return View("ResetPassword", model);
            }
        }
    }
}