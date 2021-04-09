using HotelWebApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotelWebApi.Interfaces
{
    public interface IHotelRepository
    {
        IQueryable<Hotel> GetAll();
        Hotel GetById(int id);
        void Add(Hotel hotel);
        void Update(Hotel hotel);
        void Delete(Hotel hotel);
        IQueryable<LanacProsekDTO> GetByZaposleni();
        IQueryable<LanacSobeDTO> PostSobe(int granica);
        IQueryable<Hotel> GetZaposleniMinimum(int minimum);
        IQueryable<Hotel> Kapacitet(int najmanje, int najvise);
    }
}
