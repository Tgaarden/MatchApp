using System;
using System.ComponentModel.DataAnnotations;
using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.DataAnnotations;
using EPiServer.SpecializedProperties;

namespace MatchApplication.Models.Pages
{
    [ContentType(DisplayName = "PersonPageBase", GUID = "43530052-6ba4-4d9d-b309-6d42ba443933", Description = "")]
    public class PersonPageBase : PageData
    {
        [Display(
            Name = "Fornavn",
            GroupName = SystemTabNames.Content,
            Order = 10)]
        public virtual string FirstName { get; set; }
        [Display(
            Name = "Etternavn",
            GroupName = SystemTabNames.Content,
            Order = 20)]
        public virtual string LastName { get; set; }
        [Display(
            Name = "Fødselsdato",
            GroupName = SystemTabNames.Content,
            Order = 30)]
        public virtual int YearBorn { get; set; }



    }
}