using AutoMapper;
using AutoMapper.QueryableExtensions;
using HotelWebApi.Interfaces;
using HotelWebApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;

namespace HotelWebApi.Controllers
{
    public class HoteliController : ApiController
    {
        IHotelRepository repo { get; set; }

        public HoteliController(IHotelRepository repository)
        {
            repo = repository;
        }

        //GET api/hoteli
        [ResponseType(typeof(HotelDTO))]
        public IQueryable<HotelDTO> GetAll()
        {
            return repo.GetAll().ProjectTo<HotelDTO>();
        }

        //GET route api/hoteli/{id}
        [Authorize]
        [ResponseType(typeof(HotelDTO))]
        public IHttpActionResult GetById(int id)
        {
            var hotel = repo.GetById(id);
            if (hotel == null)
            {
                return NotFound();
            }
            return Ok(Mapper.Map<HotelDTO>(hotel));
        }

        //POST api/hoteli/
        [Authorize]
        [ResponseType(typeof(HotelDTO))]
        public IHttpActionResult Post(Hotel hotel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            repo.Add(hotel);

            return CreatedAtRoute("DefaultApi", new { id = hotel.Id }, Mapper.Map<HotelDTO>(hotel));
        }
        //PUT api/hoteli/2
        [Authorize]
        [ResponseType(typeof(HotelDTO))]
        public IHttpActionResult Put(int id, Hotel hotel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (id != hotel.Id)
            {
                return BadRequest();
            }
            try
            {
                repo.Update(hotel);
            }
            catch (Exception)
            {

                return BadRequest();
            }
            return Ok(Mapper.Map<HotelDTO>(hotel));
        }


        //DELETE api/hoteli/{id}
        [Authorize]
        [ResponseType(typeof(void))]
        [HttpDelete]
        public IHttpActionResult Delete(int id)
        {
            var hotel = repo.GetById(id);
            if (hotel == null)
            {
                return NotFound();
            }
            repo.Delete(hotel);
            return CreatedAtRoute("DefaultApi", new { id = hotel.Id }, HttpStatusCode.NoContent);

        }

        [Route("api/sobe")]
        [ResponseType(typeof(HotelDTO))]
        [HttpPost]
        public IHttpActionResult PostSobe(int granica)
        {
            var lanac = repo.PostSobe(granica);
            if (lanac.Count() == 0)
            {
                return NotFound();
            }
            return Ok(lanac.ProjectTo<HotelDTO>());
        }

        [Route("api/zaposleni")]
        [ResponseType(typeof(Lanac))]
        [HttpGet]
        public IHttpActionResult GetByZaposleni()
        {
            var lanac = repo.GetByZaposleni();
            if (lanac.Count() == 0)
            {
                return NotFound();
            }
            return Ok(lanac);
        }

        [Route("api/hoteli/zaposleni")]
        [ResponseType(typeof(HotelDTO))]
        [HttpGet]
        public IHttpActionResult GetZaposleniMinimum(int minimum)
        {
            if (!(minimum > 0))
            {
                return BadRequest();
            }
            var hoteli = repo.GetZaposleniMinimum(minimum);
            if (hoteli.Count() == 0)
            {
                return NotFound();
            }
            return Ok(hoteli.ProjectTo<HotelDTO>());
        }

        // api/hoteli/kapacitet?najmanje=140&najvise=200
        [Route("api/kapacitet")]
        [ResponseType(typeof(HotelDTO))]
        [HttpPost]
        public IHttpActionResult Post(int najmanje, int najvise)
        {
            if (najmanje < 9 || najvise < 9)
            {
                return BadRequest();
            }
            else if (najmanje > 999 || najvise > 999)
            {
                return BadRequest();
            }
            else if (najmanje > najvise)
            {
                return BadRequest();
            }
            var hoteli = repo.Kapacitet(najmanje, najvise);
            if (hoteli.Count() == 0)
            {
                return NotFound();
            }
            return Ok(hoteli.ProjectTo<HotelDTO>());
        }
    }
}
