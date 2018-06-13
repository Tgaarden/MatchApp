using EPiServer;
using EPiServer.Web.Mvc;
using MatchApplication.Models.Pages;
using MatchApplication.Models.ViewModels;
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
            var model = new TeamPageViewModel();
            model.CurrentPage = currentPage;
            model.Players = GetTeamPlayers(currentPage);

            return View(model);
        }

        public List<PlayerPage> GetTeamPlayers(TeamPage currentPage)
        {
            List<PlayerPage> players = new List<PlayerPage>();

            if(currentPage != null)
            {
                players = DataFactory.Instance.GetChildren<PlayerPage>(currentPage.ContentLink).ToList();
            }

            return players;
        }
    }
}