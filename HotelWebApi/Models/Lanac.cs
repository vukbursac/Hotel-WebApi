using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace HotelWebApi.Models
{
    public class Lanac
    {
        public int Id { get; set; }
        [Required]
        [StringLength(75)]
        public string Naziv { get; set; }
        [Required]
        [Range(1850, 2020)]
        public int GodinaOsnivanja { get; set; }
        public ICollection<Hotel> Hoteli { get; set; }
    }
}