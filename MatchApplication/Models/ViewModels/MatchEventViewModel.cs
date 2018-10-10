using EPiServer.Core;
using MatchApplication.Models.Pages;
using MatchApplication.Models.Poko;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MatchApplication.Models.ViewModels
{
	public class MatchEventViewModel
	{
		//public List<BlockData> MatchEvents { get; set; }

		//public string Test { get; set; }
		[Required]
		[Display(Name = "Spiller")]
		public int PlayerId { get; set; }

		[Required]
		[Display(Name = "Spilleminutt")]
		public int Minute { get; set; }

		[Display(Name = "Forklaring")]
		public string Description { get; set; }

		public int MatchPageId { get; set; }

		public List<Player> Players { get; set; }

	}

}