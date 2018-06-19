using EPiServer.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MatchApplication.Models.ViewModels
{

    public interface IPageViewModel<out TPage> where TPage : PageData
    {
        TPage CurrentPage { get; }
        ILayoutModel Layout { get; set; }
    }
}