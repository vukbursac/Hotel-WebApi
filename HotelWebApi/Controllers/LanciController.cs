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
    public class LanciController : ApiController
    {
        ILanacRepository repo { get; set; }

        public LanciController(ILanacRepository repository)
        {
            repo = repository;
        }

        //GET api/lanci
        public IQueryable<LanacDTO> GetAll()
        {
            return repo.GetAll().ProjectTo<LanacDTO>();
        }

        //GET route api/lanci/{id}
        [Authorize]
        [ResponseType(typeof(LanacDTO))]
        public IHttpActionResult GetById(int id)
        {
            var lanac = repo.GetById(id);
            if (lanac == null)
            {
                return NotFound();
            }
            return Ok(Mapper.Map<LanacDTO>(lanac));
        }

        [Route("api/tradicija")]
        [ResponseType(typeof(LanacDTO))]
        [HttpGet]
        public IHttpActionResult GetTradicija()
        {
            var najstariji = repo.Tradicija();
            if (najstariji.Count() == 0)
            {
                return NotFound();
            }
            return Ok(najstariji.ProjectTo<LanacDTO>());
        }
    }
}
