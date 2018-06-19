using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MatchApplication.Controllers.Pages
{
    public class DefaultPageViewResult : ViewResult
    {
        private readonly string name;

        public DefaultPageViewResult(string name)
        {
            this.name = name;
        }

        protected override ViewEngineResult FindView(ControllerContext context)
        {
            context.RouteData.Values["controller"] = name;
            context.RouteData.Values["action"] = "Index";

            return base.FindView(context);
        }
    }
}