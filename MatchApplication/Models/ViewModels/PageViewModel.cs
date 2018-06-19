using EPiServer;
using EPiServer.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MatchApplication.Models.ViewModels
{
    public class PageViewModel<TPage> : IPageViewModel<TPage> where TPage : PageData
    {
        public TPage CurrentPage { get; private set; }
        public ILayoutModel Layout { get; set; }

        public PageViewModel(TPage currentPage)
        {
            CurrentPage = currentPage;
        }
    }

    public static class PageViewModel
    {
        public static IPageViewModel<TPage> CreateModel<TPage>(TPage page) where TPage : PageData
        {
            Type type = typeof(PageViewModel<>).MakeGenericType(page.GetOriginalType());
            return Activator.CreateInstance(type, page) as IPageViewModel<TPage>;
        }
    }
}