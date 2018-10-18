using EPiServer.Core;
using MatchApplication.Models.Blocks;
using MatchApplication.Models.Pages;
using MatchApplication.Models.Poko;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MatchApplication.Models.ViewModels
{
	public class MatchEventViewModel
	{
		[Required]
		[Display(Name = "Spiller")]
		public int PlayerId { get; set; }

		[Required]
		[Display(Name = "Spiller inn")]
		public int SubstituteId { get; set; }

		[Required]
		[Display(Name = "Hendelse")]
		public int EventId { get; set; }

		[Required]
		[Display(Name = "Spilleminutt")]
		public int Minute { get; set; }

		[Display(Name = "Forklaring")]
		public string Description { get; set; }

		public int MatchPageId { get; set; }

		public List<Player> Players { get; set; }

		public List<EventType> EventTypes { get; set; }

	}
}