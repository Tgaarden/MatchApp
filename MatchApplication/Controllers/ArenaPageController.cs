using EPiServer.Web.Mvc;
using MatchApplication.Models.Pages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MatchApplication.Controllers
{
    public class ArenaPageController : PageController<ArenaPage>
    {
        // GET: ArenaPage
        public ActionResult Index(ArenaPage currentPage)
        {
            return View(currentPage);
        }
    }
}