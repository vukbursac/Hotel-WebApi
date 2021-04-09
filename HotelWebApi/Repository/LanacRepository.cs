using HotelWebApi.Interfaces;
using HotelWebApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HotelWebApi.Repository
{
    public class LanacRepository : IDisposable, ILanacRepository
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        protected void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (db != null)
                {
                    db.Dispose();
                    db = null;
                }
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        public IQueryable<Lanac> GetAll()
        {
            return db.Lanci;
        }

        public Lanac GetById(int id)
        {
            return db.Lanci.Find(id);
        }

        public IQueryable<Lanac> Tradicija()
        {
            var lanac = db.Lanci;
            var rezultat = lanac.OrderBy(x => x.GodinaOsnivanja).Take(2);
            return rezultat;
        }

    }
}