using EPiServer;
using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.DataAccess;
using EPiServer.Security;
using EPiServer.ServiceLocation;
using EPiServer.Web.Mvc;
using MatchApplication.Models.Blocks;
using MatchApplication.Models.Pages;
using MatchApplication.Models.Poko;
using MatchApplication.Models.ViewModels;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.Web.WebPages;

namespace MatchApplication.Controllers
{
	public class MatchPageController : PageController<MatchPage>
	{
		// GET: MatchPage
		public ActionResult Index(MatchPage currentPage)
		{
			return View(currentPage);
		}

		public ActionResult NewEventDialog(MatchPage currentPage)
		{
			var model = new MatchEventViewModel()
			{
				Players = new List<Player>()
			};
			if (currentPage != null) {
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
		public ActionResult NewEventDialog2(MatchEventViewModel data)
		{
			if (ModelState.IsValid) {
				
				var contentRepository = ServiceLocator.Current.GetInstance<IContentRepository>();
				var pageRef = new PageReference(data.MatchPageId);
				var currentPage = contentRepository.Get<PageData>(pageRef);
				// create writable clone of the target block to be able to update its content area
				var writableTargetBlock = (MatchPage) currentPage.CreateWritableClone();

				// create and publish a new block with data fetched from SQL query
				var newBlock = contentRepository.GetDefault<GoalBlock>(ContentReference.GlobalBlockFolder);

				// the new block needs a name
				((IContent)newBlock).Name = "block3" + data.Minute.ToString(); // make this name incremental for currentPage
				newBlock.Description = data.Description;
				newBlock.Minute = data.Minute;

				contentRepository.Save((IContent)newBlock, SaveAction.Publish, AccessLevel.NoAccess);

				// add new block to the target block content area
				writableTargetBlock.ContentArea.Items.Add(new ContentAreaItem
				{
					ContentLink = ((IContent)newBlock).ContentLink
				});

				contentRepository.Save((IContent)writableTargetBlock, SaveAction.Publish, AccessLevel.NoAccess);
				string url = Request.UrlReferrer.AbsolutePath;
				return Redirect(url);
			}
			else
			{
				return View("Index");
			}
		}
	}
}