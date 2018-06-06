using EPiServer.Web.Mvc;
using MatchApplication.Models.Pages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MatchApplication.Controllers
{
    public class CoachPageController : PageController<CoachPage>
    {
        // GET: CoachPage
        public ActionResult Index(CoachPageController currentPage)
        {
            return View(currentPage);
        }
    }
}