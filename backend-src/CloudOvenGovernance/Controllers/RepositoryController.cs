

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using CloudOvenGovernance.Dtos;
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
        private const string REPOSCHEMAPATH = "resources/repository.json";
        private ILogger<RepositoryController> _logger = default(ILogger<RepositoryController>);

        private GitHttpClient _gitClient = default(GitHttpClient);

        public RepositoryController(ILogger<RepositoryController> logger, VssConnection connection)
        {
            this._logger = logger;
            this._gitClient = connection.GetClient<GitHttpClient>(); 
        }

        #endregion

        [HttpPost("{repositoryId}")]
        public async Task UpdateAsync(
            Guid projectId, Guid repositoryId, 
            [FromBody]ResourceChangePayload payload)
        {
            var purpose = payload.Purpose;
            var repoName = $"{purpose}-ResourceAsCode";
            var master = "master";

            var targetRepoName = GetRepoName(payload);

            var repositories = await EnsureIaCRepositoryAsync(projectId, purpose, repoName);
            var repository = repositories
                .FirstOrDefault(g => g.Name.Equals(repoName, StringComparison.OrdinalIgnoreCase));

            if (repository != null)
            {
                var references = await _gitClient.GetRefsAsync(repository.Id);

                if (!references.Any(r => r.Name.EndsWith("master", StringComparison.OrdinalIgnoreCase)))
                {
                    await CreateMasterBranchAsync(_gitClient, repository, purpose);
                }

                references = await _gitClient.GetRefsAsync(repository.Id);
                var masterRef = references
                    .FirstOrDefault(r => r.Name.EndsWith(master, StringComparison.OrdinalIgnoreCase));

                await CreateCommitsAndPullRequest(_gitClient, repository, masterRef, targetRepoName);
            }
        }



        [HttpGet]
        public async Task<IEnumerable<GitRepository>> GetAsync(Guid projectId)
        {
            var repo = await _gitClient.GetRepositoriesAsync(projectId);

            return repo;
        }

        #region Private methods

        private async Task<List<GitRepository>> EnsureIaCRepositoryAsync(
            Guid projectId, string purpose, string repoName)
        {
            var repositories = await _gitClient.GetRepositoriesAsync(projectId);

            // If there is not yet a purpose repo create
            if (!repositories.Any(g => g.Name.Equals(repoName, StringComparison.OrdinalIgnoreCase)))
            {
                await _gitClient.CreateRepositoryAsync(new GitRepositoryCreateOptions
                {
                    Name = repoName,
                    ProjectReference = new Microsoft.TeamFoundation.Core.WebApi.TeamProjectReference
                    {
                        Id = projectId
                    }
                });
                repositories = await _gitClient.GetRepositoriesAsync(projectId);
            }

            return repositories;
        }


        private static async Task CreateCommitsAndPullRequest(
            GitHttpClient gitClient, GitRepository repository, GitRef masterRef, string targetRepoName)
        {
            var timeStamp = DateTime.UtcNow;
            var tick = $"{timeStamp.Day}-{timeStamp.ToString("MMM").ToLower()}-{timeStamp.Year}-{timeStamp.Hour}-{timeStamp.Minute}";
            var branchName = $"branch-{tick}";
            var branchRef = $"refs/heads/{branchName}";
            var masterBranchRef = $"refs/heads/master";


            var content = await new StreamReader(
                await gitClient.GetItemContentAsync(repository.Id, REPOSCHEMAPATH))
                .ReadToEndAsync();

            var resourceGraph = JsonSerializer.Deserialize<RepositoryCollection>(content);
            var newRepo = new RepositoryTemplate();
            newRepo.Properties.Name = targetRepoName;
            resourceGraph.Resources.Add(newRepo);

            await gitClient.CreatePushAsync(new GitPush
            {
                RefUpdates = new List<GitRefUpdate>
                        {
                            new GitRefUpdate
                            {
                                Name = branchRef,
                                OldObjectId = masterRef.ObjectId
                            }
                        },
                Commits = new List<GitCommitRef>
                        {
                            new GitCommitRef
                            {
                                Comment = $"Changes added to the {branchName}",
                                Changes = new List<GitChange>
                                {
                                  new GitChange
                                    {
                                        ChangeType = VersionControlChangeType.Edit,
                                        Item = new GitItem { Path = REPOSCHEMAPATH },
                                        NewContent = new ItemContent
                                        {
                                            ContentType = ItemContentType.RawText,
                                            Content = JsonSerializer.Serialize(resourceGraph, new JsonSerializerOptions
                                            {
                                                WriteIndented = true
                                            })
                                        }
                                    }
                                }
                            }
                        }
            }, repository.Id);

            await gitClient.CreatePullRequestAsync(new GitPullRequest
            {
                SourceRefName = branchRef,
                TargetRefName = masterBranchRef,
                Title = $"Pull request {branchName}"
            }, repository.Id);
        }

        private static async Task CreateMasterBranchAsync(
            GitHttpClient gitClient, GitRepository repository, string purposeId)
        {
            var branchName = "master";
            var branchRef = $"refs/heads/{branchName}";
            var emptyId = "0000000000000000000000000000000000000000";
                 
            var initResources = new RepositoryCollection();
            initResources.PurposeId = purposeId;
            initResources.Resources.Clear();

            await gitClient.CreatePushAsync(new GitPush
            {
                RefUpdates = new List<GitRefUpdate>
                        {
                            new GitRefUpdate
                            {
                                Name = branchRef,
                                OldObjectId = emptyId
                            }
                        },
                Commits = new List<GitCommitRef>
                        {
                            new GitCommitRef
                            {
                                Comment = $"Initialized the {branchName} branch.",
                                Changes = new List<GitChange>
                                {
                                    new GitChange
                                    {
                                        ChangeType = VersionControlChangeType.Add,
                                        Item = new GitItem { Path = "Readme.md" },
                                        NewContent = new ItemContent
                                        {
                                            ContentType = ItemContentType.RawText,
                                            Content = "This repository contains the resources as code."
                                        }
                                    },
                                    new GitChange
                                    {
                                        ChangeType = VersionControlChangeType.Add,
                                        Item = new GitItem { Path = REPOSCHEMAPATH },
                                        NewContent = new ItemContent
                                        {
                                            ContentType = ItemContentType.RawText,
                                            Content = JsonSerializer.Serialize(initResources, new JsonSerializerOptions
                                            {
                                                WriteIndented = true
                                            })
                                        }
                                    }
                                }
                            }
                        }
            }, repository.Id);
        }


        private string GetRepoName(ResourceChangePayload payload)
        {
            var defaultPurpose = "P000123";
            var defaultRepoName = $"Repository-{DateTime.Now.Ticks}";

            if (payload != null)
            {
                var name = payload.RepositoryNames.FirstOrDefault() ?? defaultRepoName;
                var purpose = string.IsNullOrWhiteSpace(payload.Purpose) ? defaultPurpose : payload.Purpose;

                if (!name.StartsWith(purpose, StringComparison.OrdinalIgnoreCase))
                {
                    name = $"{purpose}-{name}";
                }

                return name;
            }
            return $"{defaultPurpose}-{defaultRepoName}";
        }
        #endregion
    }
}
