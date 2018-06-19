using EPiServer;
using EPiServer.Core;
using EPiServer.Framework.DataAnnotations;
using EPiServer.Framework.Web;
using EPiServer.Web;
using MatchApplication.Controllers.Pages;
using MatchApplication.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MatchApplication.Controllers.Blocks.Preview
{
    /// <summary>
    /// Based on: http://joelabrahamsson.com/pattern-for-episerver-block-preview-mvc-controller/
    /// </summary>
    [TemplateDescriptor(
        //Support everything inheriting from BlockData.
        Inherited = true,
        //By default controllers implementing IRenderTemplate<T> where T is BlockData
        //are registered as partial renderers. As this will be a "full page" renderer
        //we need to change that.
        TemplateTypeCategory = TemplateTypeCategories.MvcController,
        //Should only be used for preview
        Tags = new[] { RenderingTags.Preview },
        AvailableWithoutTag = false)]
    public class DefaultBlockPreviewController : Controller,
        //Register as template for BlockData. To only support a specific type
        //change the type parameter from BlockData to that type and optionally
        //set Inherited = false in the the TemplateDescriptor attribute above.
        IRenderTemplate<BlockData>
    {
        public ActionResult Index(IContent currentContent)
        {
            //While we implement IRenderTemplate for BlockData model binding
            //can only deal with IContent, ie shared blocks in this case.
            IBlockViewModel<BlockData> model = BlockViewModel.CreateModel((BlockData)currentContent);

            return DefaultPageViewResult(currentContent.GetOriginalType().Name, model);
        }

        private DefaultPageViewResult DefaultPageViewResult(string name, IBlockViewModel<BlockData> model)
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