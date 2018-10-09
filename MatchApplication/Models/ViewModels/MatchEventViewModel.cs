using EPiServer.Core;
using MatchApplication.Models.Pages;
using MatchApplication.Models.Poko;
using System.Collections.Generic;

namespace MatchApplication.Models.ViewModels
{
	public class MatchEventViewModel
	{
		//public List<BlockData> MatchEvents { get; set; }

		//public string Test { get; set; }

		public int MatchPageId { get; set; }
		public List<Player> Players { get; set; }
		public int Minute { get; set; }
		public string Description { get; set; }

	}

}