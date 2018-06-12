using EPiServer.Web.Mvc;
using MatchApplication.Models.Pages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MatchApplication.Controllers
{
    public class RefereePageController : PageController<RefereePage>
    {
        // GET: RefereePage
        public ActionResult Index(RefereePageController currentPage)
        {
            return View(currentPage);
        }
    }
}