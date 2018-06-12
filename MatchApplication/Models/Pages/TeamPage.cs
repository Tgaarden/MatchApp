using System;
using System.ComponentModel.DataAnnotations;
using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.DataAnnotations;
using EPiServer.SpecializedProperties;

namespace MatchApplication.Models.Pages
{
    [ContentType(DisplayName = "TeamPage", GUID = "3f3c53f5-f3fb-404d-aa0e-bfe4a57895c3", Description = "")]
    public class TeamPage : PageData
    {
        [Display(
            Name = "Lagnavn",
            GroupName = SystemTabNames.Content,
            Order = 10)]
        public virtual string TeamName { get; set; }

    }
}