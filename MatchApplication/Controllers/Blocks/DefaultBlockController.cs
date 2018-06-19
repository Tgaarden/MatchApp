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

namespace MatchApplication.Controllers.Blocks
{
    [TemplateDescriptor(Inherited = true)]
    public class DefaultBlockController : BlockController<BlockData>
    {
        public override ActionResult Index(BlockData currentBlock)
        {
            IBlockViewModel<BlockData> model = BlockViewModel.CreateModel(currentBlock);

            return DefaultBlockViewResult(currentBlock.GetOriginalType().Name, model);
        }

        private DefaultBlockViewResult DefaultBlockViewResult(string name, IBlockViewModel<BlockData> model)
        {
            ViewData.Model = model;
            return new DefaultBlockViewResult(name)
            {
                ViewName = name,
                ViewData = ViewData,
                TempData = TempData,
                ViewEngineCollection = ViewEngineCollection
            };
        }
    }
}