using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace HotelWebApi.Models
{
    public class Hotel
    {
        public int Id { get; set; }
        [Required]
        [StringLength(80)]
        public string Naziv { get; set; }
        [Required]
        [Range(1949, 2021)]
        public int GodinaOtvaranja { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int BrojZaposlenih { get; set; }
        [Required]
        [Range(9, 999)]
        public int BrojSoba { get; set; }

        [Required]
        public virtual int LanacId { get; set; }
        public virtual Lanac Lanac { get; set; }
    }
}