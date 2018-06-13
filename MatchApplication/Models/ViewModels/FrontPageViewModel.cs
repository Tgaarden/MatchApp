using MatchApplication.Models.Pages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MatchApplication.Models.ViewModels
{
    public class FrontPageViewModel
    {
        public FrontPage CurrentPage { get; set; }
        public List<MatchPage> UpcomingMatches { get; set; }
        public List<MatchPage> PreviousMatches { get; set; }
        public List<MatchPage> ActiveMatches { get; set; }

    }
}