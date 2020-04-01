using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CloudOvenGovernance.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HealthController : ControllerBase
    {
        // GET: api/Health
        [HttpGet]
        public object Get()
        {
            return new 
            {
                Status = "Healthy",
                Version = "preview-1.0.23"
            };
        }

    }
}
