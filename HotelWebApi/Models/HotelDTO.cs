using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HotelWebApi.Models
{
    public class HotelDTO
    {
        public int Id { get; set; }
        public string Naziv { get; set; }
        public int GodinaOtvaranja { get; set; }
        public int BrojSoba { get; set; }
        public int BrojZaposlenih { get; set; }
        public string LanacNaziv { get; set; }
    }
}