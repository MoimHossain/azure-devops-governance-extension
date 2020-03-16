

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.TeamFoundation.SourceControl.WebApi;
using Microsoft.VisualStudio.Services.WebApi;

namespace CloudOvenGovernance.Controllers
{
    [ApiController]
    [Route("api/{projectId}/[controller]")]
    [Authorize]
    public class RepositoryController : ControllerBase
    {
        #region Constructions

        private readonly ILogger<RepositoryController> _logger;

        private readonly VssConnection _connection;

        public RepositoryController(ILogger<RepositoryController> logger, VssConnection connection)
        {
            _logger = logger;
            _connection = connection;
        }

        #endregion

               
        [HttpGet]
        public async Task<IEnumerable<GitRepository>> GetAsync(Guid projectId)
        {
            var gitClient = this._connection.GetClient<GitHttpClient>();

            // Get data about a specific repository
            var repo = await gitClient.GetRepositoriesAsync(projectId);

            return repo;
        }
    }
}
