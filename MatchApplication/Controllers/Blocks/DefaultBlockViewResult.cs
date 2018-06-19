using System.Web.Mvc;

namespace MatchApplication.Controllers.Blocks
{
    public class DefaultBlockViewResult : PartialViewResult
    {
        private readonly string name;

        public DefaultBlockViewResult(string name)
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