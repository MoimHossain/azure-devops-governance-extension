using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.TeamFoundation.Build.WebApi;
using Microsoft.VisualStudio.Services.ReleaseManagement.WebApi;
using Microsoft.VisualStudio.Services.ReleaseManagement.WebApi.Clients;
using Microsoft.VisualStudio.Services.WebApi;


namespace CloudOvenGovernance.Controllers
{
    [Route("api/{projectId}/[controller]")]
    [ApiController]
    [Authorize]
    public class PipelineController : ControllerBase
    {
        #region Constructions
        private const string REPOSCHEMAPATH = "resources/repository.json";
        private ILogger<PipelineController> _logger = default(ILogger<PipelineController>);

        private BuildHttpClient _buildClient = default(BuildHttpClient);
        private ReleaseHttpClient _releaseClient = default(ReleaseHttpClient);

        public PipelineController(ILogger<PipelineController> logger, VssConnection connection)
        {
            this._logger = logger;
            this._buildClient = connection.GetClient<BuildHttpClient>();
            this._releaseClient = connection.GetClient<ReleaseHttpClient>();
        }

        #endregion


        [HttpGet("builds")]
        public async Task<IEnumerable<BuildDefinitionReference>> ListBuildDefinitionsAsync(Guid projectId)
        {
            var buildDefinitions = new List<BuildDefinitionReference>();
            var continuationToken = string.Empty;
            do
            {
                var buildDefinitionsPage = await _buildClient.GetDefinitionsAsync2(
                    project: projectId,
                    continuationToken: continuationToken);

                buildDefinitions.AddRange(buildDefinitionsPage);

                continuationToken = buildDefinitionsPage.ContinuationToken;
            } while (!String.IsNullOrEmpty(continuationToken));

            return buildDefinitions;
        }

        [HttpGet("releases")]
        public async Task<IEnumerable<ReleaseDefinition>> ListReleaseDefinitionsAsync(Guid projectId)
        {
            var all = await _releaseClient.GetReleaseDefinitionsAsync(project: projectId);
            return all;
        }

    }
}
