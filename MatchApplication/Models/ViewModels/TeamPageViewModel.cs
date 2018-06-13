using MatchApplication.Models.Pages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MatchApplication.Models.ViewModels
{
    public class TeamPageViewModel
    {
        public List<PlayerPage> Players { get; set; }

        public TeamPage CurrentPage { get; set; }

    }
}