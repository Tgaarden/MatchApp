using EPiServer;
using EPiServer.Core;
using EPiServer.DataAccess;
using EPiServer.Security;
using EPiServer.ServiceLocation;
using MatchApplication.Models.Blocks;
using MatchApplication.Models.Pages;
using MatchApplication.Models.Poko;
using MatchApplication.Models.ViewModels;
using System.Collections.Generic;
using System.Web.Mvc;


namespace MatchApplication.Controllers
{
	public class EventController : Controller
    {
        // GET: Event
        public ActionResult Index()
        {
            return View();
        }

		public ActionResult CreateDialog(MatchPage currentPage)
		{
			var model = new MatchEventViewModel()
			{
				Players = new List<Player>()
			};
			if (currentPage != null)
			{
				//var homeTeamPage = currentPage.HomeTeam;

				var awayTeamPage = currentPage.Awayteam;
				var contentRepository = ServiceLocator.Current.GetInstance<IContentRepository>();
				var subPages = contentRepository.GetDescendents(awayTeamPage);

				foreach (var child in subPages)
				{
					var subPage = contentRepository.Get<PersonPageBase>(child);
					model.Players.Add(new Player
					{
						FirstName = subPage.FirstName ?? "",
						LastName = subPage.LastName ?? "",
						Id = subPage.ContentLink.ID,
					});
				}

				model.MatchPageId = currentPage.ContentLink.ID;
			}

			return PartialView("~/Views/Shared/_NewEventDialog.cshtml", model);
		}

		[HttpPost]
		public ActionResult CreateEvent(MatchEventViewModel data)
		{
			string url = Request.UrlReferrer.AbsolutePath;

			if (ModelState.IsValid)
			{

				var contentRepository = ServiceLocator.Current.GetInstance<IContentRepository>();
				var pageRef = new PageReference(data.MatchPageId);
				var currentPage = contentRepository.Get<PageData>(pageRef);
				// Create writable clone of the target block to be able to update its content area
				var writableTargetBlock = (MatchPage)currentPage.CreateWritableClone();

				// Create and publish a new block with data fetched from SQL query
				var newBlock = contentRepository.GetDefault<GoalBlock>(ContentReference.GlobalBlockFolder);

				// The new block needs a name
				((IContent)newBlock).Name = "event" + data.Minute.ToString();

				// Set properties
				newBlock.FirstName = new ContentReference(data.PlayerId);
				newBlock.Description = data.Description;
				newBlock.Minute = data.Minute;

				contentRepository.Save((IContent)newBlock, SaveAction.Publish, AccessLevel.NoAccess);

				// Add new block to the target block content area
				writableTargetBlock.ContentArea.Items.Add(new ContentAreaItem
				{
					ContentLink = ((IContent)newBlock).ContentLink
				});

				contentRepository.Save((IContent)writableTargetBlock, SaveAction.Publish, AccessLevel.NoAccess);

				return Redirect(url);
			}
			else
			{
				return Redirect(url);
			}
		}
	}
}