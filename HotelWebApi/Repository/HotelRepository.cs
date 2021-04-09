using HotelWebApi.Interfaces;
using HotelWebApi.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Web;

namespace HotelWebApi.Repository
{
    public class HotelRepository : IDisposable, IHotelRepository
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

        public IQueryable<Hotel> GetAll()
        {
            return db.Hoteli.OrderBy(x => x.GodinaOtvaranja);
        }

        public Hotel GetById(int id)
        {
            return db.Hoteli.Find(id);
        }

        public void Add(Hotel hotel)
        {
            db.Hoteli.Add(hotel);
            db.SaveChanges();
        }

        public void Update(Hotel hotel)
        {
            db.Entry(hotel).State = EntityState.Modified;
            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
        }

        public void Delete(Hotel hotel)
        {
            db.Hoteli.Remove(hotel);
            db.SaveChanges();
        }

        public IQueryable<LanacProsekDTO> GetByZaposleni()
        {
            var hoteli = GetAll();
            var rezultat = hoteli.GroupBy(x => x.Lanac, x => x.BrojZaposlenih, (lanac, broj) => new LanacProsekDTO()
            {
                Id = lanac.Id,
                Naziv = lanac.Naziv,
                Prosek = broj.Average(),
            }).OrderByDescending(x => x.Prosek);
            return rezultat;
        }

        public IQueryable<LanacSobeDTO> PostSobe(int granica)
        {
            var hoteli = GetAll();
            var rezultat = hoteli.GroupBy(x => x.Lanac, x => x.BrojSoba, (lanac, broj) => new LanacSobeDTO()
            {
                Id = lanac.Id,
                Naziv = lanac.Naziv,
                BrojSoba = broj.Sum(),
            }).OrderBy(x => x.BrojSoba);
            var rezultatKonacni = rezultat.Where(x => x.BrojSoba > granica);
            return rezultatKonacni;

        }

        public IQueryable<Hotel> GetZaposleniMinimum(int minimum)
        {
            return db.Hoteli.Where(x => x.BrojZaposlenih >= minimum).OrderBy(x => x.BrojZaposlenih);
        }

        public IQueryable<Hotel> Kapacitet(int najmanje, int najvise)
        {
            return db.Hoteli.Where(x => x.BrojSoba > najmanje && x.BrojSoba < najvise).OrderByDescending(x => x.BrojSoba);
        }

    }
}