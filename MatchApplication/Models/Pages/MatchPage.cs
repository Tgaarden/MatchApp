using System;
using System.ComponentModel.DataAnnotations;
using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.DataAnnotations;
using EPiServer.SpecializedProperties;
using MatchApplication.Infrastructure.Attributes;
using MatchApplication.Infrastructure.Enums;

namespace MatchApplication.Models.Pages
{
    [ContentType(DisplayName = "MatchPage", GUID = "f885695c-d8d9-4a5d-9d63-71294e9693a2", Description = "")]
    public class MatchPage : PageData
    {
        [Display(
            Name = "Tittel",
            GroupName = SystemTabNames.Content,
            Order = 10)]
        public virtual string Title { get; set; }

        [Display(
            Name = "Kampstart",
            GroupName = SystemTabNames.Content,
            Order = 20)]
        public virtual DateTime MatchStart { get; set; }

        [Display(
            Name = "Kampslutt",
            GroupName = SystemTabNames.Content,
            Order = 30)]
        public virtual DateTime MatchEnd { get; set; }

        [Display(
            Name = "Hjemmelag",
            GroupName = SystemTabNames.Content,
            Order = 40), AllowedTypes(typeof(TeamPage))]
        public virtual ContentReference HomeTeam { get; set; }

        [Display(
            Name = "Bortelag",
            GroupName = SystemTabNames.Content,
            Order = 50), AllowedTypes(typeof(TeamPage))]
        public virtual ContentReference Awayteam { get; set; }

        [Display(
            Name = "Dommer",
            GroupName = SystemTabNames.Content,
            Order = 60), AllowedTypes(typeof(RefereePage))]
        public virtual ContentReference FirstName { get; set; }

        [Display(Name = "Kampstatus",
            GroupName = SystemTabNames.Content,
            Order = 70)]
        [EnumSelection(typeof(MatchStatus))]
        public virtual MatchStatus MatchStatus { get; set; }

        [Display(
            Name = "Hendelser",
            GroupName = SystemTabNames.Content,
            Order = 80)]
        public virtual ContentArea ContentArea { get; set; }

    }
}