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
using System;
using System.Collections.Generic;
using System.ComponentModel;
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
	}
}