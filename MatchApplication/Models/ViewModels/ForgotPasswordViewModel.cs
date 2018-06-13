using MatchApplication.Models.Pages;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MatchApplication.Models.ViewModels
{
    public class ForgotPasswordViewModel
    {
        public ForgotPasswordPage CurrentPage { get; set; }

        [Required]
        public string Email { get; set; }

        public bool Success { get; set; }
        public string ErrorMessage { get; set; }

    }
}