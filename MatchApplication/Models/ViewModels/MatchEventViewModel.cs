using EPiServer.Core;
using System.Collections.Generic;

namespace MatchApplication.Models.ViewModels
{
	public class MatchEventViewModel
	{
		public List<BlockData> MatchEvents { get; set; }

		public string Test { get; set; }
	}
}