using HotelWebApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotelWebApi.Interfaces
{
    public interface ILanacRepository
    {
        IQueryable<Lanac> GetAll();
        Lanac GetById(int id);
        IQueryable<Lanac> Tradicija();
    }
}
