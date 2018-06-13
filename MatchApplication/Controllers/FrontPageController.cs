using EPiServer;
using EPiServer.Web.Mvc;
using MatchApplication.Infrastructure.Enums;
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
    public class FrontPageController : PageController<FrontPage>
    {
        // GET: FrontPage
        public ActionResult Index(FrontPage currentPage)
        {
            var model = new FrontPageViewModel();
            model.CurrentPage = currentPage;
            model.UpcomingMatches = FindAllMatches(currentPage, MatchStatus.Upcoming);
            model.PreviousMatches = FindAllMatches(currentPage, MatchStatus.Previous);
            model.ActiveMatches = FindAllMatches(currentPage, MatchStatus.Active);

            return View(model);
        }

        public List<MatchPage> FindAllMatches(FrontPage currentPage, MatchStatus matchStatus)
        {
            List<MatchPage> matches = new List<MatchPage>();

            if (currentPage != null)
            {
                matches = DataFactory.Instance.GetChildren<MatchPage>(currentPage.ContentLink)
                    .Where(x => x.MatchStatus == matchStatus).ToList();
            }

            return matches;
        }

        //protected void CreateStandardSQLUser()
        //{
        //    var mu = Membership.GetUser("oxxadmin");

        //    if (mu != null) return;

        //    try
        //    {
        //        Membership.CreateUser("oxxadmin", "Sommer2018", "oxxadmin@oxx.no");

        //        try
        //        {
        //            this.EnsureRoleExists("WebEditors");
        //            this.EnsureRoleExists("WebAdmins");

        //            Roles.AddUserToRoles("oxxadmin", new[] { "WebAdmins", "WebEditors" });
        //        }
        //        catch (ProviderException pe)
        //        {
        //            var test = pe.ToString();
        //        }
        //    }
        //    catch (MembershipCreateUserException mcue)
        //    {
        //        var test = mcue.ToString();
        //    }
        //}

        //private void EnsureRoleExists(string roleName)
        //{
        //    if (Roles.RoleExists(roleName)) return;

        //    try
        //    {
        //        Roles.CreateRole(roleName);
        //    }
        //    catch (ProviderException pe)
        //    {
        //        var test = pe.ToString();
        //    }
        //}
    }
}