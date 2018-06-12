using EPiServer.Web.Mvc;
using MatchApplication.Models.Pages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MatchApplication.Controllers
{
    public class PlayerPageController : PageController<PlayerPage>
    {
        // GET: PlayerPage
        public ActionResult Index(PlayerPage currentPage)
        {
            return View(currentPage);
        }
    }
}