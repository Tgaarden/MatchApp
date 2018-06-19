using System;
using System.ComponentModel.DataAnnotations;
using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.DataAnnotations;
using EPiServer.Web;
using MatchApplication.Models.Pages;

namespace MatchApplication.Models.Blocks
{
    [ContentType(DisplayName = "EventBlockBase", GUID = "3094fcaf-78b2-422c-a5f6-5ece7b9cf690", Description = "")]
    public class EventBlockBase : BlockData
    {

        //Hva burde være med:
        //Ikon for hver hendelse
        //Dropdown liste for lag, og målscorer (henter liste over alle spillerne på laget
        //Oppdatere stillingen
        //Tid i kampen hendelsen skjedde

        [Display(
            Name = "Spiller",
            GroupName = SystemTabNames.Content,
            Order = 10), AllowedTypes(typeof(PlayerPage))]
        public virtual ContentReference FirstName { get; set; }

        [Display(
            Name = "Minutt",
            GroupName = SystemTabNames.Content,
            Order = 20)]
        public virtual int Minute { get; set; }

        [Display(
            Name = "Beskrivelse",
            GroupName = SystemTabNames.Content,
            Order = 30)]
        [UIHint(UIHint.Textarea)]
        public virtual string Description { get; set; }

    }
}