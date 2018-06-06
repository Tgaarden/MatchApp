using EPiServer.Web.Mvc;
using MatchApplication.Models.Pages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MatchApplication.Controllers
{
    public class MatchPageController : PageController<MatchPage>
    {
        // GET: MatchPage
        public ActionResult Index(MatchPage currentPage)
        {
            return View(currentPage);
        }
    }
}