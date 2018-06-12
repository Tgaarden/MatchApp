using System;
using System.ComponentModel.DataAnnotations;
using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.DataAnnotations;
using EPiServer.SpecializedProperties;

namespace MatchApplication.Models.Pages
{
    [ContentType(DisplayName = "ArenaPage", GUID = "91473542-b976-49a9-a5b8-5823e459ee83", Description = "")]
    public class ArenaPage : PageData
    {
        [Display(
            Name = "Arenanavn",
            GroupName = SystemTabNames.Content,
            Order = 10)]
        public virtual string ArenaName { get; set; }

        [Display(
            Name = "By",
            GroupName = SystemTabNames.Content,
            Order = 20)]
        public virtual string City { get; set; }
    }
}