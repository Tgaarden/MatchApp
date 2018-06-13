using MatchApplication.Models.Pages;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MatchApplication.Models.ViewModels
{
    public class RegisterViewModel
    {
        public RegisterPage CurrentPage { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string ConfirmedPassword { get; set; }

        [Required]
        public string Email { get; set; }

        public bool Success { get; set; }
        public string ErrorMessage { get; set; }
    }
}