using EPiServer.Web.Mvc;
using MatchApplication.Models.Pages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MatchApplication.Controllers
{
    public class TeamPageController : PageController<TeamPage>
    {
        // GET: TeamPage
        public ActionResult Index(TeamPage currentPage)
        {
            return View(currentPage);
        }
    }
}