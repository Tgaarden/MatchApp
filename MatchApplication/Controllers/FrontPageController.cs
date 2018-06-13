using EPiServer.Web.Mvc;
using MatchApplication.Models.Pages;
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
            //CreateStandardSQLUser();
            return View(currentPage);
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