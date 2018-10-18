using EPiServer.Data.Dynamic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MatchApplication.Models.Poko
{
	public class Player
	{
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public int Id { get; set; }
		public int Goals { get; set; }

		//TODO
		//Lagre, oppdatere og hente spillerdata
		public void Save()
		{
			// Create a data store (but only if one doesn't exist, we won't overwrite an existing one)
			var store = DynamicDataStoreFactory.Instance.CreateStore(typeof(Player));

			// Save the current settings
			store.Save(this);
		}

		public static Player Get(int id)
		{
			var store = DynamicDataStoreFactory.Instance.CreateStore(typeof(Player));

			return store.Items<Player>().FirstOrDefault(a => a.Id == id);
		}

		//public int GetGoalCount(int id)
		//{
		//	// Create a data store (but only if one doesn't exist, we won't overwrite an existing one)
		//	var store = DynamicDataStoreFactory.Instance.CreateStore(typeof(Player));

		//	// Save the current settings
		//	return store.Items<Player>().Select(Goals);
		//}
	}

}