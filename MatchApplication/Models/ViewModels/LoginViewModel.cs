using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using MatchApplication.Models.Pages;

namespace MatchApplication.Models.ViewModels
{
    public class LoginViewModel
    {
        public LoginPage CurrentPage { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }

        public bool Success { get; set; }
        public string ErrorMessage { get; set; }
    }
}