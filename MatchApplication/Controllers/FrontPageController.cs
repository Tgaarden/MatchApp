using EPiServer.Web.Mvc;
using MatchApplication.Models.Pages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MatchApplication.Controllers
{
    public class FrontPageController : PageController<FrontPage>
    {
        // GET: FrontPage
        public ActionResult Index(FrontPage currentPage)
        {
            return View(currentPage);
        }
    }
}