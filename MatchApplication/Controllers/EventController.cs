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
				Players = new List<Player>(),
				EventTypes = new List<EventType>()
			};

			// Add blocktypes to list
			model.EventTypes = CreateEventTypes();

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
				//var newBlock = contentRepository.GetDefault<GoalBlock>(ContentReference.GlobalBlockFolder);
				var newBlock = CreateNewBlock(contentRepository, data.EventId);
				// The new block needs a name
				((IContent)newBlock).Name = "event" + data.Minute.ToString();

				// Set properties
				newBlock.FirstName = new ContentReference(data.PlayerId);
				newBlock.Description = data.Description;
				newBlock.Minute = data.Minute;

				contentRepository.Save((IContent)newBlock, SaveAction.Publish, AccessLevel.NoAccess);
				// Have to initiliaze the contentarea if no items exists allready
				if (writableTargetBlock.ContentArea == null)
				{
					writableTargetBlock.ContentArea = new ContentArea();
				}
				// Add new block to the target block content area
				writableTargetBlock.ContentArea.Items.Insert(0, new ContentAreaItem
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

		public List<EventType> CreateEventTypes()
		{
			var eventList = new List<EventType>();
			eventList.Add(new EventType
			{
				BlockName = "Corner",
				Id = 0
			});
			eventList.Add(new EventType
			{
				BlockName = "5 meter",
				Id = 1
			});
			eventList.Add(new EventType
			{
				BlockName = "Frispark",
				Id = 2
			});
			eventList.Add(new EventType
			{
				BlockName = "Mål",
				Id = 3
			});
			eventList.Add(new EventType
			{
				BlockName = "Offside",
				Id = 4
			});
			eventList.Add(new EventType
			{
				BlockName = "Straffespark",
				Id = 5
			});
			eventList.Add(new EventType
			{
				BlockName = "Rødt kort",
				Id = 6
			});
			eventList.Add(new EventType
			{
				BlockName = "Innbytte",
				Id = 7
			});
			eventList.Add(new EventType
			{
				BlockName = "Innkast",
				Id = 8
			});
			eventList.Add(new EventType
			{
				BlockName = "Gult kort",
				Id = 9
			});

			return eventList;
		}

		public EventBlockBase CreateNewBlock(IContentRepository contentRepository, int eventId)
		{
			var newBlock = new EventBlockBase();
			switch (eventId)
			{
				case 0:
					newBlock = contentRepository.GetDefault<CornerBlock>(ContentReference.GlobalBlockFolder);
					break;
				case 1:
					newBlock = contentRepository.GetDefault<FiveMeterBlock>(ContentReference.GlobalBlockFolder);
					break;
				case 2:
					newBlock = contentRepository.GetDefault<FreeKickBlock>(ContentReference.GlobalBlockFolder);
					break;
				case 3:
					newBlock = contentRepository.GetDefault<GoalBlock>(ContentReference.GlobalBlockFolder);
					break;
				case 4:
					newBlock = contentRepository.GetDefault<OffsideBlock>(ContentReference.GlobalBlockFolder);
					break;
				case 5:
					newBlock = contentRepository.GetDefault<PenaltyKickBlock>(ContentReference.GlobalBlockFolder);
					break;
				case 6:
					newBlock = contentRepository.GetDefault<RedCardBlock>(ContentReference.GlobalBlockFolder);
					break;
				case 7:
					newBlock = contentRepository.GetDefault<SubstituteBlock>(ContentReference.GlobalBlockFolder);
					break;
				case 8:
					newBlock = contentRepository.GetDefault<ThrowBlock>(ContentReference.GlobalBlockFolder);
					break;
				case 9:
					newBlock = contentRepository.GetDefault<YellowCardBlock>(ContentReference.GlobalBlockFolder);
					break;
				default:
					break;
			}


			return newBlock;
		}
	}
}