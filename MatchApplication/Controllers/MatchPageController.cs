using EPiServer.Web.Mvc;
using MatchApplication.Models.Blocks;
using MatchApplication.Models.Pages;
using MatchApplication.Models.ViewModels;
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

		public ActionResult NewEventDialog()
		{
			var model = new MatchEventViewModel();

			model.Test = "hei";
			
			return PartialView("~/Views/Shared/_NewEventDialog.cshtml", model);
		}
    }
}