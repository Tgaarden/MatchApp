using System;
using System.ComponentModel.DataAnnotations;
using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.DataAnnotations;

namespace MatchApplication.Models.Blocks
{
    [ContentType(DisplayName = "Goal", GUID = "7730750b-571a-426b-8351-563fd5ecf083", Description = "")]
    public class GoalBlock : EventBlockBase
    {
        /*
        [Display(
            Name = "Main body",
            Description = "Type in the main content of the page here",
            GroupName = SystemTabNames.Content,
            Order = 20)]
        public virtual XhtmlString MainBody { get; set; }
        */

        //Statisk bildefil?

    }
}