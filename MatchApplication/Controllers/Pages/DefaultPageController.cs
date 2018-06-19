using EPiServer;
using EPiServer.Core;
using EPiServer.Framework.DataAnnotations;
using EPiServer.Web.Mvc;
using MatchApplication.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MatchApplication.Controllers.Pages
{
    [TemplateDescriptor(Inherited = true)]
    public class DefaultPageController : PageController<PageData>
    {
        public ViewResult Index(PageData currentPage)
        {
            IPageViewModel<PageData> model = PageViewModel.CreateModel(currentPage);

            return DefaultPageViewResult(currentPage.GetOriginalType().Name, model);
        }

        private DefaultPageViewResult DefaultPageViewResult(string name, IPageViewModel<PageData> model)
        {
            ViewData.Model = model;
            return new DefaultPageViewResult(name)
            {
                ViewName = "Index",
                MasterName = null,
                ViewData = ViewData,
                TempData = TempData,
                ViewEngineCollection = ViewEngineCollection
            };
        }
    }
}